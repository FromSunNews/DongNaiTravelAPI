import { HttpStatusCode } from 'utilities/constants'
import { NotifService } from 'services/notif.service'

const createNewNotif = async (req, res) => {
  try {
    const result = await NotifService.createNewNotif(req.body)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const getNotifs = async (req, res) => {
  try {
    const result = await NotifService.getNotifs(req.body)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const updateNotif = async (req, res) => {
  try {
    const result = await NotifService.updateNotif(req.body)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const updateManyNotifs = async (req, res) => {
  try {
    const result = await NotifService.updateManyNotifs(req.body)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

export const NotifController = {
  createNewNotif,
  getNotifs,
  updateNotif,
  updateManyNotifs
}


