import axios from 'axios'

//** Config
import { API_ENDPOINT } from 'src/configs/api'

// instanceAxios config lại axios
import instanceAxios from 'src/helpers/axios'

//** Type
import { TChangePassword, TLoginAuth, TRegisterAuth } from 'src/types/auth'
import { TParamsGetRoles } from 'src/types/role'

//giống vs cách dưới nhưng sẽ gọn hơn,có tính mở rộng hơn, chỉ cần khai báo limit, page,... ở trong params
export const getAllRoles = async (data: { params: TParamsGetRoles }) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.ROLE.INDEX}`, data)
    console.log('res', res)

    return res.data
  } catch (error) {
    return error
  }
}

// tương tự vs cách trên nhưng sẽ phải khai báo và mửo dài hơn nếu có nhiêud tham số params hơn
// export const getAllRoles = async ({ params: TParamsGetRoles }) => {
//     try {
//       const res = await instanceAxios.get(`${API_ENDPOINT.ROLE.INDEX}?limit=${params.limit}&page=${params.page}`)
//       console.log('res', res)

//       return res.data
//     } catch (error) {
//       return error
//     }
//   }
