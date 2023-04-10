import axios from 'axios'
import { env } from '*/config/environtment'

const generateSpeech = async (data) => {
  console.log('🚀 ~ file: TextToSpeechProvider.js:5 ~ generateSpeech ~ data:', data)
  // data có dạng:
  // data: {
  //   languageCode: 'en-US',
  //   name: 'en-US-Wavenet-F',
  //   text: 'van ban'
  // }
  const response = await axios.post(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${env.MAP_API_KEY}`,
    {
      input: {
        text: data.text
      },
      voice: {
        languageCode: data.languageCode,
        name: data.name
      },
      audioConfig: {
        audioEncoding: 'mp3'
      }
    }
  )
  // trả về audioContent dạng base64
  return response.data.audioContent
}


export const TextToSpeechProvider = {
  generateSpeech
}