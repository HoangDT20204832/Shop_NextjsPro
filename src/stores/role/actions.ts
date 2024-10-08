import { changePasswordMe, registerAuth, updateAuthMe } from '../../services/auth'
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { createRole, deleteRole, getAllRoles, updateRole } from 'src/services/role'
import { TChangePassword } from 'src/types/auth'
import { TParamsCreateRole, TParamsDeleteRole, TParamsEditRole, TParamsGetRoles } from 'src/types/role'

export const serviceName = "role"

export const getAllRolesAsync = createAsyncThunk(
  `${serviceName}/get-all`, //type của actions
  async (data: { params: TParamsGetRoles }) => {
    const response = await getAllRoles(data)

    return response
  }
)

export const createRoleAsync = createAsyncThunk(
  // dùng redux think để xử lý bất đồng bộ
  `${serviceName}/create`, //type của actions
  async (data: TParamsCreateRole) => {
    const response = await createRole(data)
    console.log('responseRole ', { response })

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

export const updateRoleAsync = createAsyncThunk(
  // dùng redux think để xử lý bất đồng bộ
  `${serviceName}/update`, //type của actions
  async (data: TParamsEditRole) => {
    const response = await updateRole(data)
    console.log('responseRole ', { response })

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

export const deleteRoleAsync = createAsyncThunk(
  // dùng redux think để xử lý bất đồng bộ
  `${serviceName}/delete`, //type của actions
  async (id: string) => {
    const response = await deleteRole(id)
    console.log('responseRole ', { response })

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
