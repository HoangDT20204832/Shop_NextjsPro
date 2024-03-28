// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
// import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, LoginParams, ErrCallbackType, UserDataType } from './types'

// ** Services
import { loginAuth, logoutAuth } from 'src/services/auth'

// ** Configs
import { API_ENDPOINT } from 'src/configs/api'

// ** helpers
import { clearLocalUserData, setLocalUserData, setTemporaryToken } from 'src/helpers/storage'
import instanceAxios from 'src/helpers/axios'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  // ** Language
  const { t } = useTranslation()

  useEffect(() => {
    //chaỵ vào initAuth() khi đã đăng nhập, rồi refresh lại trang

    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
      if (storedToken) {
        setLoading(true)
        await instanceAxios
          .get(
            API_ENDPOINT.AUTH.AUTH_ME

            //   , {
            //   headers: {
            //     Authorization: `Bearer ${storedToken}`
            //   }
            // }
          )
          .then(async response => {
            console.log('response: ', response)
            setLoading(false)
            setUser({ ...response.data.data })
          })
          .catch(() => {
            clearLocalUserData()
            setUser(null)
            setLoading(false)
            if (!router.pathname.includes('login')) {
              router.replace('/login')
            }
          })
      } else {
        setLoading(false)
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    loginAuth({ email: params.email, password: params.password }) // gọi hàm loginAuth từ folder services/auth
      .then(async response => {
        // đăng nhập thành công sẽ chyaj vào nhánh này
        if (params.rememberMe) {
          ////nếu tích vào Rememberme thì sẽ lưu userData,accesstoken,refresh_token vào localstorgate
          setLocalUserData(JSON.stringify(response.data.user), response.data.access_token, response.data.refresh_token)
        } else {
          // nếu ko thì chỉ cấp cho nó 1 TemporaryToken có thời hạn => khi refresh lại trang thì sẽ xóa thoogn tin user và đá sang trang login để đăng nhập lại
          setTemporaryToken(response.data.access_token)
        }
        toast.success(t('login_success'))
        const returnUrl = router.query.returnUrl
        console.log('res', response)

        setUser({ ...response.data.user })

        // params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(response.data.user)) : null //nếu tích vào Rememberme thì sẽ lưu luôn thông tin người dùng vào localStrorgate

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

        router.replace(redirectURL as string)
      })

      .catch((err: any) => {
        // đăng nhập thất bại sẽ chạy vào nhánh này
        console.log('err', { err })
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    logoutAuth().then(res => {
      setUser(null)
      clearLocalUserData()
      router.push('/login')
    })
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
