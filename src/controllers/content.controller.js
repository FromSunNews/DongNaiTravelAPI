import { HttpStatusCode } from '*/utilities/constants'
import { ContentService } from '*/services/content.service'

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
    const result = await ContentService.getTextToSpeech(req.body)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

export const ContentController = {
  createNew,
  getTextToSpeech
}
