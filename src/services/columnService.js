import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
const createNew = async(reqBody) => {
  try {
    const newColumn = {
      ...reqBody
    }
    const createdColumn = await columnModel.createNew(newColumn)
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)
    //...
    if (getNewColumn) {
      //Xử lý cấu trúc data ở đây trước khi trả dữ liệu về
      getNewColumn.cards =[]

      //Cập nhật lại mảng columnOrderIds trong collection boards
      await boardModel.pushColumnOrderIds(getNewColumn)
    }
    return getNewColumn
  } catch (error) { throw error }
}
const update = async (columnId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updateData = {
      ...reqBody,
      updatedAt :Date.now()
    }
    const updatedColumn = await columnModel.update(columnId, updateData)

    return updatedColumn
  } catch (error) {
    throw error
  }
}

const deleteItem = async (columnId) => {
  try {
    //Xóa Column
    await columnModel.deleteOneById(columnId)
    //Xóa toàn bộ Card thuộc Column trên
    await cardModel.deleteManyByColumnId(columnId)
    return { deleteResult: 'Column and its Cards deleted successfully!' }
  } catch (error) {
    throw error
  }
}
export const columnService = {
  createNew,
  update,
  deleteItem
}