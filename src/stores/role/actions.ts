import { changePasswordMe, registerAuth, updateAuthMe } from '../../services/auth'
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { getAllRoles } from 'src/services/role'
import { TChangePassword } from 'src/types/auth'
import { TParamsGetRoles } from 'src/types/role'

export const getAllRolesAsync = createAsyncThunk(
  'role/get-all', //type của actions
  async (data: { params: TParamsGetRoles }) => {
    const response = await getAllRoles(data)

    return response
  }
)
