import { registerAuth, updateAuthMe } from './../../../services/auth';
import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const registerAuthAsync = createAsyncThunk(   // dùng redux think để xử lý bất đồng bộ
    'auth/register',    //type của actions
    async (data: any) => {
      const response = await registerAuth(data)
      console.log("response: ",{response})

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

  export const updateAuthMeAsync = createAsyncThunk( // dùng redux think để xử lý bất đồng bộ
    'auth/update-me',    //type của actions
    async (data: any) => {
      const response = await updateAuthMe(data)
      console.log("response: ",{response})

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

  