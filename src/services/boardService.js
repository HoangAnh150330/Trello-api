import { slugify } from '~/utils/formatters'

const createNew = async(reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    //Xử lý logic dữ liệu tùy đặc thù dự án 
    const newBoard = {
      ...reqBody,
      slug : slugify(reqBody.title)
    }
    //Goị tới tầng Model để xử lý lưu bản ghi newBoard vào trong Database

    //Làm thêm xử lý logic khác với các Collection khác tùy đặc thù dự án
    //Bắn email , notification về cho admin khi cái board mới được tạo

    //trả kết quả về , trong service luôn phải có return
    return newBoard
  } catch (error) {
    throw error
  }
}
export const boardService = {
  createNew
}