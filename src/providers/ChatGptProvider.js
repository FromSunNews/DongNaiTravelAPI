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
    const isStop = false
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
            // console.log(messageReturn)
          }
        } catch (error) {
          console.error('Could not JSON parse stream message', message, error)
        }
      }

      if (isStop) {
        clearInterval(intervalId)
      }

    })

    const intervalId = setInterval(() => {
      if (!isStop) {
        console.log('🚀 ~ file: ChatGptProvider.js:65 ~ io.to ~ messageReturn:', messageReturn)
        io.to(socketIdMap[currentUserId]).emit('s_create_travel_itinerary', {
          messageReturn: messageReturn
        })
      }
    }, 500)
  } catch (error) {
    console.log(error)
  }
}

const handleItineraryCreate = async (question, travelPlaces, fnbPlaces, io, socketIdMap, currentUserId) => {
  console.log('🚀 ~ file: ChatGptProvider.js:62 ~ handleItineraryCreate ~ currentUserId:', currentUserId)
  console.log('🚀 ~ file: ChatGptProvider.js:62 ~ handleItineraryCreate ~ socketIdMap:', socketIdMap)
  console.log('🚀 ~ file: ChatGptProvider.js:62 ~ handleItineraryCreate ~ io:', io)
  console.log('🚀 ~ file: ChatGptProvider.js:62 ~ handleItineraryCreate ~ fnbPlaces:', fnbPlaces)
  console.log('🚀 ~ file: ChatGptProvider.js:62 ~ handleItineraryCreate ~ travelPlaces:', travelPlaces)
  console.log('🚀 ~ file: ChatGptProvider.js:62 ~ handleItineraryCreate ~ question:', question)

  try {
    const configuration = new Configuration({
      apiKey: env.CHATGPT_API_KEY
    })

    const openai = new OpenAIApi(configuration)

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo', // Chọn model phù hợp
      messages: [
        {
          role: 'system',
          content: `As a smart itinerary planner with extensive knowledge of places around the world, your task is to determine the user's travel destinations and any specific interests or preferences from their message. Create an itinerary that caters to the user's needs, making sure to name all activities, restaurants, and attractions specifically. When creating the itinerary, also consider factors such as time constraints and transportation options. Additionally, all attractions and restaurants listed in the itinerary must exist and be named specifically. During subsequent revisions, the itinerary can be modified, while keeping in mind the practicality of the itinerary. New place for each day. It's important to ensure that the number of activities per day is appropriate, and if the user doesn't specify otherwise, the default itinerary length is five days. The itinerary length should remain the same unless there is a change by the user's message.. I have the following tourist attractions: "${travelPlaces}" and eating and drinking spots as follows "${fnbPlaces}" Plan your trip from these places. You need to format your response by adding [location] around locations and the locations must be different without repeating. Note You need to use the exact name of the places provided, do not add information to the location Please provide information every day, each period of the day as much information as possible. The default itinerary length is five days if not provided. Answer AI style in Vietnamese`
        },
        {
          role: 'user',
          content: 'Tôi muốn đi Vũng tàu trong 5 ngày. Tôi xuất phát từ thành phố hồ chí minh. Tôi có sở thích tham quan các di tích lịch sử, được ăn vặt, với tham gia các hoạt động. Ngân sách của tôi là 3 triệu động cho hai người'
        },
        // {
        //   role: 'system',
        //   content: 'Here is a possible itinerary for a 5-day trip to Mali:\n\nDay 1:\n* Fly from your home city to [Mopti Airport (MOP)|Mali] in [Mopti|Mali].\n* Take a taxi to your hotel in [Mopti|Mali].\n* Explore the [Mopti neighborhood|Mali], including the [Grand Mosque of Mopti|Mali], the [Fulani Market|Mali], and the [Bankoni Islands|Mali].\n* Have dinner at a restaurant in [Mopti|Mali], such as [Chez Fatoumata|Mali].\n\nDay 2:\n* Take a boat trip to [Djenne|Mali].\n* Visit the [Great Mosque of Djenne|Mali], a UNESCO World Heritage Site.\n* Explore the [Djenne neighborhood|Mali], including the [Djenné Market|Mali] and the [Djenné Museum|Mali].\n* Return to [Mopti|Mali] in the evening.\n\nDay 3:\n* Take a day trip to [Ségou|Mali].\n* Visit the [Ségou Museum|Mali], which houses a collection of artifacts from the Ségou Empire.\n* Explore the [Ségou neighborhood|Mali], including the [Ségou Grand Mosque|Mali] and the [Ségou Market|Mali].\n* Return to [Mopti|Mali] in the evening.\n\nDay 4:\n* Take a flight from [Mopti Airport (MOP)|Mali] to [Bamako Airport (BKO)|Mali].\n* Take a taxi to your hotel in [Bamako|Mali].\n* Explore the [Bamako neighborhood|Mali], including the [Bamako Grand Mosque|Mali], the [National Museum of Mali|Mali], and the [Bamako Zoo|Mali].\n* Have dinner at a restaurant in [Bamako|Mali], such as [Chez Boubacar|Mali].\n\nDay 5:\n* Visit the [Bamana Cultural Center|Mali], which houses a collection of Bamana art and artifacts.\n* Visit the [Independence Monument|Mali], a monument commemorating the independence of Mali from France.\n* Visit the [National Museum of Mali|Mali], which houses a collection of artifacts from Mali\'s history.\n* Return to your home city.\n\nThis itinerary can be customized to fit your interests and budget. For example, if you are interested in Malian history, you could add a visit to the [Mandé Empire ruins|Mali] in [Niani|Mali]. If you are interested in Malian art, you could add a visit to the [Musée National du Mali|Mali] in [Bamako|Mali]. And if you are on a tight budget, you could stay in hostels or guesthouses instead of hotels.\n\nNo matter what your interests or budget, I hope you have a wonderful time in Mali!'
        // },
        {
          role: 'system',
          content: 'Dưới đây là một kế hoạch chi tiết cho chuyến đi 5 ngày của bạn đến Vũng Tàu:\n\nNgày 1:\n- Sáng: Từ thành phố Hồ Chí Minh, bạn có thể di chuyển đến Vũng Tàu bằng xe buýt hoặc tàu hỏa. Đến Vũng Tàu, bạn có thể nhận phòng tại khách sạn của bạn.\n- Trưa: Thưởng thức một bữa trưa ngon tại [Nhà hàng Gành Hào 1], nơi bạn có thể thưởng thức các món hải sản tươi sống.\n- Chiều: Tham quan [Bạch Dinh (White Palace Historical Cultural Relic)], một di tích lịch sử quan trọng với kiến trúc Pháp cổ điển và tầm nhìn tuyệt đẹp ra biển.\n- Tối: Dạo chơi tại [Bãi Trước], một bãi biển nổi tiếng với cát trắng và không khí trong lành. Bạn có thể thưởng thức các món ăn vặt tại các quầy hàng ven biển.\n\nNgày 2:\n- Sáng: Tham quan [Hải Đăng Vũng Tàu], một biểu tượng nổi tiếng của thành phố. Bạn có thể leo lên đỉnh hải đăng để ngắm toàn cảnh Vũng Tàu từ trên cao.\n- Trưa: Ăn trưa tại [Nhà hàng Cây Bàng], nơi bạn có thể thưởng thức các món ăn đặc sản miền Trung.\n- Chiều: Tham quan [Đồi Con Heo], một điểm đến phổ biến với tượng đài con heo và tầm nhìn đẹp ra biển.\n- Tối: Thưởng thức một bữa tối ngon tại [Nhà hàng Ngọc Dung], nơi bạn có thể thưởng thức các món hải sản tươi sống.\n\nNgày 3:\n- Sáng: Tham quan [Linh Sơn Cổ Tự], một ngôi chùa cổ nằm trên đỉnh núi, nơi bạn có thể tìm hiểu về đạo Phật và thưởng ngoạn cảnh quan xung quanh.\n- Trưa: Ăn trưa tại [Nhà hàng hải sản Lâm Đường - Vũng Tàu], nơi bạn có thể thưởng thức các món hải sản tươi sống với giá phải chăng.\n- Chiều: Tham quan [Tượng Đài Liệt Sỹ], một tượng đài tưởng nhớ các liệt sỹ đã hy sinh trong cuộc chiến tranh.\n- Tối: Dạo chơi tại [Bãi Sau], một bãi biển yên tĩnh và không quá đông đúc. Bạn có thể thưởng thức các món ăn vặt tại các quầy hàng ven biển.\n\nNgày 4:\n- Sáng: Tham quan [Đền Thánh Đức Mẹ Bãi Dâu], một ngôi đền thờ Đức Mẹ nằm trên đồi cao, nơi bạn có thể tìm hiểu về tôn giáo và thưởng ngoạn cảnh quan xung quanh.\n- Trưa: Ăn trưa tại [Quán Ăn Sân Vườn Bao La], nơi bạn có thể thưởng thức các món ăn địa phương trong không gian xanh mát. \n- Chiều: Tham quan [Công Viên Cột Cờ], một công viên nổi tiếng với cột cờ cao và không gian thoáng đãng.\n- Tối: Thưởng thức một bữa tối ngon tại [7 Lượm-Lẩu Cá đuối Vũng Tàu.Chuyên hải sản tươi sống bình dân], nơi bạn có thể thưởng thức các món hải sản tươi sống với giá phải chăng.\n\nNgày 5:\n- Sáng: Tham quan [Công viên Tao Phùng], một công viên yên tĩnh với không gian xanh mát và hồ nước.\n- Trưa: Ăn trưa tại [Món ngon vũng tàu], nơi bạn có thể thưởng thức các món ăn đặc sản Vũng Tàu.\n- Chiều: Tham quan [Tượng đài Chúa Kitô], một tượng đài nổi tiếng trên đỉnh núi, nơi bạn có thể tìm hiểu về tôn giáo và thưởng ngoạn cảnh quan xung quanh.\n- Tối: Thưởng thức một bữa tối ngon tại [Cơm niêu Rau Tập Tàng Vũng Tàu], nơi bạn có thể thưởng thức các món ăn đặc sản miền Nam.\n\nTrên đây là kế hoạch chi tiết cho chuyến đi của bạn đến Vũng Tàu trong 5 ngày. Bạn có thể điều chỉnh kế hoạch này để phù hợp với sở thích và ngân sách của bạn. Chúc bạn có một chuyến đi thú vị và trọn vẹn tại Vũng Tàu!'
        },
        {
          role: 'user',
          content: question
        }
      ],
      temperature: 0, // Đầu ra tập trung vào vào câu hỏi nhiều hơn
      stream: true // Nó sẽ trả dữ liệu về theo từng đọt
    }, {
      responseType: 'stream'
    })
    let messageReturn = ''
    // const isStop = false
    completion.data.on('data', (data) => {
      const lines = data
        ?.toString()
        ?.split('\n')
        .filter((line) => line.trim() !== '')
      for (const line of lines) {
        const message = line.replace(/^data: /, '')
        // if (message === '[DONE]') {
        //   return messageReturn
        // }
        if (message === '[DONE]') {
          io.to(socketIdMap[currentUserId]).emit('s_create_travel_itinerary', {
            isOver: 'DONE',
            allText: messageReturn
          })
          clearInterval(intervalId)
          break // Stream finished
        }
        try {
          const parsed = JSON.parse(message)
          if (parsed.choices[0].delta.content) {
            messageReturn += parsed.choices[0].delta.content
            // console.log(messageReturn)
            // io.to(socketIdMap[currentUserId]).emit('s_create_travel_itinerary', {
            //   messageReturn: parsed.choices[0].delta.content
            // })
          }
        } catch (error) {
          console.error('Could not JSON parse stream message', message, error)
        }
      }
    })
    const intervalId = setInterval(() => {
      console.log('🚀 ~ file: ChatGptProvider.js:65 ~ io.to ~ messageReturn:', messageReturn)
      io.to(socketIdMap[currentUserId]).emit('s_create_travel_itinerary', {
        messageReturn: messageReturn
      })
    }, 500)
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
  handleItineraryCreate
}