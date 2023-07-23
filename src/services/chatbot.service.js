// import { UserModel } from 'models/user.model'
import dialogflow from '@google-cloud/dialogflow'
import { v4 as uuidv4 } from 'uuid'
import { ChatGptProvider } from 'providers/ChatGptProvider'
import { OpenWeatherProvider } from 'providers/OpenWeatherProvider'
import { dfConfig } from 'config/dfConfig'
import { MapService } from './map.service'
import { GeocodingGoogleMapProvider } from 'providers/GeocodingGoogleMapProvider'
import { PlacesSearchProvider } from 'providers/PlacesSearchProvider'
import { env } from 'config/environtment'
import axios from 'axios'

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

    // return res
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
    } else if (action === 'input.travel-itinerary') {
      const fields = ['admin-area', 'city', 'street-address', 'business-name', 'country', 'subadmin-area', 'island', 'zip-code', 'shortcut']

      let placeToTravel = res[0].queryResult.parameters.fields?.location?.stringValue

      if (!placeToTravel && res[0].queryResult.parameters.fields?.location?.structValue) {
        fields.map(field => {
          if (res[0].queryResult.parameters.fields?.location?.structValue.fields[field].stringValue) {
            placeToTravel = res[0].queryResult.parameters.fields?.location?.structValue.fields[field].stringValue
          }
        })
      }

      let numberDayToTravel = res[0].queryResult.parameters.fields['number-integer'].numberValue

      if (placeToTravel) {

        // Cần phải xác định tên địa điểm để tạo lịch trình
        // Sau đó cần call api để lấy ra tên các địa điểm tham quan và nơi ăn uống
        const queryTravelPlaces = `Địa điểm du lịch nổi tiếng tại ${placeToTravel}`
        const queryFnbPlaces = `Đại điểm ăn uống nổi tiếng tại ${placeToTravel}`

        const dataTextSearch = {
          rankby: env.RANKBY_PROMINENCE,
          radius: env.RADIUS_DEFAULT,
          location: data.coor
        }

        // Lấy 2 cái url để req
        const urlTravelPlaces = PlacesSearchProvider.getPlacesTextSearchURL({ ...dataTextSearch, query: queryTravelPlaces })
        const urlFnbPlaces = PlacesSearchProvider.getPlacesTextSearchURL({ ...dataTextSearch, query: queryFnbPlaces })

        let dataTravelPlaces, dataFnbPlaces, travelPlaces = [], fnbPlaces = []

        // Gọi tiến trình song song để gảm thời gian chờ request
        await axios.all([
          axios.get(urlTravelPlaces),
          axios.get(urlFnbPlaces)
        ]).then(
          (datas) => {
            datas.map((res, index) => {
              if (index === 0) {
                dataTravelPlaces = res.data.results
                res.data.results.map(place => {
                  travelPlaces.push(place.name)
                })
              }
              else if (index === 1) {
                dataFnbPlaces = res.data.results
                res.data.results.map(place => {
                  fnbPlaces.push(place.name)
                })
              }
            })
          }
        ).catch(err => console.log('Lỗi ở gọi urlTravelPlaces và urlFnbPlaces', err))

        console.log('🚀 ~ file: chatbot.service.js:299 ~ testChatGPT ~ fnbPlaces:', fnbPlaces)
        console.log('🚀 ~ file: chatbot.service.js:299 ~ testChatGPT ~ travelPlaces:', travelPlaces)

        // Hiện tại ở đây đã có fnbPlaces và travelPlaces chúng ta sẽ biến đổi photo vè dạng base 64
        // const dataPlaces = [...(dataTravelPlaces || []), ...(dataFnbPlaces || [])]
        // let dataPlaces = [], dataTravelPlacesClone = [], dataFnbPlacesClone = [], travelPlacesClone = [], fnbPlacesClone = []
        // for (let index = 0; index < numberDayToTravel * 2; index++) {
        //   dataPlaces = [...dataPlaces, dataTravelPlaces[index], dataFnbPlaces[index]]
        //   dataTravelPlacesClone.push(dataTravelPlaces[index])
        //   dataFnbPlacesClone.push(dataFnbPlaces[index])
        //   travelPlacesClone.push(travelPlaces[index])
        //   fnbPlacesClone.push(fnbPlaces[index])
        // }
        // // lấy ra từng photo
        // const photos = dataPlaces.map(place => place.photos[0].photo_reference)
        // await axios.all(
        //   photos.map(photo => axios.get(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo}&key=${env.MAP_API_KEY}`, { responseType: 'arraybuffer' }))
        // ).then(
        //   (datas) => {
        //     let newPhotos = []
        //     datas.map(res => {
        //       const urlBase64Decode = Buffer.from(res.data, 'binary').toString('base64')
        //       newPhotos.push(urlBase64Decode)
        //     })

        //     dataPlaces.map((place) => {
        //       if (newPhotos.length === 0)
        //         return
        //       if (place.photos) {
        //         place.photos = newPhotos[0]
        //         newPhotos.shift()
        //       }
        //     })
        //   }
        // ).catch(err => console.log('Lỗi ở gọi api để là photos => base64', err))

        // let result = await ChatGptProvider.handleItineraryCreate(data.question, travelPlaces, fnbPlaces)


        return {
          response: 'Đây là thông tin của bạn',
          action: action,
          data: {
            travelPlaces,
            fnbPlaces,
            dataTravelPlaces,
            dataFnbPlaces,
            numberDayToTravel: numberDayToTravel,
            placeToTravel: placeToTravel,
            question: queryText
          }
        }

        // return {
        //   response: 'Đây là thông tin của bạn',
        //   action: action,
        //   data: {
        //     travelPlaces: travelPlacesClone,
        //     fnbPlaces: fnbPlacesClone,
        //     dataTravelPlaces: dataTravelPlacesClone,
        //     dataFnbPlaces: dataFnbPlacesClone,
        //     numberDayToTravel: numberDayToTravel,
        //     placeToTravel: placeToTravel,
        //     question: queryText,
        //     dataPlaces: dataPlaces
        //   }
        // }

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

const testChatGPT = async (data) => {
  try {
    // const query = `Please create only the itinerary from the user's message: "${data.userMessgage}". You need to format your response by adding [] around locations with province separated by pipe. The default itinerary length is five days if not provided.`
    // const query1 = `${data.userMessgage}. Bạn phải định dạng mỗi địa điểm theo dạng [place] ví dụ [Công viên Bãi Trước] và các địa điểm phải khác nhau không lặp lại. `
    // const travelPlaces = 'Khu du lịch Bửu Long, Khu du lịch sinh thái Thác Giang Điền, Văn miếu Trấn Biên, Khu Du Lịch Cao Minh, Thác Đá Hàn, Khu du lịch - đô thị Sơn Tiên, Khu Du lịch Thác Mai, Khu du lịch Sinh Thái Bò Cạp Vàng, Làng Du Lịch Sinh Thái Tre Việt, KDL Suối Mơ - Đồng Nai'
    // const fnbPlaces = 'Bò Nằm Nhúng Hố Nai, Nhà hàng nổi Làng Bè, Nhà hàng Ngọc Cảnh, Quán Ăn Anh Minh, Quán Bún Bò- Phở Bò, Nhà Hàng K\' Tân, Quán Ăn Hồng Phát, Quán ăn gia đình Phúc Lộc'
    // Cần phải xác định tên địa điểm để tạo lịch trình
    const placeToTravel = 'Đồng Nai'
    // Sau đó cần call api để lấy ra tên các địa điểm tham quan và nơi ăn uống
    const queryTravelPlaces = `Địa điểm du lịch nổi tiếng tại ${placeToTravel}`
    const queryFnbPlaces = `Đại điểm ăn uống nổi tiếng tại ${placeToTravel}`

    const dataTextSearch = {
      rankby: env.RANKBY_PROMINENCE,
      radius: env.RADIUS_DEFAULT,
      location: data.coor
    }

    // Lấy 2 cái url để req
    const urlTravelPlaces = PlacesSearchProvider.getPlacesTextSearchURL({ ...dataTextSearch, query: queryTravelPlaces })
    const urlFnbPlaces = PlacesSearchProvider.getPlacesTextSearchURL({ ...dataTextSearch, query: queryFnbPlaces })

    let dataTravelPlaces, dataFnbPlaces, travelPlaces = [], fnbPlaces = []

    // Gọi tiến trình song song để gảm thời gian chờ request
    await axios.all([
      axios.get(urlTravelPlaces),
      axios.get(urlFnbPlaces)
    ]).then(
      (datas) => {
        datas.map((res, index) => {
          if (index === 0) {
            dataTravelPlaces = res.data.results
            res.data.results.map(place => {
              travelPlaces.push(place.name)
            })
          }
          else if (index === 1) {
            dataFnbPlaces = res.data.results
            res.data.results.map(place => {
              fnbPlaces.push(place.name)
            })
          }
        })
      }
    ).catch(err => console.log('Lỗi ở gọi urlTravelPlaces và urlFnbPlaces', err))

    console.log('🚀 ~ file: chatbot.service.js:299 ~ testChatGPT ~ fnbPlaces:', fnbPlaces)
    console.log('🚀 ~ file: chatbot.service.js:299 ~ testChatGPT ~ travelPlaces:', travelPlaces)

    let result = await ChatGptProvider.handleItineraryCreate(data.question, travelPlaces, fnbPlaces)

    return {
      travelPlaces,
      fnbPlaces
    }

    // const text = 'Dưới đây là một kế hoạch chi tiết cho chuyến đi 5 ngày của bạn đến Vũng Tàu:\n\nNgày 1:\n- Sáng: Từ thành phố Hồ Chí Minh, bạn có thể di chuyển đến Vũng Tàu bằng xe buýt hoặc tàu hỏa. Đến Vũng Tàu, bạn có thể nhận phòng tại khách sạn của bạn.\n- Trưa: Thưởng thức một bữa trưa ngon tại [Nhà hàng Gành Hào 1], nơi bạn có thể thưởng thức các món hải sản tươi sống.\n- Chiều: Tham quan [Bạch Dinh (White Palace Historical Cultural Relic)], một di tích lịch sử quan trọng với kiến trúc Pháp cổ điển và tầm nhìn tuyệt đẹp ra biển.\n- Tối: Dạo chơi tại [Bãi Trước], một bãi biển nổi tiếng với cát trắng và không khí trong lành. Bạn có thể thưởng thức các món ăn vặt tại các quầy hàng ven biển.\n\nNgày 2:\n- Sáng: Tham quan [Hải Đăng Vũng Tàu], một biểu tượng nổi tiếng của thành phố. Bạn có thể leo lên đỉnh hải đăng để ngắm toàn cảnh Vũng Tàu từ trên cao.\n- Trưa: Ăn trưa tại [Nhà hàng Cây Bàng], nơi bạn có thể thưởng thức các món ăn đặc sản miền Trung.\n- Chiều: Tham quan [Đồi Con Heo], một điểm đến phổ biến với tượng đài con heo và tầm nhìn đẹp ra biển.\n- Tối: Thưởng thức một bữa tối ngon tại [Nhà hàng Ngọc Dung], nơi bạn có thể thưởng thức các món hải sản tươi sống.\n\nNgày 3:\n- Sáng: Tham quan [Linh Sơn Cổ Tự], một ngôi chùa cổ nằm trên đỉnh núi, nơi bạn có thể tìm hiểu về đạo Phật và thưởng ngoạn cảnh quan xung quanh.\n- Trưa: Ăn trưa tại [Nhà hàng hải sản Lâm Đường - Vũng Tàu], nơi bạn có thể thưởng thức các món hải sản tươi sống với giá phải chăng.\n- Chiều: Tham quan [Tượng Đài Liệt Sỹ], một tượng đài tưởng nhớ các liệt sỹ đã hy sinh trong cuộc chiến tranh.\n- Tối: Dạo chơi tại [Bãi Sau], một bãi biển yên tĩnh và không quá đông đúc. Bạn có thể thưởng thức các món ăn vặt tại các quầy hàng ven biển.\n\nNgày 4:\n- Sáng: Tham quan [Đền Thánh Đức Mẹ Bãi Dâu], một ngôi đền thờ Đức Mẹ nằm trên đồi cao, nơi bạn có thể tìm hiểu về tôn giáo và thưởng ngoạn cảnh quan xung quanh.\n- Trưa: Ăn trưa tại [Quán Ăn Sân Vườn Bao La], nơi bạn có thể thưởng thức các món ăn địa phương trong không gian xanh mát. \n- Chiều: Tham quan [Công Viên Cột Cờ], một công viên nổi tiếng với cột cờ cao và không gian thoáng đãng.\n- Tối: Thưởng thức một bữa tối ngon tại [7 Lượm-Lẩu Cá đuối Vũng Tàu.Chuyên hải sản tươi sống bình dân], nơi bạn có thể thưởng thức các món hải sản tươi sống với giá phải chăng.\n\nNgày 5:\n- Sáng: Tham quan [Công viên Tao Phùng], một công viên yên tĩnh với không gian xanh mát và hồ nước.\n- Trưa: Ăn trưa tại [Món ngon vũng tàu], nơi bạn có thể thưởng thức các món ăn đặc sản Vũng Tàu.\n- Chiều: Tham quan [Tượng đài Chúa Kitô], một tượng đài nổi tiếng trên đỉnh núi, nơi bạn có thể tìm hiểu về tôn giáo và thưởng ngoạn cảnh quan xung quanh.\n- Tối: Thưởng thức một bữa tối ngon tại [Cơm niêu Rau Tập Tàng Vũng Tàu], nơi bạn có thể thưởng thức các món ăn đặc sản miền Nam.\n\nTrên đây là kế hoạch chi tiết cho chuyến đi của bạn đến Vũng Tàu trong 5 ngày. Bạn có thể điều chỉnh kế hoạch này để phù hợp với sở thích và ngân sách của bạn. Chúc bạn có một chuyến đi thú vị và trọn vẹn tại Vũng Tàu!'

    // const result = []
    // let textEnding = 'UNDONE', textIntroduce = 'UNDONE'

    // // phân tách từng đoạn một ra
    // const paragraphArray = text.split('\n\n')

    // if (paragraphArray.length > 0) {

    //   console.log('🚀 ~ file: chatbot.service.js:336 ~ testChatGPT ~ paragraphArray:', paragraphArray)
    //   // lấy ra được đoaạn đầu và đoạn cuối (Mở đầu và kết thúc)
    //   textIntroduce = paragraphArray[0].trim()
    //   // Xóa phần tử đàu của mảng
    //   paragraphArray.shift()

    //   const isDoneTreaming = false
    //   // có một lưu ý nhỏ, khi streaming chắc chắn sẽ chưa có đoạn cuối ngay được nên phải check với isDoneTreaming
    //   if (isDoneTreaming) {
    //     textEnding = paragraphArray[paragraphArray.length - 1].trim()
    //   }

    //   // xóa phần tử cuối của mảng
    //   paragraphArray.pop()

    //   if (paragraphArray.length > 0) {
    //     paragraphArray.map((paragraph, index) => {
    //       // phân ra từ "\n" và xóa thằng đàu tiền của mảng
    //       const originalDay = paragraph.split('\n')
    //       originalDay.shift()
    //       // console.log('🚀 ~ file: chatbot.service.js:347 ~ paragraphArray.map ~ originalDay:', originalDay)
    //       const dataDay = {
    //         numberOfDay: index + 1,
    //         morning: originalDay[0].replace('- Sáng:', '').trim(),
    //         noon: originalDay[1].replace('- Trưa:', '').trim(),
    //         afternoon: originalDay[2].replace('- Chiều:', '').trim(),
    //         evening: originalDay[3].replace('- Tối:', '').trim()
    //       }
    //       result.push(dataDay)
    //     })
    //   }
    // }
    // // console.log('🚀 ~ file: chatbot.service.js:344 ~ testChatGPT ~ paragraphArray:', paragraphArray)
    // return {
    //   textIntroduce,
    //   dataDay: result,
    //   textEnding
    // }
  } catch (error) {
    throw new Error(error)
  }
}

export const ChatBotService = {
  getText,
  testChatGPT
}
