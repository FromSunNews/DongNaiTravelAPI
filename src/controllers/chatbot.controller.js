import { HttpStatusCode } from 'utilities/constants'
import { ChatBotService } from 'services/chatbot.service'
import { env } from 'config/environtment'

const getText = async (req, res) => {
  try {
    const result = await ChatBotService.getText(req.body)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const testChatGPT = async (req, res) => {
  try {
    const result = await ChatBotService.testChatGPT(req.body)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

export const ChatBotController = {
  getText,
  testChatGPT
}
