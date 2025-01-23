import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'
import { GET_DB } from '~/config/mongodb'
import { BOARD_TYPES } from '~/utils/constants'
import { columnModel } from './columnModel'
import { cardModel } from './cardModel'

//Define Collection (Name & Schema)
const BOARD_COLLECTION_NAME= 'boards'
const BOARD_COLLECTION_SCHEMA =Joi.object({
  title : Joi.string().required().min(3).max(50).trim().strict(),
  slug : Joi.string().required().min(3).trim().strict(),
  description : Joi.string().required().min(3).max(256).trim().strict(),
  type:Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),

  columnOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  createdAt :Joi.date().timestamp('javascript').default(Date.now),
  updateAt :Joi.date().timestamp('javascript').default(null),
  _destroy : Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)

    const createdBoard = await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(validData)
    return createdBoard
    //return await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(data)
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({
      _id : new ObjectId(id)
    })
    return result
  } catch (error) { throw new Error(error) }
}

// query tổng hợp (aggregate) để lấy toàn bộ Columns và cards thuộc về Board
const getDetails = async (id) => {
  try {
    // const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({ _id : new ObjectId(id) })
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
      { $match: {
        _id :new ObjectId(id),
        _destroy :false
      } },
      { $lookup:{
        from : columnModel.COLUMN_COLLECTION_NAME,
        localField: '_id',
        foreignField: 'boardId',
        as: 'columns'
      } },
      { $lookup:{
        from : cardModel.CARD_COLLECTION_NAME,
        localField: '_id',
        foreignField: 'boardId',
        as: 'cards'
      } }
    ]).toArray()
    console.log(result)
    return result[0] || {}
  } catch (error) { throw new Error(error) }
}

export const boardModel ={
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails
}
// boardId : 6791979d46e868f6b4af88ab
// columnId : 67919e0c7814ed8113e76061