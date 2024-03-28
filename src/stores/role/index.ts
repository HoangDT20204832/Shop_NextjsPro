// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { getAllRolesAsync } from './actions'

interface DataParams {
  q: string
  role: string
  status: string
  currentPlan: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export const roleSlice = createSlice({
  name: 'appUsers',
  initialState: {
    isLoading: false,
    isSuccess: true,
    isError: false,
    message: '',
    typeError: '',
    isSuccessUpdateMe: true,
    isErrorUpdateMe: false,
    messageUpdateMe: '',
    isSuccessChangePassword: true,
    isErrorChangePassword: false,
    messageChangePassword: '',
    roles: {
      data: [],
      total: 0
    }
  },
  reducers: {
    resetInitialState: state => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
      state.message = ''
      state.typeError = ''
      state.isSuccessUpdateMe = false
      state.isErrorUpdateMe = true
      state.messageUpdateMe = ''
      state.isSuccessChangePassword = false
      state.isErrorChangePassword = true
      state.messageChangePassword = ''
    }
  },

  extraReducers: builder => {
    // ** Get all Roles
    builder.addCase(getAllRolesAsync.pending, (state, action) => {
      //khi đang call
      state.isLoading = true
    }),
      builder.addCase(getAllRolesAsync.fulfilled, (state, action) => {
        //khi call thành công
        state.isLoading = false
        console.log('actionn', action)
        state.roles.data = action.payload.data.roles
        state.roles.total = action.payload.data.totalCount
      }),
      builder.addCase(getAllRolesAsync.rejected, (state, action) => {
        // khi call thất bại
        state.isLoading = false
        state.roles.data = []
        state.roles.total = 0
      })
  }
})

export const { resetInitialState } = roleSlice.actions
export default roleSlice.reducer
