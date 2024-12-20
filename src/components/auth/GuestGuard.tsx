// ** React Imports
import { useRouter } from 'next/router'
import { ReactNode, ReactElement, useEffect } from 'react'
import { ACCESS_TOKEN, USER_DATA } from 'src/configs/auth'
import { useAuth } from 'src/hooks/useAuth'

import { useSession } from 'next-auth/react'

interface GuestGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

//nếu đã đăng nhập rồi thì sẽ ko cho vào lại những trang như login, register
// những trang chỉ cho khách vào, user ko dc vào
const GuestGuard = (props: GuestGuardProps) => {
  const { children, fallback } = props

  const router = useRouter()

  const { data: session, status } = useSession()
  console.log("session", {session})
  
  const authContext = useAuth()
  useEffect(() => {
    if(!router.isReady){   //nếu Page chưa first=render xong thì sẽ chạy return => ko chạy hàm if() phái dưới
      return
    }

    if (     //nếu đã đăng nhập rồi thì sẽ ko cho vào lại những trang như login, register
      window.localStorage.getItem(ACCESS_TOKEN) &&
      window.localStorage.getItem(USER_DATA)
    ) {
      router.replace('/')
    }
  }, [router.route])

  //để hiển thị quay khi cố vào trang login/register khi đã đăng nhập; tránh hiển thị trang login 1 lúc rồi mới đá sang home
  if(authContext.loading || (!authContext.loading && authContext.user !== null)){ //nếu user đã có(đã đăng nhập) => cố vào login sẽ gọi fallback(quay)
    return fallback
  }

  return <>{children}</>
}

export default GuestGuard
