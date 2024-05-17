export type TParamsGetUsers = {
  limit?: number
  page?: number
  search?: string
  order?: string
}
export type TParamsCreateUser = {
  firstName?:string,
  lastName?:string,
  middleName?:string,
  email: string,
  password: string,
  role: string,
  phoneNumber: string,
  address?: string,
  city?: string,
  avatar?:string
}
export type TParamsEditUser = {
  id: string,
  firstName?:string,
  lastName?:string,
  middleName?:string,
  email: string,
  role: string,
  phoneNumber: string,
  address?: string,
  city?: string,
  status?: number,
  avatar?:string
}
export type TParamsDeleteUser = {
  id: string
}
export type TParamsDeleteMultipleUser ={
  userIds: string[]
}
