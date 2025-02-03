import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPES } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'
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
const update = async(req, res, next ) => {
  //Lưu ý không required trong trường hợp Update
  const correctCondition = Joi.object({
    title : Joi.string().min(3).max(50).trim().strict(),
    description : Joi.string().min(3).max(256).trim().strict(),
    type:Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE),
    columnOrderIds : Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    )
  })

  try {

    // set abortEarly : false để trường hợp có nhiều lỗi validation thì trả về tất cả lỗi
    //Đối với trường hợp Update , cho phép Unknown để không cần đẩy một số field lên
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true
    })
    next()


  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const moveCardToDifferentColumn = async(req, res, next ) => {
  const correctCondition = Joi.object({
    currentCardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

    prevColumnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    prevCardOrderIds : Joi.array().required().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    ),
    nextColumnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    nextCardOrderIds : Joi.array().required().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    )
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const boardValidation ={
  createNew,
  update,
  moveCardToDifferentColumn
}