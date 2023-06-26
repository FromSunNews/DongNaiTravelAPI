import axios from 'axios'
import { Buffer } from 'buffer'
import { CloudinaryProvider } from 'providers/CloudinaryProvider'

import { BlogModel } from 'models/blog'
import { BlogContentModel } from 'models/blog_content'

import { TextToSpeechConstants } from 'utilities/constants'
import {
  getBase64PhotoInMD,
  replaceBase64PhotoWithLink,
  removeMDFromString,
  countWord
} from 'utilities/string'
import {
  wait
} from 'utilities/function'
import { CloudinaryFolders } from 'utilities/constants'

import { env } from 'config/environtment'

/**
 * Message của event này nhận được từ server có thể là:
 * {
 *   status: {
 *     isOff: boolean,
 *     isUploadDone: boolean // Cho biết là tải hết dữ liệu hay chưa?
 *   },
 *   chunk: any // Cài này là từng phần của blog khi upload.
 * }
 */

/**
 * @typedef BlogCreateEventStatusProps
 * @property {boolean} isDone Cho biết là sự kiện tạo Blog đã xong hay chưa?
 * @property {boolean} isError Cho biết sự kiện này đã bị lỗi, có thể là ở chỗ nào đó.
 * @property {boolean} canUpload Cho biết là có thể upload tiếp được không? Dùng khi đang upload content.
 * @property {number} progress Cho biết tiến trình đã được bao nhiêu %
 */

/**
 * Hàm này dùng để tạo message gửi về cho client của sự kiện `create:blog`
 */
function createMessage(status, text = '', data = undefined) {
  status = Object.assign({
    isDone: false,
    isError: false,
    progress: 0
  }, status)

  return {
    status,
    text,
    data
  }
}

/**
 * Hàm này dùng để tạo một blog và có thể theo dõi được tiến trình tạo blog. Như là
 * - Tải blog lên
 * - Xử lý ảnh
 * - Tải ảnh lên Cloudianary
 * - Content vào trong DB
 * - Cuối cùng là gửi lại cho người dùng
 *
 * Cho đến khi nào blog đã được thêm vào trong DB thì có nghĩa là event này kết thúc.
 * @param io io (Server instance) của Socket.io
 * @param socket socket của mỗi một connection.
 */
