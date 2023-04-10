import { env } from 'config/environtment'
import { JwtProvider } from 'providers/JwtProvider'
import { HttpStatusCode } from 'utilities/constants'

const isAuthorized = async (req, res, next) => {
  const clientAccessToken = req.body?.accessToken
  if (!clientAccessToken) {
    return res.status(HttpStatusCode.UNAUTHORIZED).json({
      errors: 'Unauthorized'
    })
  }

  try {
    // Phuong: Thực hiện giải mã token xem nó có đúng không
    const decoded = await JwtProvider.verifyToken(env.ACCESS_TOKEN_SECRET_SIGNATURE, clientAccessToken)

    //Quan trọng: nếu như cái token hợp lệ, thì sẽ cần hpải lưu thông tin giải mã được vào req, để sử dụng cho các phần xử lý phía sau
    req.jwtDecoded = decoded

    //Cho phép request đi tiếp
    next()

  } catch (error) {
    if (error?.message?.includes('jwt expired')) {
      // cais accessToken nó bị hết hạn thì mình trả về cho FE
      return res.status(HttpStatusCode.EXPIRED).json({
        errors: 'Need to refresh token'
      })
    }
    //Nếu như cái accessToken nó không hợp lệ do bất kì điều gì thì chúng ta sẽ trả về mã lỗi 410
    return res.status(HttpStatusCode.UNAUTHORIZED).json({
      errors: 'Unauthorized'
    })
  }
}

export const AuthMiddleware = {
  isAuthorized
}