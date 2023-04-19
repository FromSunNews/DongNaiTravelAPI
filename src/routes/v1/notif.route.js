import express from 'express'
import { NotifController } from 'controllers/notif.controller'

const router = express.Router()

// Create notif
router.route('/create_new')
  .post(NotifController.createNewNotif)

// Get notifs
router.route('/get_notif')
  .post(NotifController.getNotifs)

// Get notifs
router.route('/update')
  .post(NotifController.updateNotif)

// Get notifs
router.route('/update_many')
  .post(NotifController.updateManyNotifs)


export const notifRoutes = router