export function createBlog(io, socket, eventName) {
  let blogContent = ''
  let isUploadDone
  let totalSize
  let uploadedChunkSize
  let fullTextToSpeech = ['VN_FEMALE_1', 'VN_MALE_1']
  // let fullTextToSpeech = ['VN_FEMALE_1', 'VN_MALE_1', 'EN_FEMALE_1', 'EN_MALE_1']

  /**
   * Event `create:blog` sẽ hoạt động theo 2 giai đoạn:
   * - Giai đoạn 1: upload blog, client sẽ gửi message nhiều lần cho server (tuỳ thuộc vào dung lượng content của user).
   * - Giai đoạn 2: sau khi upload xong, tới bước này thì client sẽ không gửi message cho user nữa mà server sẽ tiến
   * hành xử lý content của blog. Với mỗi bước xong thì server sẽ gửi message lại cho client.
   *
   * Việc gọi hàm handler event sẽ luôn được execute, nhưng tuỳ thuộc vào `status.isUploadDone` mà nó sẽ chuyến từ GĐ 1
   * sang GĐ 2 như đã đề cập ở trên.
   *
   */
  socket.on(eventName, async (message) => {
    try {
      if (message.status?.isOff) socket.off(eventName)
      if (!isUploadDone && message.status?.isUploadDone) isUploadDone = message.status?.isUploadDone
      if (isUploadDone) {
        // Giai đoạn 2
        // Phía client thông báo là đã upload xong thì thông báo lại tổng tiến trình cho client.
        // Đồng thời sẽ tiến hành xử lý blog theo các bước.
        // Nếu vào tới đây rồi thì chỉ còn chạy một lần duy nhất thôi.
        await wait(() => {}, 2000)
        socket.emit(eventName, createMessage({ progress: 20 }, 'Processing blog\'s content...'))

        let data = JSON.parse(blogContent)
        let { content, blog } = data
        let [base64Photos, newContent] = getBase64PhotoInMD(content)

        base64Photos.unshift(blog.avatar)

        let base64PhotoBuffers = base64Photos.map(base64Photo => Buffer.from(base64Photo))
        let base64SpeechBuffers
        let base64SpeechLinks
        let completeContent = content
        let plainText

        let insertedContent

        plainText = removeMDFromString(newContent)
        socket.emit(eventName, createMessage({ progress: 40 }, 'Processing blog\'s content done'))
        console.log('Number of photos (include avatar image): ', base64PhotoBuffers.length)

        socket.emit(eventName, createMessage({ progress: 50 }, 'Uploading images to image server...'))
        let [blogAvatarLink, ...photoLinks] = await CloudinaryProvider.streamUploadMutiple(base64PhotoBuffers, {
          folder: CloudinaryFolders.blog.blog_photos
        })
        await wait(() => {}, 1500)
        console.log('Photo links: ', photoLinks)
        socket.emit(eventName, createMessage({ progress: 75 }, 'Upload images to image server done'))

        if (photoLinks.length >= 1) {
          let links = photoLinks.map(photoLink => photoLink.url)
          completeContent = replaceBase64PhotoWithLink(content, links)
        }

        let contentDoc = {
          plainText: plainText,
          plainTextMarkFormat: completeContent,
          speech: {
            VN_FEMALE_1: '',
            VN_MALE_1: ''
          }
        }

        socket.emit(eventName, createMessage({ progress: 80 }, 'Creating speech...'))
        let base64SpeechResponses = await axios.all(
          fullTextToSpeech.map((textToSpeechId) => axios.post(
            `https://texttospeech.googleapis.com/v1/text:synthesize?key=${env.MAP_API_KEY}`,
            {
              input: {
                text: plainText
              },
              voice: {
                languageCode: TextToSpeechConstants[textToSpeechId].languageCode,
                name: TextToSpeechConstants[textToSpeechId].name
              },
              audioConfig: {
                audioEncoding: 'mp3'
              }
            }
          ))
        ).catch(err => {
          console.log('Lỗi gọi gg api nè ba:', err)
        })
        base64SpeechBuffers = base64SpeechResponses.map(base64SpeechResponse => {
          let base64 = 'data:audio/mpeg;base64,' + base64SpeechResponse.data.audioContent
          console.log('Base64 audio: ', base64.substring(0, 100))
          return Buffer.from(base64)
        })

        socket.emit(eventName, createMessage({ progress: 85 }, 'Uploading speech...'))
        base64SpeechLinks = await CloudinaryProvider.streamUploadMutiple(base64SpeechBuffers, {
          folder: CloudinaryFolders.blog_content.blog_speechs,
          resource_type: 'auto'
        })

        base64SpeechLinks.forEach((base64SpeechLink, index) => {
          contentDoc.speech[fullTextToSpeech[index]] = base64SpeechLink.url
        })

        insertedContent = await BlogContentModel.insertOneBlogContent(contentDoc)

        await wait(() => {}, 1000)
        socket.emit(eventName, createMessage({ progress: 95 }, 'Blog content added'))

        blog.contentId = insertedContent.insertedId.toString()
        blog.avatar = blogAvatarLink.url
        blog.readTime = Math.floor(countWord(plainText) / 200 * 60)
        blog.speechStatus = 'AVAILABLE'

        const insertResult = await BlogModel.insertOneBlog(blog)
        await wait(() => {}, 1000)

        blogContent = ''
        isUploadDone = undefined
        uploadedChunkSize = undefined
        totalSize = undefined

        socket.emit(eventName, createMessage({ isDone: true, progress: 100 }, 'Complete!', {}))
      } else {
        // Giai đoạn 1
        // Nếu như mà blog chưa upload lên xong thì tiếp tục upload tiếp.
        if (!totalSize && message.data.totalSize) {
          totalSize = message.data.totalSize
          uploadedChunkSize = 0
        }
        let jsonData = message.data.chunk.toString()
        let progress
        blogContent += jsonData
        uploadedChunkSize += message.data.chunkSize
        progress = uploadedChunkSize / totalSize * 100
        console.log('Uploading...')
        socket.emit(eventName, createMessage({ canUpload: true, progress: progress }, 'Uploading...'))
      }
    } catch (error) {
      socket.emit(eventName, createMessage({ isError: true }, error.message ))
      blogContent = ''
      isUploadDone = undefined
    }
  })
}