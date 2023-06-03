import express from 'express'
import { HttpStatusCode } from 'utilities/constants'

import { userRoutes } from './user.route'
import { mapRoutes } from './map.route'
import { directionRoutes } from './direction.route'
import { contentRoutes } from './content.route'
import { notifRoutes } from './notif.route'
import { chatbotRoutes } from './chatbot.route'

const router = express.Router()

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.status(HttpStatusCode.OK).json({ status: 'OK!' }))

/** User APIs */
router.use('/users', userRoutes)

/** Map APIs */
router.use('/map', mapRoutes)

/** Direction APIs */
router.use('/direction', directionRoutes)

/** content APIs */
router.use('/content', contentRoutes)

/** notif APIs */
router.use('/notif', notifRoutes)

/** notif APIs */
router.use('/chatbot', chatbotRoutes)

export const apiV1 = router
