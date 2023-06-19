import { ObjectId } from 'mongodb'

import { TextToSpeechProvider } from 'providers/TextToSpeechProvider'
import { TextToSpeechConstants } from 'utilities/constants'

import { BlogContentModel } from 'models/blog_content'

import {
  BlogContentDataProps
} from 'types/index'

const BlogCloudinaryFolders = {
  blog_speechs: 'blog_speechs'
}

/**
 * @typedef ServiceCreateBlogContentOptions
 * @property {boolean} shouldGenerateSpeech
 */

/**
 * Hàm này dùng để xử lý và tạo một blog content. Tuy nhiên thì không tạo giọng đọc
 * @param {BlogContentDataProps} data dữ liệu của blog content cần thêm vào
 * @param {shouldGenerateSpeech} options lựa chọn khi tạo blog.
 * @returns
 */
async function createBlogContent(data, options) {
  try {
    options = Object.assign({
      shouldGenerateSpeech: false
    }, options)

    const result = await BlogContentModel.insertOneBlogContent(data)
    return result
  } catch (error) {
    console.error(error.message)
    return undefined
  }
}

export const BlogContentService = {
  createBlogContent
}