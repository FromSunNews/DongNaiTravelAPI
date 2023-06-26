import { ContentModel } from 'models/content.model'
import { MapModel } from 'models/map.model'
import { RedisQueueProvider } from 'providers/RedisQueueProvider'

import { env } from 'config/environtment'
import { TextToSpeechProvider } from 'providers/TextToSpeechProvider'
import { TextToSpeechConstants } from 'utilities/constants'
import { SendMessageToSlack } from 'providers/SendMessageToSlack'
import axios from 'axios'
import { cloneDeep } from 'lodash'
import { ChatGptProvider } from 'providers/ChatGptProvider'

// const createNew = async (data) => {
//   console.log('🚀 ~ file: content.service.js:7 ~ createNew ~ data:', data)
//   // data sẽ có dạng :
//   // data = {
//   //   place_id: '123521543hfngdsh',
//   //   plainText: 'abc...',
//   //   plainTextMarkFormat: '### abc...'
//   // }
//   try {
//     // Data sẽ phải có thằng place_id để biết lưu vào
//     // Phải có plainTextMarkFormat vì đây là cái người dùng đóng góp
//     // Phải có plainText để khi người dùng gọi xuóng lấy giọng nói thì sẽ có plainText để call text_to_speech API

//     // Mới đầu ssẽ phải tìm xem thằng place_id (nó là thằng content_id trong model content) nó có chưa ?
//     const existContent = await ContentModel.findOneByContentId(data.place_id)
//     console.log('🚀 ~ file: content.service.js:28 ~ createNew ~ existContent:', existContent)
//     if (existContent) {
//       throw new Error('Content for this place was exsist.')
//     }

//     // Sau đó luuw và db content
//     const createdContent = await ContentModel.createNew({
//       content_id: data.place_id,
//       plainText: data.plainText,
//       plainTextMarkFormat: data.plainTextMarkFormat
//     })

//     let getContent
//     if (createdContent.insertedId) {
//       // khi lưu xong chúng ta phải cập nhật thằng map nữa
//       // chúng ta lấy objectId của thnăgf content lưu vào luôn và không cần chờ
//       await MapModel.updateByPlaceId(data.place_id, {
//         content_id: createdContent.insertedId.toString()
//       })
//       // Giờ lấy content để trả về
//       getContent = await ContentModel.findOneById(createdContent.insertedId.toString())
//     } else throw new Error('Could not create content')

//     // Giờ trả thằng content về
//     return getContent

//   } catch (error) {
//     throw new Error(error)
//   }
// }

