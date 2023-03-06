// Guide:
// https://levelup.gitconnected.com/how-to-send-emails-from-node-js-with-sendinblue-c4caacb68f31

import SibApiV3Sdk from 'sib-api-v3-sdk'
import { env } from '*/config/environtment'

const defaultClient = SibApiV3Sdk.ApiClient.instance
const apiKey = defaultClient.authentications['api-key']
apiKey.apiKey = env.SENDINBLUE_API_KEY

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi()
// const adminSender = {
//  email: 'ptu2747@gmail.com',
//  name: 'FromSunNews'
// }

const adminSender = {
  email: 'dongnaitravelapp@gmail.com', // Email tai khoan tao tren sendinblue
  name: 'DongNaiTravelApp'
}

const sendEmail = async (toEmail, subject, htmlContent) => {
  try {
    const receivers = [
      { email: toEmail }
    ]
    const mailOptions = {
      sender: adminSender,
      to: receivers,
      subject: subject,
      htmlContent: htmlContent
    }

    return tranEmailApi.sendTransacEmail(mailOptions)

  } catch (error) {
    throw new Error(error)
  }
}

export const SendInBlueProvider = {
  sendEmail
}
