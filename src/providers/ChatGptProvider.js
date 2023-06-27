import axios from 'axios'
import { env } from 'config/environtment'
import { result } from 'lodash'

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

const textGenerationTest = async (queryText) => {
  try {
    const configuration = new Configuration({
      apiKey: env.CHATGPT_API_KEY
    })

    const openai = new OpenAIApi(configuration)

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo', // Chọn model phù hợp
      messages: [{ 'role': 'system', 'content': 'Bạn là rất giỏi người lập kế hoạch chuyến đi. Vui lòng tạo kế hoạch chuyến đi từ tin nhắn của người dùng. Lộ trình trong ngày chia làm 3 buổi sáng, trưa, chiều, trong đó bạn phải nêu địa điểm tham quan và miêu tả ngắn gọn bằng văn nói. bàn cần định dạng các địa điểm theo dạng [place|province]. Nếu bạn không chắc địa điểm đó có tồn tại thì đừng đưa ra và các địa điểm phải khác nhau không lặp lại. Độ dài hành trình mặc định là năm ngày nếu không được cung cấp. Trả lời theo phong cách AI bằng tiếng việt' }, { role: 'user', content: `Human: ${queryText}\nAI: ` }],
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
          return messageReturn
        }
        try {
          const parsed = JSON.parse(message)
          if (parsed.choices[0].delta.content) {
            messageReturn += parsed.choices[0].delta.content
            console.log(messageReturn)
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

// const textGenerationTest = async (queryText) => {
//   console.log('🚀 ~ file: ChatGptProvider.js:61 ~ textGeneration ~ queryText:', queryText)
//   try {

//     const configuration = new Configuration({
//       apiKey: env.CHATGPT_API_KEY
//     })

//     const openai = new OpenAIApi(configuration)

//     const completion = await openai.createChatCompletion({
//       model: 'gpt-3.5-turbo',
//       messages: [{ 'role': 'system', 'content': 'You are the best itinerary planner. Please only create itinerary from user messages. The itinerary in a day is divided into 3 mornings, noon and afternoon in which you have to give places to visit and a short description in oral form. You need to format your response by adding [] around locations with province separated by pipe. The default itinerary length is five days if not provided. Answer in AI style by Vietnamese' }, { role: 'user', content: `Human: ${queryText}\nAI: ` }],
//       temperature: 0.2
//     })
//     console.log(completion.data.choices[0].message)
//     return completion.data.choices[0].message
//   } catch (error) {
//     console.log('🚀 ~ file: ChatGptProvider.js:79 ~ textGenerationTest ~ error:', error)
//     return {
//       response: 'Sorry, I\'m not able to help with that.'
//     }
//   }
// }

const textGeneration = async (queryText) => {
  console.log('🚀 ~ file: ChatGptProvider.js:61 ~ textGeneration ~ queryText:', queryText)
  try {

    const configuration = new Configuration({
      apiKey: env.CHATGPT_API_KEY
    })

    const openai = new OpenAIApi(configuration)

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Human: ${queryText}\nAI: `,
      temperature: 0.1,
      max_tokens: 3500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6,
      stop: ['Human:', 'AI:']
    })
    return {
      response: `${response.data.choices[0].text}`.trimStart()
    }
  } catch (error) {
    return {
      response: 'Sorry, I\'m not able to help with that.'
    }
  }
}

export const ChatGptProvider = {
  handleItineraryRequest,
  textGeneration,
  textGenerationTest
}