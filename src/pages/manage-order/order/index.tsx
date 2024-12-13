
// Next
import {NextPage} from 'next'

// ** React
import { ReactNode } from 'react'
import { PERMISSIONS } from 'src/configs/permission'

// ** Views
import BlackLayout from 'src/views/layouts/BlackLayout'
import RegisterPage from 'src/views/pages/register'

type TProps = {}

 const Order:NextPage<TProps>=()=> {

  return (
    <> Day la trang Order</>
  )
}
//đặt quyền truy cập vào trang Order => chỉ những tài khoản có permissonUser = ["ADMIN.GRANTED"] hoặc bao gồm quyèn như ở dưới(PERMISSIONS.MANAGE_ORDER.ORDER.VIEW]) mới được vào
Order.permission = [PERMISSIONS.MANAGE_ORDER.ORDER.VIEW] 
export default Order


