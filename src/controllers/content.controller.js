import { HttpStatusCode } from 'utilities/constants'
import { ContentService } from 'services/content.service'

const createNew = async (req, res) => {
  try {
    const result = await ContentService.createNew(req.body)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const getTextToSpeech = async (req, res) => {
  try {
    const result = await ContentService.getTextToSpeechTesting(req.body)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const createTTS = async (req, res) => {
  try {
    const result = await ContentService.createTTS(req. body)
    return res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const suggestTitle = async (req, res) => {
  try {
    const result = await ContentService.suggestTitle(req.body)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

export const ContentController = {
  createNew,
  getTextToSpeech,
  suggestTitle,
  createTTS
}
