import { changePasswordMe, registerAuth, updateAuthMe } from '../../services/auth'
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { TChangePassword } from 'src/types/auth'

export const serviceName = "auth"

export const registerAuthAsync = createAsyncThunk(
  // dùng redux think để xử lý bất đồng bộ
  `${serviceName}/register`, //type của actions
  async (data: any) => {
    const response = await registerAuth(data)
    console.log('response: ', { response })

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

export const updateAuthMeAsync = createAsyncThunk(
  // dùng redux think để xử lý bất đồng bộ
  `${serviceName}/update-me`, //type của actions
  async (data: any) => {
    const response = await updateAuthMe(data)
    // console.log('response: ', { response })

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

export const changePasswordMeAsync = createAsyncThunk(
  // dùng redux think để xử lý bất đồng bộ
  `${serviceName}/change-password-me`, //type của actions
  async (data: TChangePassword) => {
    const response = await changePasswordMe(data)
    // console.log('responseUpdate ', { response })

    if (response?.status === 'Success') {
      return { ...response, data: 1 }
    }

    //nếu resopone ko trả về data(ko đk thành công)
    return {
      data: null,
      message: response?.response?.data?.message,
      typeError: response?.response?.data?.typeError
    }
  }
)
