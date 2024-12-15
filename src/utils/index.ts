// ** Types
import { TItemOrderProduct } from 'src/types/order-product'

import { ContentState, EditorState } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'

export const toFullName = (lastName: string, middleName: string, firstName: string, language: string) => {
  if ((language === 'vi')) {
    return `${lastName ? lastName : ''} ${middleName ? middleName : ''} ${firstName ? firstName : ''}`.trim()
  } else if ((language === 'en')) {
    return `${firstName ? firstName : ''} ${middleName ? middleName : ''} ${lastName ? lastName : ''}`.trim()
  }
}

export const convertBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
  })

  //tách chuỗi fullName thành 3 thành phần fissName, middlName, lastName
export const separationFullName = (fullName: string, language: string) => {
  const result = {
    firstName: '',
    middleName: '',
    lastName: ''
  }
  const arrFullName = fullName.trim().split(' ')?.filter(Boolean) //tách các tên trong chuỗi fullName  thành một mảng các chuỗi không rỗng 
  if (arrFullName?.length === 1) {
    if (language === 'vi') {
      result.firstName = arrFullName.join()
    } else if (language === 'en') {
      result.lastName = arrFullName.join()
    }
  } else if (arrFullName.length === 2) {
    if (language === 'vi') {
      result.lastName = arrFullName[0]
      result.firstName = arrFullName[1]
    } else if (language === 'en') {
      result.lastName = arrFullName[1]
      result.firstName = arrFullName[0]
    }
  } else if (arrFullName.length >= 3) {
    if (language === 'vi') {
      result.lastName = arrFullName[0]
      result.middleName = arrFullName.slice(1, arrFullName.length - 1).join(' ')
      result.firstName = arrFullName[arrFullName.length - 1]
    } else if (language === 'en') {
      result.lastName = arrFullName[arrFullName.length - 1]
      result.middleName = arrFullName.slice(1, arrFullName.length - 1).join(' ')
      result.firstName = arrFullName[0]
    }
  }

  return result
}

export const getAllValueOfObject = (obj:any, exclude?:string[]) =>{  // lấy tất cả giá trị trong object trừ những key có trong mảng exclude
    try {
      const values : string[] = [];
      for(const key in obj){
        if(typeof obj[key] === 'object'){
            values.push(...getAllValueOfObject(obj[key], exclude))
        }else{
          if(!exclude?.includes(obj[key])){
            values.push(obj[key])
          }
        }
      }

      return values
    } catch (error) {
      return []
    }
}

export const formatDate = (        //chuyển đổi thành giá trị thời gian theo khu vực ta chọn (vi-VN)
  value: Date | string,
  formatting: Intl.DateTimeFormatOptions = { month: 'numeric', day: 'numeric', year: 'numeric' }
) => {
  if (!value) return value

  return Intl.DateTimeFormat('vi-VN', formatting).format(new Date(value))
}
export const formatFilter = (filter: any) => { // chuyển đổi giá trị filter từ mảng [a,b,c] thành string "a|b|c" để filter nhiều 
  const result: Record<string, string> = {}
  Object.keys(filter)?.forEach((key: string) => {
    if (Array.isArray(filter[key]) && filter[key]?.length > 0) {
      result[key] = filter[key].join('|')
    } else if (filter[key]) {
      result[key] = filter[key]
    }
  })

  return result
}
//Hàm này có tác dụng chuyển đổi từ có ký tự dấu tiếng việt thành tiếng anh, thay đổi khoảng trắng bằng dấu "-"
//=> để tối ưu hoá fillter (slug)
export const stringToSlug = (str: string) => {
  // remove accents
  const from = 'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ',
    to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy'
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(RegExp(from[i], 'gi'), to[i])
  }
  str = str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-]/g, '-')
    .replace(/-+/g, '-')
  
    return str
}
// Hàm chuyển đổi kiểm HTML(lưu ở database) sang kiểu Draft(dùng trong hàm miêu ta chi tiết thông tin sp)
export const convertHTMLToDraft = (html: string) => {
  const blocksFromHtml = htmlToDraft(html)
  const { contentBlocks, entityMap } = blocksFromHtml
  const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap)
  const editorState = EditorState.createWithContent(contentState)

  return editorState
}
// Hàm chuyênmmr đổi hiển thị phân tách fiuawx giá tiền : vd 5000000 =>5.000.000
export const formatNumberToLocal = (value: string | number) => {
  try {
    return Number(value).toLocaleString("vi-VN", {
      minimumFractionDigits: 0,
    })
  } catch (error) {
    return value
  }
}

// Sao chép sâu (deep clone): Hàm này sao chép toàn bộ dữ liệu (bao gồm cả các object lồng nhau) từ biến gốc sang một biến mới. 
//Điều này đảm bảo rằng các thay đổi trên bản sao sẽ không ảnh hưởng đến dữ liệu gốc.
//Đảm bảo tính bất biến: Redux yêu cầu trạng thái (state) phải được thay đổi một cách bất biến, 
//tức là không được thay đổi trực tiếp giá trị của trạng thái gốc mà phải tạo ra một trạng thái mới. Hàm này hỗ trợ đảm bảo yêu cầu đó.
export const cloneDeep = (data: any) => {
  try {
    return JSON.parse(JSON.stringify(data))
  } catch (error) {
    return data
  }
}

//Quản lý giỏ hàng trong Redux: Hàm này xử lý logic cập nhật giỏ hàng (cart) khi người dùng thêm sản phẩm:
//Tìm xem sản phẩm có sẵn trong danh sách giỏ hàng (orderItems) hay không.Nếu sản phẩm đã có, tăng số lượng (amount) của sản phẩm đó.Nếu sản phẩm chưa có, thêm sản phẩm vào giỏ hàng.
//Tính bất biến: Hàm sử dụng cloneDeep để sao chép trạng thái ban đầu của orderItems. Điều này đảm bảo rằng trạng thái cũ không bị thay đổi trực tiếp, đáp ứng yêu cầu của Redux về tính bất biến.
export const convertUpdateProductToCart = (orderItems: TItemOrderProduct[], addItem: TItemOrderProduct) => {
  try {
    let result = []
    const cloneOrderItems = cloneDeep(orderItems)
    const findItems = cloneOrderItems.find((item: TItemOrderProduct) => item.product === addItem.product)
    if (findItems) {
      findItems.amount += addItem.amount
    } else {
      cloneOrderItems.push(addItem)
    }

    result = cloneOrderItems.filter((item:TItemOrderProduct ) => item.amount)

    return result
  } catch (error) {
    return orderItems
  }
}