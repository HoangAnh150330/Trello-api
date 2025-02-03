import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { columnModel } from '~/models/columnModel'
const createNew = async(reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    //Xử lý logic dữ liệu tùy đặc thù dự án
    const newBoard = {
      ...reqBody,
      slug : slugify(reqBody.title)
    }
    //Goị tới tầng Model để xử lý lưu bản ghi newBoard vào trong Database
    const createdBoard = await boardModel.createNew(newBoard)
    // console.log(createdBoard)

    //Lấy bản ghi board sau khi gọi (tùy mục đích dự án mà có cần bước này hay không)
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
    // console.log(getNewBoard)

    //Làm thêm xử lý logic khác với các Collection khác tùy đặc thù dự án
    //Bắn email , notification về cho admin khi cái board mới được tạo

    //trả kết quả về , trong service luôn phải có return
    return getNewBoard
  } catch (error) {
    throw error
  }
}

const getDetails = async(boardId) => {
  // eslint-disable-next-line no-useless-catch
  try {

    const board = await boardModel.getDetails(boardId)
    // console.log(board)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found !')
    }
    //B1 : Deep Clone board ra một cái mới để xử lý , không ảnh hưởng tới board ban đầu , tùy mục đích về sau mà có cần Clone deep hay không
    const resBoard = cloneDeep(board)

    //B2: đưa card về đúng column của nó
    resBoard.columns.forEach(column => {
      // Cách dùng equal này là vởi vì chúng ta hiểu ObjectId trong MongoDB có sup method equals
      column.cards =resBoard.cards.filter(card => card.columnId.equals(column._id))
      // console.log(column.cards)
      //Cách dùng khác đơn giản là convert ObjectId về string bằng hàm toString
      // column.cards =resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
    })

    //B3 : xóa card khỏi board ban đầu
    // delete resBoard.cards

    return resBoard
  } catch (error) {
    throw error
  }
}
const update = async (boardId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updateData = {
      ...reqBody,
      updatedAt :Date.now()
    }
    const updatedBoard = await boardModel.update(boardId, updateData)

    return updatedBoard
  } catch (error) {
    throw error
  }
}
const moveCardToDifferentColumn = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // B1: Cập nhật mảng cardOrderIds của Column ban đầu chứa nó (Hiểu bản chất là xóa cái _id của Card ra khỏi mảng)
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt :Date.now()
    })
    // B2: Cập nhật mảng cardOrderIds của Column tiếp theo (Hiểu bản chất là thêm _id của Card vào mảng)
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt :Date.now()
    })
    // B3: Cập nhật lại trường columnId mới của cái Card đã kéo
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId
    })

    return { updateResult : 'Successfully' }
  } catch (error) { throw error }
}
export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn
}