// ** React Imports
import { ReactNode } from 'react'

// ** Types
import { buildAbilityFor, type ACLObj, type AppAbility } from 'src/configs/acl'
import BlackLayout from 'src/views/layouts/BlackLayout'
import NotAuthorized from 'src/pages/401'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'
import { AbilityContext } from '../acl/Can'
import { PERMISSIONS } from 'src/configs/permission'

interface AclGuardProps {
  children: ReactNode
  authGuard?: boolean
  guestGuard?: boolean
  aclAbilities: ACLObj
  permisson?: string[]
}

const AclGuard = (props: AclGuardProps) => {
  // ** Props
  const { aclAbilities, children, guestGuard = false, authGuard = true, permisson } = props

  const auth = useAuth()
  //nếu permissionUser chứa PERMISSIONS.BASIC thì sẽ đặt permissionUser = [PERMISSIONS.DASHBOARD] (vì BASIC chỉ có quyền Dashboard)
  // còn nếu ko có thì vẫn gán bình thường(auth.user?.role?.permissions)
  const permissionUser = auth.user?.role?.permissions
    ? (auth.user?.role?.permissions.includes(PERMISSIONS.BASIC)
      ? [PERMISSIONS.DASHBOARD]
      : auth.user?.role?.permissions
      )
    : []
  // const permissionUser = [PERMISSIONS.SYSTEM.USER.VIEW]
  const router = useRouter()

  let ability: AppAbility //khai baos der phan quyen

  if (auth.user && !ability) {
    //nếu đã đăng nhập mà kiểm tra chưa có ability(quyền) thì sẽ cấp quyền cho nó
    ability = buildAbilityFor(permissionUser, permisson)
  }

  //với những trang là khách hoặc ko yêu cầu guard hoặc những trang bị lỗi
  if (guestGuard || router.route === '/500' || router.route === '/404' || !authGuard) {
    if (auth.user && ability) {
      //  với những thg đã đăng nhập và đã có ability(đã buildAbilityFor )
      //<AbilityContext.Provider value={ability}></AbilityContext.Provider>   =>tạo ra context để tái sawur dụng lại, có thể check quyền xem ở trang đó thì người đó có quyền được xem; được tạo sản phẩm,... dựa vào value={ability}
      return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
    } else {
      // với guestGuard vafg ko đăng nhập => ko có role để check quyền => return thanwhf về children
      return children
    }
  }

  // với thằng user đã đăng nhập và có quyền truy cập vào trang
  if (ability && auth.user && ability.can(aclAbilities.action, aclAbilities.subject)) {
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  }

  //nếu ko rơi vào 2 TH lớn trên thì sẽ trả về <NotAuthorized />: ko có quyền truy cập
  return (
    <BlackLayout>
      <NotAuthorized />
    </BlackLayout>
  )

  // return <>{children}</>
}

export default AclGuard