// sử dụng createNew khi mà người dùng đóng góp bài viết dưới dạng markdown
const createNew = async (data) => {
  console.log('🚀 ~ file: content.service.js:7 ~ createNew ~ data:', data)
  // data sẽ có dạng :
  // data = {
  //   place_id: '123521543hfngdsh',
  //   plainText: {
  //   vi: "",
  //   en: ""
  // },
  //   plainTextMarkFormat: {
  //   vi: "",
  //   en: ""
  // }
  try {
    // Data sẽ phải có thằng place_id để biết lưu vào
    // Phải có plainTextMarkFormat vì đây là cái người dùng đóng góp
    // Phải có plainText để khi người dùng gọi xuóng lấy giọng nói thì sẽ có plainText để call text_to_speech API

    // Mới đầu ssẽ phải tìm xem thằng place_id (nó là thằng content_id trong model content) nó có chưa ?
    const existContent = await ContentModel.findOneByContentId(data.place_id)
    // console.log('🚀 ~ file: content.service.js:28 ~ createNew ~ existContent:', existContent)
    if (existContent) {
      throw new Error('Content for this place was exsist.')
    }

    const plainTextBase64 = {
      vi: {

      },
      en: {

      }
    }
    const fullTextToSpeech = ['VN_FEMALE_1', 'VN_MALE_1', 'EN_FEMALE_1', 'EN_MALE_1']
    await axios.all(
      fullTextToSpeech.map((textToSpeechId, index) => axios.post(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${env.MAP_API_KEY}`,
        {
          input: {
            text: index < 2 ? data.plainText.vi : data.plainText.en
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
    ).then(
      async (responses) => {
        responses.map((res, index) => {
          if (index < 2) {
            plainTextBase64['vi'][fullTextToSpeech[index]] = res.data.audioContent
          } else {
            plainTextBase64['en'][fullTextToSpeech[index]] = res.data.audioContent
          }
        })
      }
    ).catch(err => console.log(err))
    // console.log('🚀 ~ file: content.service.js:55 ~ responses.map ~ plainTextBase64:', plainTextBase64)

    // Sau đó luuw và db content
    const createdContent = await ContentModel.createNew({
      content_id: data.place_id,
      plainText: data.plainText,
      plainTextMarkFormat: data.plainTextMarkFormat,
      plainTextBase64: plainTextBase64
    })

    let getContent
    if (createdContent.insertedId) {
      // khi lưu xong chúng ta phải cập nhật thằng map nữa
      // chúng ta lấy objectId của thnăgf content lưu vào luôn và không cần chờ
      await MapModel.updateByPlaceId(data.place_id, {
        content_id: createdContent.insertedId.toString()
      })
      // Giờ lấy content để trả về
      getContent = await ContentModel.findOneById(createdContent.insertedId.toString())
    } else throw new Error('Could not create content')

    // Giờ trả thằng content về
    return getContent

  } catch (error) {
    throw new Error(error)
  }
}

const getTextToSpeechTesting = async (data) => {
  console.log('🚀 ~ file: content.service.js:7 ~ createNew ~ data:', data)
  // data sẽ có dạng :
  // data = {
  //   place_id: '123521543hfngdsh',
  //   textToSpeechId: 'VN_FEMALE_1' || 'VN_FEMALE_2' || 'VN_MALE_1' || 'VN_MALE_2' || 'EN_FEMALE_1' || 'EN_FEMALE_2' || 'EN_MALE_1' || 'EN_MALE_2'
  // }
  try {
    const textToSpeech = await TextToSpeechProvider.generateSpeech({
      text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it ting and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it ting and typesettin',
      languageCode: TextToSpeechConstants[data.textToSpeechId].languageCode,
      name: TextToSpeechConstants[data.textToSpeechId].name
    })

    return textToSpeech

  } catch (error) {
    throw new Error(error)
  }
}

// sử dụng getTextToSpeech khi mà người click vào btn giọng đọc
const getTextToSpeech = async (data) => {
  console.log('🚀 ~ file: content.service.js:7 ~ createNew ~ data:', data)
  // data sẽ có dạng :
  // data = {
  //   place_id: '123521543hfngdsh',
  //   textToSpeechId: 'VN_FEMALE_1' || 'VN_FEMALE_2' || 'VN_MALE_1' || 'VN_MALE_2' || 'EN_FEMALE_1' || 'EN_FEMALE_2' || 'EN_MALE_1' || 'EN_MALE_2'
  // }
  try {
    // DATA CÓ THỂ LÀ MỘT TRONG 8 GIỌNG ĐỌC BAO GỒM CẢ EN VÀ VN
    // Mới đầu ssẽ phải tìm có giọng đọc đó chưa nếu có thì lấy trae về luôn

    let result
    const existContent = await ContentModel.findOneByContentId(data.place_id)
    console.log('🚀 ~ file: content.service.js:72 ~ getTextToSpeech ~ existContent:', existContent)
    if (!existContent?.plainTextBase64[data.textToSpeechId]) {
      console.log('Vao call api')
      // Nghĩa là trong đây chưa có giọng nói nào cả chúng ta sẽ lấy 1 giọng nói trước
      // sau đó là lấy 7 giọng nói sau ở trong background job
      const textToSpeech = await TextToSpeechProvider.generateSpeech({
        text: existContent.plainText,
        languageCode: TextToSpeechConstants[data.textToSpeechId].languageCode,
        name: TextToSpeechConstants[data.textToSpeechId].name
      })
      console.log('🚀 ~ file: content.service.js:81 ~ getTextToSpeech ~ textToSpeech:', textToSpeech)
      result = textToSpeech
      // Sau đó lưu vào db content (không cần chờ)
      existContent.plainTextBase64[data.textToSpeechId] = textToSpeech
      // ContentModel.updateById(existContent._id.toString(), {
      //   plainTextBase64: existContent.plainTextBase64
      // })

      console.log('🚀 ~ file: content.service.js:85 ~ getTextToSpeech ~ existContent:', existContent)
      // Sau đó gọi 7 giọng nói còn lại
      // Chạy backgroundjobs
      // Bước 1: Khởi tạo một hàng đợi
      let updatedTextToSpeech = RedisQueueProvider.generateQueue('updatedTextToSpeech')
      // Bước 2: Định nghĩa ra những việc cần làm trong tiến trình hàng đợi
      updatedTextToSpeech.process(async (job, done) => {
        try {
          // job.data ở đây chính là updatedUser được truyền vào từ bước 4
          const existContentClone = cloneDeep(job.data)
          const fullTextToSpeech = ['VN_FEMALE_1', 'VN_FEMALE_2', 'VN_MALE_1', 'VN_MALE_2', 'EN_FEMALE_1', 'EN_FEMALE_2', 'EN_MALE_1', 'EN_MALE_2']
          // Lọc ra những thằng chưa có giọng đọc
          const textToSpeechToCallApi = fullTextToSpeech.filter(textToSpeechId => textToSpeechId !== data.textToSpeechId)

          await axios.all(
            textToSpeechToCallApi.map(textToSpeechId => axios.post(
              `https://texttospeech.googleapis.com/v1/text:synthesize?key=${env.MAP_API_KEY}`,
              {
                input: {
                  text: existContentClone.plainText
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
          ).then(
            async (responses) => {
              responses.map((res, index) => {
                existContentClone.plainTextBase64[textToSpeechToCallApi[index]] = res.data.audioContent
              })

              const resultUpdated = await ContentModel.updateById(existContentClone._id.toString(), {
                plainTextBase64: existContentClone.plainTextBase64
              })
              done(null, resultUpdated)
            }
          ).catch(err => console.log(err))
        } catch (error) {
          done(new Error('Error from updatedTextToSpeech.process'))
        }
      })
      // B3: Check completed hoặc failed, tùy trường hợp yêu cầu mà cần cái event này, để bắn thông báo khi job chạy xong chẳng hạn
      // Nhiều event khác: https://github.com/OptimalBits/bull/blob/HEAD/REFERENCE.md#events
      updatedTextToSpeech.on('completed', (job, result) => {
        // Bắn kết quả về Slack
        SendMessageToSlack.sendToSlack(`Job với id là: ${job.id} và tên job: *${job.queue.name}* đã *xong* và kết quả là: ${result}`)
      })

      updatedTextToSpeech.on('failed', (job, error) => {
        // Bắn lỗi về Slack hoặc Telegram ...
        SendMessageToSlack.sendToSlack(`Notification: Job với id là ${job.id} và tên job là *${job.queue.name}* đã bị *lỗi* \n\n ${error}`)
      })

      // Bước 4: bước quan trọng cuối cùng: Thêm vào vào đợi Redis để xử lý
      updatedTextToSpeech.add(existContent, {
        attempts: 2, // số lần thử lại nếu lỗi
        backoff: 5000 //khoảng thời gian delay giữa các lần thử lại job
      })
    } else {
      console.log('khong vao call api')
      // tùy theo yêu cầu trả về ở đây t chỉ trả về mỗi textToSpeech
      result = {
        textToSpeech: existContent.plainTextBase64[data.textToSpeechId]
      }
    }

    return result

  } catch (error) {
    throw new Error(error)
  }
}

const suggestTitle = async (data) => {
  console.log('🚀 ~ file: content.service.js:7 ~ createNew ~ data:', data)
  // data sẽ có dạng :
  // data = {
  //   title: 'Địa điểm du lịch mùa hè 2023',
  //   numberOfTitle: 10
  // }
  try {
    const query = `Bạn là một người tạo ra những tiêu đề thu hút khách hàng. Hãy giúp tôi tạo ra ${data.numberOfTitle} tiêu đề dựa vào tiêu đề sau đây "${data.title}". Chú ý dữ liệu trả về phải sát nghĩa ban đầu, bằng tiếng việt và mỗi tiều đề phải được đặt trong [] ngăn cách nhau bởi dấu |. Ví dụ "[title1]|[title2]|[title3]|[title4]...|[title10]"`

    let rawTextTitle = await ChatGptProvider.textGeneration(query)

    const rawTitleArray = rawTextTitle.response.split('|')
    const titleArray = rawTitleArray.map(i => i.substring(1, i.length - 1))

    return {
      titleArray: titleArray
    }

  } catch (error) {
    throw new Error(error)
  }
}

export const ContentService = {
  createNew,
  getTextToSpeech,
  getTextToSpeechTesting,
  suggestTitle
}
