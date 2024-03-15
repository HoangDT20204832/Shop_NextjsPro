// ** React Imports
import { useRouter } from 'next/router'
import { ReactNode, ReactElement, useEffect } from 'react'
import { ACCESS_TOKEN, USER_DATA } from 'src/configs/auth'
import { clearLocalUserData } from 'src/helpers/storage'
import { useAuth } from 'src/hooks/useAuth'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

//nhưngx trang bắt buộc đăng nhập ; nếu cố vào mà chưa đăng nhập sẽ bị đá sang trang login
// những trang chỉ cho user vào, khách ko dc vào
const AuthGuard = (props: AuthGuardProps) => {  
  const { children, fallback } = props

  // return fallback  //nếu chả về fallback thì sẽ ko hiện page mà chỉ hiện trang trống đang quay

  const authContext = useAuth()
  const router = useRouter()

  useEffect(() => {
    if(!router.isReady){   //nếu Page chauw first=render xong thì sẽ chạy return => ko chạy hàm if() phái dưới
      return
    }

    if (     //nếu vào những trang bắt buộc đăng nhập mà chưa đăng nhập thì sẽ đá sang trnag login
      authContext.user === null &&
      !window.localStorage.getItem(ACCESS_TOKEN) &&
      !window.localStorage.getItem(USER_DATA)
    ) {
      if(router.asPath !== '/' && router.asPath !== '/login'){       //nếu trang muốn vào ko phải trang Home => khi bị bắt đăng nhập thì sẽ kèm theo returnUrl để khi đăng nhập sẽ đá sang chính trang đó
      router.replace({        
        pathname: '/login',
        query: {returnUrl : router.asPath}
      })
      } else{
        router.replace('/login')
      }
      authContext.setUser(null)
      clearLocalUserData()
    }
  }, [router.route])

  //để hiển thị quay khi cố vào trang bắt bc mà chưa đăng nhập; tránh hiển thị trang đó 1 lúc rồi mới đá sang login
  if(authContext.loading || authContext.user === null){
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
