// ** React Imports
import { ReactNode } from 'react'

// ** Types
import type { ACLObj } from 'src/configs/acl'
import BlackLayout from 'src/views/layouts/BlackLayout'
import NotAuthorized from 'src/pages/401'

interface AclGuardProps {
  children: ReactNode
  authGuard?: boolean
  guestGuard?: boolean
  aclAbilities: ACLObj
}

const AclGuard = (props: AclGuardProps) => {
  // ** Props
  const { aclAbilities, children, guestGuard = false, authGuard = true } = props

  return (
    <BlackLayout>
      <NotAuthorized />
    </BlackLayout>
  )
  
  // return <>{children}</>
}

export default AclGuard
