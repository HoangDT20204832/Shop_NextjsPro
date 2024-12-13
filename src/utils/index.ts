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