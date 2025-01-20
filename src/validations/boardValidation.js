import joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

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

    // set abortEarly : false để trường hợp có nhiều lỗi validation thì trả về tất cả lỗ<i></i>
    await correctCondition.validateAsync(req.body, { abortEarly: false})
    // Validate dữ liệu xong thì cho request đi tiếp sang Controller
    next()


  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
 
}

export const boardValidation ={
  createNew
}