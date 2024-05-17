// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** Action
import { createUserAsync, deleteMultipleUserAsync, deleteUserAsync, getAllUsersAsync, serviceName, updateUserAsync } from './actions'


export const userSlice = createSlice({
  name: serviceName,
  initialState: {
    isLoading: false,
    isSuccess: true,
    isError: false,
    message: '',
    typeError: '',
    isSuccessCreateEdit: false,
    isErrorCreateEdit: false,
    messageCreateEdit: '',
    isSuccessDelete: false,
    isErrorDelete: false,
    messagErrorDelete: '',
    messageErrorDelete: '',
    isSuccessMultipleDelete: false,
    isErrorMultipleDelete: false,
    messageErrorMultipleDelete: '',
    users: {
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
      state.isSuccessCreateEdit = false
      state.isErrorCreateEdit = true
      state.messageCreateEdit = ''
      state.isSuccessDelete = false
      state.isErrorDelete = false
      state.messagErrorDelete = ''
      state.isSuccessMultipleDelete = false
      state.isErrorMultipleDelete = false
      state.messageErrorMultipleDelete = ''
    }
  },

  extraReducers: builder => {
    // ** Get all Users
    builder.addCase(getAllUsersAsync.pending, (state, action) => {
      //khi đang call
      state.isLoading = true
    }),
      builder.addCase(getAllUsersAsync.fulfilled, (state, action) => {
        //khi call thành công
        state.isLoading = false
        console.log('actionnUser', action)
        state.users.data = action.payload?.data?.users || []
        state.users.total = action.payload?.data?.totalCount
      }),
      builder.addCase(getAllUsersAsync.rejected, (state, action) => {
        // khi call thất bại
        state.isLoading = false
        state.users.data = []
        state.users.total = 0
      })

    // ** Create User
    builder.addCase(createUserAsync.pending, (state, action) => {
      //khi đang call
      state.isLoading = true
    }),
      builder.addCase(createUserAsync.fulfilled, (state, action) => {
        //khi call thành công
        state.isLoading = false
        console.log('actionRole', action)
        state.isSuccessCreateEdit = !!action.payload?.data?._id // nêu có dât.id thì sẽ thành công
        state.isErrorCreateEdit = !action.payload?.data?._id
        state.messageCreateEdit = action.payload.message
        state.typeError = action.payload.typeError
      })
    // ,
    // builder.addCase(createUserAsync.rejected, (state, action) => {
    //   // khi call thất bại
    //   state.isLoading = false
    //   state.users.data = []
    //   state.users.total = 0
    // })

    // ** Update User
    builder.addCase(updateUserAsync.pending, (state, action) => {
      //khi đang call
      state.isLoading = true
    }),
      builder.addCase(updateUserAsync.fulfilled, (state, action) => {
        //khi call thành công
        state.isLoading = false
        console.log('actionRole', action)
        state.isSuccessCreateEdit = !!action.payload?.data?._id // nêu có dât.id thì sẽ thành công
        state.isErrorCreateEdit = !action.payload?.data?._id
        state.messageCreateEdit = action.payload.message
        state.typeError = action.payload.typeError
      })

    // ** Delete Role
    builder.addCase(deleteUserAsync.pending, (state, action) => {
      //khi đang call
      state.isLoading = true
    }),
      builder.addCase(deleteUserAsync.fulfilled, (state, action) => {
        //khi call thành công
        state.isLoading = false
        console.log('actionRole', action)
        state.isSuccessDelete = !!action.payload?.data?._id // nêu có dât.id thì sẽ thành công
        state.isErrorDelete = !action.payload?.data?._id
        state.messagErrorDelete = action.payload.message
        state.typeError = action.payload.typeError
      })

       // ** delete multiple user
    builder.addCase(deleteMultipleUserAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(deleteMultipleUserAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessMultipleDelete = !!action.payload?.data
      state.isErrorMultipleDelete = !action.payload?.data
      state.messageErrorMultipleDelete = action.payload?.message
      state.typeError = action.payload?.typeError
    })
  }
})

export const { resetInitialState } = userSlice.actions
export default userSlice.reducer
