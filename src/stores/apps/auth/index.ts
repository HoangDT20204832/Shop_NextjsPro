// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { registerAuthAsync } from './actions'

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

export const authSlice = createSlice({
  name: 'appUsers',
  initialState: {
    isLoading: false,
    isSuccess: true,
    isError: false,
    message: "",
    typeError: ""
  },
  reducers: {
    resetInitialState: (state) =>{
      state.isLoading = false
      state.isSuccess = false
      state.isError = true  
      state.message = "" 
      state.typeError = ""  
    }
  },
  extraReducers: builder => {
    builder.addCase(registerAuthAsync.pending, (state, action) => {  //khi đang call
      state.isLoading = true

    }),
    builder.addCase(registerAuthAsync.fulfilled, (state, action) => {  //khi call thành công
      console.log("action", action)
      state.isLoading = false
      state.isSuccess =  !!action.payload?.data?.email  //true khi có email
      state.isError = !action.payload?.data?.email  // true khi ko có email
      state.message = action.payload?.message  
      state.typeError = action.payload?.typeError  
    }),
    builder.addCase(registerAuthAsync.rejected, (state, action) => {   // khi call thất bại
      state.isLoading = false
      state.isSuccess = false
      state.isError = true  
      state.message = "" 
      state.typeError = ""  
    })
  }
})

export const {resetInitialState} = authSlice.actions
export default authSlice.reducer
