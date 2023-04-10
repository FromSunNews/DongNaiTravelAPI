
import { env } from '*/config/environtment'
//Import the OpenAPI Large Language Model (you can import other models here eg. Cohere)
// import { OpenAI } from 'langchain'
// import { Configuration, OpenAIApi } from 'openai'

const getMessage = async (textInput) => {
  try {
    // //Instantiante the OpenAI model
    // //Pass the "temperature" parameter which controls the RANDOMNESS of the model's output. A lower temperature will result in more predictable output, while a higher temperature will result in more random output. The temperature parameter is set between 0 and 1, with 0 being the most predictable and 1 being the most random
    // const model = new OpenAI({ openAIApiKey: env.CHATGPT_API_KEY, temperature: 0.9 })

    // //Calls out to the model's (OpenAI's) endpoint passing the prompt. This call returns a string
    // const res = await model.call(textInput)
    // console.log('🚀 ~ file: LangChainProvider.js:14 ~ getMessage ~ res:', res)
    // return 'res'
  } catch (error) {
    throw new Error(`Error in getMessage: ${error.message}`)
  }
}

export const LangChainProvider = {
  getMessage
}
