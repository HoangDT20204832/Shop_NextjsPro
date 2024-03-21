// ** Configs
import { ACCESS_TOKEN, REFRESH_TOKEN, TEMPORARY_TOKEN, USER_DATA } from 'src/configs/auth'

export const setLocalUserData = (userData: string, accessToken: string, refreshToken: string) => {
  if(typeof window !== 'undefined'){ 
     window.localStorage.setItem(USER_DATA, userData),
     window.localStorage.setItem(ACCESS_TOKEN, accessToken),
    window.localStorage.setItem(REFRESH_TOKEN, refreshToken)
  }
}

export const getLocalUserData = () => {
  //xét thêm điều kiện này để khi có window mới trả về; để tránh khi dùng nso trong 1 component có sửu dụng cả 2 hình thức serversiderendering và cliensiderendering
    // vd:_app.tsx
  if(typeof window !== 'undefined') {  
  return {
    userData: window.localStorage.getItem(USER_DATA),
    accessToken: window.localStorage.getItem(ACCESS_TOKEN),
    refreshToken: window.localStorage.getItem(REFRESH_TOKEN)
  }
}

   return {
    userData: '',
    accessToken: '',
    refreshToken: ''
   }
}

export const clearLocalUserData = () => {
  if(typeof window !== 'undefined') {
    window.localStorage.removeItem(USER_DATA)
    window.localStorage.removeItem(ACCESS_TOKEN)
    window.localStorage.removeItem(REFRESH_TOKEN)
  }

}

///////////////
// Tạo ra TemporaryToken: 1 access token tạm thời (khi ko chọn remmeber me) sẽ bị xóa đi khỏi localStogate khi reload lại trang
// và khi TemporaryToken hết hạn thì sẽ có refreshToken cấp lại TemporaryToken mới => phải đăng nhập lại

export const setTemporaryToken = ( accessToken: string) => {
  if(typeof window !== 'undefined'){ 
     window.localStorage.setItem(TEMPORARY_TOKEN, accessToken)
  }
}

export const getTemporaryToken = () => {
  //xét thêm điều kiện này để khi có window mới trả về; để tránh khi dùng nso trong 1 component có sửu dụng cả 2 hình thức serversiderendering và cliensiderendering
    // vd:_app.tsx
  if(typeof window !== 'undefined') {  
  return {
    temporaryToken: window.localStorage.getItem(TEMPORARY_TOKEN),
  }
}

return {
    temporaryToken: '',
   }
}

export const clearTemporaryToken = () => {
  if(typeof window !== 'undefined') {
    window.localStorage.removeItem(TEMPORARY_TOKEN)
  }
}

