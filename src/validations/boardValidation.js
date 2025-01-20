import joi from 'joi'
import { StatusCodes } from 'http-status-codes'


const createNew = async(req, res, next ) => {
  const correctCondition = joi.object({
    title : joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required': 'Title is required ',
      'string.empty': 'Title is not allowed to be empty',
      'string.min': 'Title min 3 chars ',
      'string.max': 'Title max 50 chars ',
      'string.trim': 'Title must not have leading or trailing whitespace'
    }),
    description : joi.string().required().min(3).max(256).trim().strict()
  })

  try {
    // console.log('req.body:', req.body)
    // set abortEarly : false để trường hợp có nhiều lỗi validation thì trả về tất cả lỗ<i></i>
    await correctCondition.validateAsync(req.body, { abortEarly: false})

    // next()

    res.status(StatusCodes.CREATED).json({ message: 'POST from Validation : API create use board' })
  } catch (error) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors : new Error(error).message
    })
  }
 
}

export const boardValidation ={
  createNew
}