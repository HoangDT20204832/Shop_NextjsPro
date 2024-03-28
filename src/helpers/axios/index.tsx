// ** Axios
import axios from 'axios'

// ** Configs
import { BASE_URL, API_ENDPOINT } from 'src/configs/api'
import { jwtDecode } from 'jwt-decode' //  dungf để mã hóa accesstoken phía fe để bieestt thời gian bắt đầu vfa hết hạn của nó

// ** Helpers
import {
  clearLocalUserData,
  clearTemporaryToken,
  getLocalUserData,
  getTemporaryToken,
  setLocalUserData,
  setTemporaryToken
} from '../storage'

// ** Contexts
import { UserDataType } from 'src/contexts/types'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Reaxt
import { FC } from 'react'

// ** Next
import { NextRouter, useRouter } from 'next/router'

type TAxiosInterceptor = {
  children: React.ReactNode
}

const instanceAxios = axios.create({ baseURL: BASE_URL })

//hàm xử lý để đá về trang Login
const handleRedirectLogin = (router: NextRouter, setUser: (data: UserDataType | null) => void) => {
  if (router.asPath !== '/') {
    router.replace({
      pathname: '/login',
      query: { returnUrl: router.asPath }
    })
  } else {
    router.replace('/login')
  }
  setUser(null)
  clearLocalUserData()
  clearTemporaryToken()
}

//dùng interceptors để custom lại axios để đưa accesstoken vào headers luôn; chứ ko cần phải viết headers ra ở code => chỉ cần dùng instanceAxios
//Khi gửi 1 request lên sever(call APi) thì sẽ đi qua interceptors; "config" sẽ chứa thằng headers => ta sẽ đưa accesstoken vào thg headers của config

const AxiosInterceptor: FC<TAxiosInterceptor> = ({ children }) => {
  const router = useRouter()
  const { setUser, user } = useAuth()

  //các hàm useRouter, useAuth,... ko thể khai báo  trong interceptors => phải đưa nó vào trong 1 component rồi move useRouter,... lên trên
  instanceAxios.interceptors.request.use(async config => {
    console.log('config', config)
    const { accessToken, refreshToken } = getLocalUserData() // chuyển xuống đây để mỗi khi thay mật khẩu,... sẽ lấy acctoken mới nhất

    const { temporaryToken } = getTemporaryToken()
    if (accessToken || temporaryToken) {
      let decodeAccessToken: any = {}
      if (accessToken) {
        decodeAccessToken = jwtDecode(accessToken) //nếu có acccesstoken thì sẽ mã hóa nó
      } else if (temporaryToken) {
        decodeAccessToken = jwtDecode(temporaryToken) //nếu có temporaryToken thì sẽ mã hóa nó
      }

      if (decodeAccessToken?.exp > Date.now() / 1000) {
        //// neeus accesstoken hoặc temporaryToken  còn hạn thì sẽ đưa accesstoken vào "headers" của connffig
        config.headers['Authorization'] = `Bearer ${accessToken ? accessToken : temporaryToken}`
      } else {
        //nếu accesstoken hết hạn
        if (refreshToken) {
          const decodedRefreshToken: any = jwtDecode(refreshToken) //mã hóa refreshtoken

          if (decodedRefreshToken?.exp > Date.now() / 1000) {
            //nếu refreshtoken còn hạn => gọi api để tạo ra accesstoken mới
            await axios
              .post(
                `${API_ENDPOINT.AUTH.INDEX}/refresh-token`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${refreshToken}`
                  }
                }
              )
              .then(res => {
                const newAccessToken = res?.data?.data?.access_token //lấy access_token mưới ra rồi gán nó vào trong headers của config
                if (newAccessToken) {
                  config.headers['Authorization'] = `Bearer ${newAccessToken}`
                  if (accessToken) {
                    // lấy acctoken mưới gán vào trong acctokene lưu ở phái storgate
                    setLocalUserData(JSON.stringify(user), newAccessToken, refreshToken)
                  }
                } else {
                  handleRedirectLogin(router, setUser)
                }
              })
              .catch(e => {
                handleRedirectLogin(router, setUser)
              })
          } else {
            handleRedirectLogin(router, setUser)
          }
        } else {
          handleRedirectLogin(router, setUser)
        }
      }
    } else {
      handleRedirectLogin(router, setUser)
    }

    return config
  })

  //khi server tả về daTSA CHO MÌNH THÌ NSO SẼ ĐI QUA interceptors ; TRONG ĐÂY CÓ CÓ response => nso giống nhưu thg config cũng gồm cá thoogn tin nhưu data,config, headers,...
  instanceAxios.interceptors.response.use(response => {
    console.log('response', response)

    return response
  })

  return <>{children}</>
}

export default instanceAxios

export { AxiosInterceptor }
