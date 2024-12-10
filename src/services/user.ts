
//** Config
import { API_ENDPOINT } from 'src/configs/api'

// instanceAxios config lại axios
import instanceAxios from 'src/helpers/axios'

//** Type
import { TParamsCreateUser, TParamsDeleteMultipleUser, TParamsEditUser, TParamsGetUsers } from 'src/types/user'

//giống vs cách dưới nhưng sẽ gọn hơn,có tính mở rộng hơn, chỉ cần khai báo limit, page,... ở trong params
export const getAllUsers = async (data: { params: TParamsGetUsers }) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.SYSTEM.USER.INDEX}`, data)
    console.log('res', res)

    return res.data
  } catch (error) {
    return error
  }
}

// tương tự vs cách trên nhưng sẽ phải khai báo và mửo dài hơn nếu có nhiêud tham số params hơn
// export const getAllRoles = async ({ params: TParamsGetRoles }) => {
//     try {
//       const res = await instanceAxios.get(`${API_ENDPOINT.SYSTEM.USER.INDEX}?limit=${params.limit}&page=${params.page}`)
//       console.log('res', res)

//       return res.data
//     } catch (error) {
//       return error
//     }
//   }

// Tạo role
export const createUser = async (data: TParamsCreateUser) => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.SYSTEM.USER.INDEX}`, data)
    console.log('res', res)

    return res.data
  } catch (error) {
    return error
  }
}

// Update role
export const updateUser = async (data: TParamsEditUser) => {
  const { id, ...rests } = data
  try {
    const res = await instanceAxios.put(`${API_ENDPOINT.SYSTEM.USER.INDEX}/${id}`, rests)
    console.log('res', res)

    return res.data
  } catch (error) {
    return error
  }
}

// dealete user
export const deleteUser = async (id: string) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.SYSTEM.USER.INDEX}/${id}`)
    console.log('res', res)

    return res.data
  } catch (error) {
    return error
  }
}

//delete many user
export const deleteMultipleUser = async (data: TParamsDeleteMultipleUser) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.SYSTEM.USER.INDEX}/delete-many`, { data })
    if (res?.data?.status === 'Success') {
      return {
        data: []
      }
    }

    return {
      data: null
    }
  } catch (error: any) {
    return error?.response?.data
  }
}

//
export const getDetailsUser= async (id: string) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.SYSTEM.USER.INDEX}/${id}`)
    console.log('res', res)

    return res.data
  } catch (error) {
    return error
  }
}
