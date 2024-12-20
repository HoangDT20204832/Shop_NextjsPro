export type ErrCallbackType = (err:any) => void

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
}

export type LoginGoogleParams = {
  idToken: string
  rememberMe?: boolean
}

export type LoginFacebookParams = {
  idToken: string
  rememberMe?: boolean
}

export type TUserAddresses = {
  address: string,
  city: string,
  phoneNumber: string,
  firstName: string,
  lastName: string,
  middleName: string,
  isDefault: boolean,
}

export type UserDataType = {
  _id: string
  role: {
    name:string,
    permissions: string[]
  }
  email: string
  firstName: string
  middleName: string
  lastName: string
  password: string
  avatar?: string | null
  city: string
  phoneNumber: string,
  address?: string
  likedProducts: string[]
  addresses:TUserAddresses[] // biến chứa các địa chỉ nhận hàng để chọn
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  loginGoogle: (params: LoginGoogleParams, errorCallback?: ErrCallbackType) => void
  loginFacebook: (params: LoginFacebookParams, errorCallback?: ErrCallbackType) => void
}
