import axios from 'axios'
import { env } from '*/config/environtment'

const sendToSlack = (text) => {
  axios.post( env.SLACK_HOST, {
    'text': text
  })
}

export const SendMessageToSlack = {
  sendToSlack
}