import axios from 'axios'

//** Config
import { API_ENDPOINT } from 'src/configs/api'

// instanceAxios config lại axios
import instanceAxios from 'src/helpers/axios'

//** Type
import { TChangePassword, TLoginAuth, TRegisterAuth } from 'src/types/auth'
import { TParamsCreateRole, TParamsDeleteRole, TParamsEditRole, TParamsGetRoles } from 'src/types/role'

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

// Tạo role
export const createRole = async (data: TParamsCreateRole) => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.ROLE.INDEX}`, data)
    console.log('res', res)

    return res.data
  } catch (error) {
    return error
  }
}

// Update role
export const updateRole = async (data: TParamsEditRole) => {
  const { id, ...rests } = data
  try {
    const res = await instanceAxios.put(`${API_ENDPOINT.ROLE.INDEX}/${id}`, rests)
    console.log('res', res)

    return res.data
  } catch (error) {
    return error
  }
}

// dealete role
export const deleteRole = async (id: string) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.ROLE.INDEX}/${id}`)
    console.log('res', res)

    return res.data
  } catch (error) {
    return error
  }
}

//
export const getDetailsRole = async (id: string) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.ROLE.INDEX}/${id}`)
    console.log('res', res)

    return res.data
  } catch (error) {
    return error
  }
}
