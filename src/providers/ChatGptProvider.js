import axios from 'axios'
import { env } from 'config/environtment'

import { Configuration, OpenAIApi } from 'openai'


const handleItineraryRequest = async (content, io, socketIdMap, currentUserId) => {
  console.log('🚀 ~ file: ChatGptProvider.js:8 ~ handleItineraryRequest ~ currentUserId:', currentUserId)
  console.log('🚀 ~ file: ChatGptProvider.js:8 ~ handleItineraryRequest ~ socketIdMap:', socketIdMap)
  console.log('🚀 ~ file: ChatGptProvider.js:8 ~ handleItineraryRequest ~ io:', io)
  console.log('🚀 ~ file: ChatGptProvider.js:8 ~ handleItineraryRequest ~ content:', content)
  try {
    const configuration = new Configuration({
      apiKey: env.CHATGPT_API_KEY
    })

    const openai = new OpenAIApi(configuration)

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo', // Chọn model phù hợp
      messages: [{ role: 'user', content: content }], // cấu hình role và content mình muốn hỏi
      temperature: 0, // Đầu ra tập trung vào vào câu hỏi nhiều hơn
      stream: true // Nó sẽ trả dữ liệu về theo từng đọt
    }, {
      responseType: 'stream'
    })
    let messageReturn = ''
    completion.data.on('data', (data) => {
      const lines = data
        ?.toString()
        ?.split('\n')
        .filter((line) => line.trim() !== '')
      for (const line of lines) {
        const message = line.replace(/^data: /, '')
        if (message === '[DONE]') {
          io.to(socketIdMap[currentUserId]).emit('s_create_travel_itinerary', {
            messageReturn: 'DONE'
          })
          break // Stream finished
        }
        try {
          const parsed = JSON.parse(message)
          if (parsed.choices[0].delta.content) {
            messageReturn += parsed.choices[0].delta.content
            console.log(messageReturn)
            io.to(socketIdMap[currentUserId]).emit('s_create_travel_itinerary', {
              messageReturn: parsed.choices[0].delta.content
            })
          }
        } catch (error) {
          console.error('Could not JSON parse stream message', message, error)
        }
      }
    })
  } catch (error) {
    console.log(error)
  }
}

const textGeneration = async (queryText, action) => {
  try {

    const configuration = new Configuration({
      apiKey: env.CHATGPT_API_KEY
    })

    const openai = new OpenAIApi(configuration)

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Human: ${queryText}\nAI: `,
      temperature: 0.1,
      max_tokens: 2500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6,
      stop: ['Human:', 'AI:']
    })
    return {
      response: `${response.data.choices[0].text}`.trimStart(), // loại bỏ ký tự \n đàu đòng
      action: action
    }
  } catch (error) {
    return {
      response: 'Sorry, I\'m not able to help with that.',
      action: action
    }
  }
}

export const ChatGptProvider = {
  handleItineraryRequest,
  textGeneration
}