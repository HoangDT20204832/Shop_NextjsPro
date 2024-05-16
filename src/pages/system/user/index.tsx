// Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'
import { PERMISSIONS } from 'src/configs/permission'

// ** Views
import BlackLayout from 'src/views/layouts/BlackLayout'
import RegisterPage from 'src/views/pages/register'
import UserListPage from 'src/views/pages/system/user/UserList'

type TProps = {}

const User: NextPage<TProps> = () => {
  return <UserListPage />
}

//đặt quyền truy cập vào trang User => chỉ những tài khoản có permissonUser = ["ADMIN.GRANTED"] hoặc bao gồm quyèn như ở dưới(PERMISSIONS.SYSTEM.USER.VIEW]) mới được vào
User.permisson = [PERMISSIONS.SYSTEM.USER.VIEW] 
export default User
