import { WHITELIST_DOMAINS } from '*/utilities/constants'
import { env } from '*/config/environtment'

export const corsOptions = {
  origin: function (origin, callback) {
    // Surport call API by software Postman on dev environtment
    // When using postman the origin return undefined value

    if (!origin && env.BUILD_MODE === 'dev') {
      return callback(null, true)
    }

    if (WHITELIST_DOMAINS.indexOf(origin) !== -1) {
      return callback(null, true)
    }

    return callback(new Error(`${origin} not allowed by CORS.`))

  },
  optionsSuccessStatus: 200,
  credentials: true // CORS sẽ cho phép nhận cookies
}
