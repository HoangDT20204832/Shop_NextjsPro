import { changePasswordMe, registerAuth, updateAuthMe } from '../../services/auth'
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { createUser, deleteMultipleUser, deleteUser, getAllUsers, updateUser } from 'src/services/user'
import { TChangePassword } from 'src/types/auth'
import { TParamsCreateUser, TParamsDeleteMultipleUser, TParamsEditUser, TParamsGetUsers } from 'src/types/user'

export const serviceName = "user"
export const getAllUsersAsync = createAsyncThunk(
  `${serviceName}/get-all`, //type của actions
  async (data: { params: TParamsGetUsers }) => {
    const response = await getAllUsers(data)

    return response
  }
)

export const createUserAsync = createAsyncThunk(
  // dùng redux think để xử lý bất đồng bộ
  `${serviceName}/create`, //type của actions
  async (data: TParamsCreateUser) => {
    const response = await createUser(data)
    console.log('responseUser ', { response })

    if (response?.data) {
      return response
    }

    //nếu resopone ko trả về data(ko đk thành công)
    return {
      data: null,
      message: response?.response?.data?.message,
      typeError: response?.response?.data?.typeError
    }
  }
)

export const updateUserAsync = createAsyncThunk(
  // dùng redux think để xử lý bất đồng bộ
  `${serviceName}/update`, //type của actions
  async (data: TParamsEditUser) => {
    const response = await updateUser(data)
    console.log('responseUser', { response })

    if (response?.data) {
      return response
    }

    //nếu resopone ko trả về data(ko đk thành công)
    return {
      data: null,
      message: response?.response?.data?.message,
      typeError: response?.response?.data?.typeError
    }
  }
)

export const deleteUserAsync = createAsyncThunk(
  // dùng redux think để xử lý bất đồng bộ
  `${serviceName}/delete`, //type của actions
  async (id: string) => {
    const response = await deleteUser(id)
    console.log('responseUser ', { response })

    if (response?.data) {
      return response
    }

    //nếu resopone ko trả về data(ko đk thành công)
    return {
      data: null,
      message: response?.response?.data?.message,
      typeError: response?.response?.data?.typeError
    }
  }
)

export const deleteMultipleUserAsync = createAsyncThunk(`${serviceName}/delete-multiple`, async (data: TParamsDeleteMultipleUser) => {
  const response = await deleteMultipleUser(data)

  return response
})