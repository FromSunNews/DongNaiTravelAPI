import express from 'express'
import { ContentController } from 'controllers/content.controller'
import { ContentValidation } from 'validations/content.validation'

const router = express.Router()

router.route('/create_new')
  .post(ContentController.createNew)

router.route('/text_to_speech')
  .post(ContentController.getTextToSpeech)

router.route('/suggest_title')
  .post(ContentController.suggestTitle)

router.route('/create_tts')
  .post(ContentController.createTTS)

export const contentRoutes = router
