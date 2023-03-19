import axios from 'axios'
import { env } from '*/config/environtment'

import { Configuration, OpenAIApi } from 'openai'


const handleItineraryRequest = async (textInput) => {
  try {
    const configuration = new Configuration({
      apiKey: env.CHATGPT_API_KEY
    })

    const openai = new OpenAIApi(configuration)

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: textInput }]
    })
    console.log('🚀 ~ file: ChatGptProvider.js:19 ~ handleItineraryRequest ~ completion:', completion)
    console.log(completion.data.choices[0].message)

    // Xử lý dữ liệu phản hồi từ API và trả về một đối tượng lịch trình
    const message = completion.data.choices[0].message

    return message
  } catch (error) {
    console.log(error)
  }
}

export const ChatGptProvider = {
  handleItineraryRequest
}