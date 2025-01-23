import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPES } from '~/utils/constants'
const createNew = async(req, res, next ) => {
  const correctCondition = Joi.object({
    title : Joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required': 'Title is required ',
      'string.empty': 'Title is not allowed to be empty',
      'string.min': 'Title min 3 chars ',
      'string.max': 'Title max 50 chars ',
      'string.trim': 'Title must not have leading or trailing whitespace'
    }),
    description : Joi.string().required().min(3).max(256).trim().strict(),
    type:Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required()
  })

  try {

    // set abortEarly : false để trường hợp có nhiều lỗi validation thì trả về tất cả lỗ<i></i>
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // Validate dữ liệu xong thì cho request đi tiếp sang Controller
    next()


  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
 
}

export const boardValidation ={
  createNew
}