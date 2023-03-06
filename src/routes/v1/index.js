import express from 'express'
import { HttpStatusCode } from '*/utilities/constants'

import { userRoutes } from './user.route'
import { mapRoutes } from './map.route'

const router = express.Router()

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.status(HttpStatusCode.OK).json({ status: 'OK!' }))

/** USer APIs */
router.use('/users', userRoutes)

/** USer APIs */
router.use('/map', mapRoutes)

export const apiV1 = router
