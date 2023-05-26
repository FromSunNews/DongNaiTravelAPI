import express from 'express'
import { HttpStatusCode } from 'utilities/constants'

import { userRoutes } from './user.route'
const router = express.Router()

/**
 * GET v2/status
 */
router.get('/status', (req, res) => res.status(HttpStatusCode.OK).json({ status: 'OK!' }))

/** User APIs */
router.use('/users', userRoutes)

export const apiV2 = router
