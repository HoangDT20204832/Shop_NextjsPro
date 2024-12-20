export default {
  meEndpoint: '/auth/me',
  
  // loginEndpoint: '/jwt/login',
  // registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}

export const ACCESS_TOKEN = "accessToken";
export const REFRESH_TOKEN = "refreshToken";
export const USER_DATA = "userData";
export const TEMPORARY_TOKEN = "temporaryToken";
export const PRE_AUTH_TOKEN = 'prevAuthToken'

// chứa các đường dẫn các trang là public(ko cần đăng nhập) để xử lý logic khi logout
export const LIST_PAGE_PUBLIC = ["/product", "/home"]