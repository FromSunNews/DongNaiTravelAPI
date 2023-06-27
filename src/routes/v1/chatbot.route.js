import express from 'express'
import { ChatBotController } from 'controllers/chatbot.controller'
import { ChatBotValidation } from 'validations/chatbot.validation'

const router = express.Router()

router.route('/get_text')
  .post(ChatBotValidation.getText, ChatBotController.getText)

router.route('/test_chatgpt')
  .post(ChatBotController.testChatGPT)

export const chatbotRoutes = router
