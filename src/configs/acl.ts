import { AbilityBuilder, Ability } from '@casl/ability'
import { PERMISSIONS } from './permission'

export type Subjects = string
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete'

export type AppAbility = Ability<[Actions, Subjects]> | undefined

export const AppAbility = Ability as any
export type ACLObj = {
  action: Actions
  subject: string
}

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */

//hàm giúp tạp rules cho vc phân quyền 
const defineRulesFor = (permissionUser: string[], permisson?:string[]) => {
  const { can, rules } = new AbilityBuilder(AppAbility)

  //permisson: permisson đặt ở mỗi trang Page; permissionUser: permisson của tài khoản đăng nhập
  //sẽ cho vào trang nếu trang đó không đặt permisson
  // hoặc user có permissionUser= PERMISSIONS.ADMIN
  // hoặc permisson được đặt của trang đấy có trong mảng permisson của tài khoản đăng nhập(permissionUser)
  if (!permisson?.length || permissionUser.includes(PERMISSIONS.ADMIN) || permisson.every((item) => permissionUser.includes(item)) ) {
    can('manage', 'all')  // return về "can" thì user có quyền ở trang ấy (vào trang, hoặc xem, xoá, sửa, thêm ở trang)
  } 

  return rules  // return về rules thì là usersẽ ko có quyền ở trang ấy (vào trang, hoặc xem, xoá, sửa, thêm ở trang)
}

//hàm giúp xây dựng quyền 
export const buildAbilityFor = (permissionUser: string[], permisson?:string[]): AppAbility => {
  return new AppAbility(defineRulesFor(permissionUser,permisson), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object!.type
  })
}

export const defaultACLObj: ACLObj = {
  action: 'manage',
  subject: 'all'
}

export default defineRulesFor
