
// Next
import {NextPage} from 'next'

// ** React
import { ReactNode } from 'react'

// ** Views
import BlackLayout from 'src/views/layouts/BlackLayout'
import LoginPage from 'src/views/pages/login'

type TProps = {}

 const Login:NextPage<TProps>=()=> {

  return <LoginPage />
}

export default Login

//  xem ở file next.d.ts:  getLayout?: (page: ReactElement) => ReactNode
//trang Login có truyền getLayout là dùng layout của BlackLayout
Login.getLayout = (page: ReactNode) => <BlackLayout>{page}</BlackLayout>