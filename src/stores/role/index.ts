// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** Axios Imports
import { createRoleAsync, deleteRoleAsync, getAllRolesAsync, serviceName, updateRoleAsync } from './actions'


export const roleSlice = createSlice({
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
      state.isSuccessCreateEdit = false
      state.isErrorCreateEdit = false
      state.messageCreateEdit = ''
      state.isSuccessDelete = false
      state.isErrorDelete = false
      state.messagErrorDelete = ''
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
        state.roles.data = action.payload?.data?.roles
        state.roles.total = action.payload?.data?.totalCount
      }),
      builder.addCase(getAllRolesAsync.rejected, (state, action) => {
        // khi call thất bại
        state.isLoading = false
        state.roles.data = []
        state.roles.total = 0
      })

    // ** Create Role
    builder.addCase(createRoleAsync.pending, (state, action) => {
      //khi đang call
      state.isLoading = true
    }),
      builder.addCase(createRoleAsync.fulfilled, (state, action) => {
        //khi call thành công
        state.isLoading = false
        console.log('actionRole', action)
        state.isSuccessCreateEdit = !!action.payload?.data?._id // nêu có dât.id thì sẽ thành công
        state.isErrorCreateEdit = !action.payload?.data?._id
        state.messageCreateEdit = action.payload.message
        state.typeError = action.payload.typeError
      })
    // ,
    // builder.addCase(createRoleAsync.rejected, (state, action) => {
    //   // khi call thất bại
    //   state.isLoading = false
    //   state.roles.data = []
    //   state.roles.total = 0
    // })

    // ** Update Role
    builder.addCase(updateRoleAsync.pending, (state, action) => {
      //khi đang call
      state.isLoading = true
    }),
      builder.addCase(updateRoleAsync.fulfilled, (state, action) => {
        //khi call thành công
        state.isLoading = false
        console.log('actionRole', action)
        state.isSuccessCreateEdit = !!action.payload?.data?._id // nêu có dât.id thì sẽ thành công
        state.isErrorCreateEdit = !action.payload?.data?._id
        state.messageCreateEdit = action.payload.message
        state.typeError = action.payload.typeError
      })

    // ** Delete Role
    builder.addCase(deleteRoleAsync.pending, (state, action) => {
      //khi đang call
      state.isLoading = true
    }),
      builder.addCase(deleteRoleAsync.fulfilled, (state, action) => {
        //khi call thành công
        state.isLoading = false
        console.log('actionRole', action)
        state.isSuccessDelete = !!action.payload?.data?._id // nêu có dât.id thì sẽ thành công
        state.isErrorDelete = !action.payload?.data?._id
        state.messagErrorDelete = action.payload.message
        state.typeError = action.payload.typeError
      })
  }
})

export const { resetInitialState } = roleSlice.actions
export default roleSlice.reducer
