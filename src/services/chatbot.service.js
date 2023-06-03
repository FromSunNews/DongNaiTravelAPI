// import { UserModel } from 'models/user.model'
import dialogflow from '@google-cloud/dialogflow'
import { v4 as uuidv4 } from 'uuid'
import { ChatGptProvider } from 'providers/ChatGptProvider'
import { OpenWeatherProvider } from 'providers/OpenWeatherProvider'
import { dfConfig } from 'config/dfConfig'
import { MapService } from './map.service'

const getText = async (data) => {
  // data = {
  //  question: 'string',
  //  currentUserId: 'string',
  //  languageCode: 'string',
  // }
  try {
    console.log('🚀 ~ file: chatbot.service.js:17 ~ getText ~ data:', data)
    // connect to dialogflow api
    const projectId = dfConfig.project_id
    const sessionId = data.currentUserId

    const credentials = {
      client_email: dfConfig.client_email,
      private_key: dfConfig.private_key
    }

    // Create a new session
    const sessionClient = new dialogflow.SessionsClient({ credentials })
    const sessionPath = sessionClient.projectAgentSessionPath(
      projectId,
      sessionId
    )

    const req = {
      session: sessionPath,
      queryInput: {
        text: {
          text: data.question,
          languageCode: data.languageCode
        }
      }
    }

    const res = await sessionClient.detectIntent(req)

    let action = res[0].queryResult.action
    console.log('🚀 ~ file: chatbot.service.js:39 ~ getText ~ action:', action)

    let queryText = res[0].queryResult.queryText

    let responseText = res[0].queryResult.fulfillmentMessages[0].text.text[0]
    console.log('🚀 ~ file: chatbot.service.js:46 ~ getText ~ responseText:', responseText)

    if (action === 'input.unknown') {
      // Nếu hành động không được xác định thì chuyển qua hỏi con chatGPT
      let result = await ChatGptProvider.textGeneration(queryText, action)
      return result
    } else if (action === 'input.suggest-place') {
      // Tổng họp place

      // Trả dữ liêu về
      return {
        response: responseText,
        action: action
      }
    } else if (action === 'input.get-weather') {
      // Xử lý để trả dữ liệu về
      const address = res[0].queryResult.parameters.fields?.address?.stringValue
      console.log('🚀 ~ file: chatbot.service.js:61 ~ getText ~ address:', address)

      const dateString = res[0].queryResult.parameters.fields?.date?.stringValue
      console.log('🚀 ~ file: chatbot.service.js:70 ~ getText ~ dateString:', dateString)

      const here = res[0].queryResult.parameters.fields?.here?.stringValue // HERE
      console.log('🚀 ~ file: chatbot.service.js:73 ~ getText ~ here:', here)
      const current_time = res[0].queryResult.parameters.fields?.current_time?.stringValue //CURRENT_TIME
      console.log('🚀 ~ file: chatbot.service.js:75 ~ getText ~ current_time:', current_time)

      // phải có 1 trong hai cặp như này
      if ((current_time || dateString) && (here || address)) {

        let weatherData
        // nếu TH có cả address với here thì cẩn thận
        // nếu call city không được r chuyển qua coor (ưu tiên sau)
        // if (here === 'HERE' && address !== '') {
        // Nếu không có address
        if (!address) {
          console.log('Không có address')
          // TH address bằng null thì hãy lấy tọa độ hiện tại để call api weather
          if (!data.coor) {
            console.log('không có coor')
            return {
              response: responseText,
              action: action
            }
          } else {
            console.log('có coor')
            weatherData = await MapService.getWeatherForecast(data.coor)
          }
        } else {
          console.log('Có address')
          // Call weather api bth
          // weatherData = await OpenWeatherProvider.getWeatherForecastByCity(address)
          // if (!weatherData) {
          const geocodingDirect = await OpenWeatherProvider.getGeocodingDirect(address)
          console.log('coor lấy từ geocodingDirect')
          weatherData = await MapService.getWeatherForecast(geocodingDirect.coor)
          // }
        }

        // Trả dữ liêu về
        let textToResponse
        if ((current_time && here) || (current_time && address) || (dateString && here) || (dateString && address))
          textToResponse = 'Đây là thông tin về thời tiết tại nơi bạn cần được cập nhật mỗi 3 giờ trong 5 ngày tới do đó các yêu cầu của bạn trong quá khứ hoặc quá 5 ngày tiếp theo sẽ không có hiệu lực. Mong bạn thông cảm về sự bất tiện này!'
        else
          textToResponse = responseText
        return {
          response: textToResponse,
          action: action,
          data: weatherData
        }
        // }
        // const date = new Date(dateString)
        // console.log('🚀 ~ file: chatbot.service.js:66 ~ getText ~ date:', date)

        // const month = date.getMonth()
        // console.log('🚀 ~ file: chatbot.service.js:69 ~ getText ~ month:', month)

        // const day = date.getDate()
        // console.log('🚀 ~ file: chatbot.service.js:72 ~ getText ~ day:', day)


      } else if (here === 'HERE') {
        return {
          response: 'Bạn muốn biết thời tiết vào lúc nào?',
          action: 'input.unfinish'
        }
      } else {
        return {
          response: responseText,
          action: 'input.unfinish'
        }
      }
    } else {
      return {
        response: responseText,
        action: action
      }
    }
  } catch (error) {
    throw new Error(error)
  }
}

export const ChatBotService = {
  getText
}
