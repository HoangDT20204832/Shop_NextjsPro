// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { changePasswordMeAsync, registerAuthAsync, updateAuthMeAsync } from './actions'

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
    typeError: "",
    isSuccessUpdateMe :true,
    isErrorUpdateMe : false  ,
    messageUpdateMe : "" ,
    isSuccessChangePassword :true,
    isErrorChangePassword : false  ,
    messageChangePassword : "" 
  },
  reducers: {
    resetInitialState: (state) =>{
      state.isLoading = false
      state.isSuccess = false
      state.isError = true  
      state.message = "" 
      state.typeError = ""  
      state.isSuccessUpdateMe = false
      state.isErrorUpdateMe = true  
      state.messageUpdateMe = ""
      state.isSuccessChangePassword = false
      state.isErrorChangePassword = true  
      state.messageChangePassword = ""
    }
  },

  extraReducers: builder => {

    // ** Register
    builder.addCase(registerAuthAsync.pending, (state, action) => {  //khi đang call
      state.isLoading = true

    }),
    builder.addCase(registerAuthAsync.fulfilled, (state, action) => {  //khi call thành công
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

     // ** Update-me
     builder.addCase(updateAuthMeAsync.pending, (state, action) => {  //khi đang call
      state.isLoading = true

    }),
    builder.addCase(updateAuthMeAsync.fulfilled, (state, action) => {  //khi call thành công
      state.isLoading = false
      state.isSuccessUpdateMe =  !!action.payload?.data?.email  //true khi có email
      state.isErrorUpdateMe = !action.payload?.data?.email  // true khi ko có email
      state.messageUpdateMe = action.payload?.message  
      state.typeError = action.payload?.typeError  
    }),
    builder.addCase(updateAuthMeAsync.rejected, (state, action) => {   // khi call thất bại
      state.isLoading = false
      state.isSuccessUpdateMe = false
      state.isErrorUpdateMe = true  
      state.messageUpdateMe = "" 
      state.typeError = ""  
    })

     // ** Change-password-me
     builder.addCase(changePasswordMeAsync.pending, (state, action) => {  //khi đang call
      state.isLoading = true

    }),
    builder.addCase(changePasswordMeAsync.fulfilled, (state, action) => {  //khi call thành công
      console.log("action", action)
      state.isLoading = false
      state.isSuccessChangePassword =  !!action.payload?.data //true khi có email
      state.isErrorChangePassword = !action.payload?.data  // true khi ko có email
      state.messageChangePassword = action.payload?.message  
      state.typeError = action.payload?.typeError  
    }),
    builder.addCase(changePasswordMeAsync.rejected, (state, action) => {   // khi call thất bại
      state.isLoading = false
      state.isSuccessChangePassword = false
      state.isErrorChangePassword = true  
      state.messageChangePassword = "" 
      state.typeError = ""  
    })
  }
})

export const {resetInitialState} = authSlice.actions
export default authSlice.reducer
