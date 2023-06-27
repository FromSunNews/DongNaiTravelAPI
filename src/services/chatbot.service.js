// import { UserModel } from 'models/user.model'
import dialogflow from '@google-cloud/dialogflow'
import { v4 as uuidv4 } from 'uuid'
import { ChatGptProvider } from 'providers/ChatGptProvider'
import { OpenWeatherProvider } from 'providers/OpenWeatherProvider'
import { dfConfig } from 'config/dfConfig'
import { MapService } from './map.service'
import { GeocodingGoogleMapProvider } from 'providers/GeocodingGoogleMapProvider'

const getText = async (data) => {
  // data = {
  //  question: 'string',
  //  currentUserId: 'string',
  //  languageCode: 'string',
  //  coor: {"latitude": 10.456781258055845, "longitude": 106.72097991692522}
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
      let result = await ChatGptProvider.textGeneration(queryText)
      result.action = action
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
    } else if (action === 'input.location-on-map') {
      // khi vào TH location-on-map thì chúng ta goi search text place
      return {
        response: 'Sau đây là thông tin về địa điểm của bạn',
        action: action,
        data: {
          query: data.question,
          sortBy: 'DEFAULT',
          radius: '5000',
          location: data.coor
        }
      }
    } else if (action === 'input.direction-a-to-b') {
      const fields = ['admin-area', 'city', 'street-address', 'business-name', 'country', 'subadmin-area', 'island', 'zip-code', 'shortcut']

      let start_location = res[0].queryResult.parameters.fields?.start_location?.stringValue
      if (!start_location && res[0].queryResult.parameters.fields?.start_location?.structValue) {
        fields.map(field => {
          if (res[0].queryResult.parameters.fields?.start_location?.structValue.fields[field].stringValue) {
            start_location = res[0].queryResult.parameters.fields?.start_location?.structValue.fields[field].stringValue
          }
        })
      }
      console.log('🚀 ~ file: chatbot.service.js:158 ~ getText ~ start_location:', start_location)

      let end_location = res[0].queryResult.parameters.fields?.end_location?.stringValue
      if (!end_location && res[0].queryResult.parameters.fields?.end_location?.structValue) {
        fields.map(field => {
          if (res[0].queryResult.parameters.fields?.end_location?.structValue.fields[field].stringValue) {
            end_location = res[0].queryResult.parameters.fields?.end_location?.structValue.fields[field].stringValue
          }
        })
      }
      console.log('🚀 ~ file: chatbot.service.js:161 ~ getText ~ end_location:', end_location)

      const here = res[0].queryResult.parameters.fields?.here?.stringValue
      console.log('🚀 ~ file: chatbot.service.js:164 ~ getText ~ here:', here)

      // TH cơ bản có cả hai start_location và end_location
      if (start_location && end_location) {
        return {
          response: 'Sau đây là tuyến đường của bạn',
          action: action,
          data: {
            oriAddress: start_location,
            desAddress: end_location,
            oriPlaceId: null,
            desPlaceId: null,
            oriCoor: null,
            desCoor: null,
            modeORS: 'driving-car',
            modeGCP: 'DRIVE',
            typeOri: 'address',
            typeDes: 'address',
            routeModifiers: { avoidTolls: false, avoidHighways: false, avoidFerries: false },
            languageCode: 'vi'
          }
        }
      }
      // TH có here và có một trong hai thằng start_location và end_location
      else if (here && (start_location || end_location)) {
        if (start_location) {
          return {
            response: 'Sau đây là tuyến đường của bạn',
            action: action,
            data: {
              oriAddress: start_location,
              desAddress: null,
              oriPlaceId: null,
              desPlaceId: null,
              oriCoor: null,
              desCoor: data.coor,
              modeORS: 'driving-car',
              modeGCP: 'DRIVE',
              typeOri: 'address',
              typeDes: 'coordinate',
              routeModifiers: { avoidTolls: false, avoidHighways: false, avoidFerries: false },
              languageCode: 'vi'
            }
          }
        } else if (end_location) {
          return {
            response: 'Sau đây là tuyến đường của bạn',
            action: action,
            data: {
              oriAddress: null,
              desAddress: end_location,
              oriPlaceId: null,
              desPlaceId: null,
              oriCoor: data.coor,
              desCoor: null,
              modeORS: 'driving-car',
              modeGCP: 'DRIVE',
              typeOri: 'coordinate',
              typeDes: 'address',
              routeModifiers: { avoidTolls: false, avoidHighways: false, avoidFerries: false },
              languageCode: 'vi'
            }
          }
        }
      } else {
        return {
          response: responseText,
          action: 'input.unfinish'
        }
      }
    } else if (action === 'input.where-am-i') {
      // sử dụng Geocoding để lấy được địa chỉ
      console.log('data.coor', data.coor)
      const geocoding = await GeocodingGoogleMapProvider.getPlaceIdFromCoords(data.coor.latitude, data.coor.longitude)
      responseText = responseText.replace('[address]', geocoding.formatted_address)
      return {
        response: responseText,
        action: action,
        data: geocoding
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

const testChatGPT = async (data) => {
  try {
    const query = `Please create only the itinerary from the user's message: "${data.userMessgage}". You need to format your response by adding [] around locations with province separated by pipe. The default itinerary length is five days if not provided.`

    let result = await ChatGptProvider.textGenerationTest(data.userMessgage)
    return result

  } catch (error) {
    throw new Error(error)
  }
}

export const ChatBotService = {
  getText,
  testChatGPT
}
