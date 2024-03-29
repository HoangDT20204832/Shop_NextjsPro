// Next
import { NextPage } from 'next'

// ** React
import { ReactNode } from 'react'

// ** Views
import BlackLayout from 'src/views/layouts/BlackLayout'
import RegisterPage from 'src/views/pages/register'
import RoleListPage from 'src/views/pages/system/role/RoleList'

type TProps = {}

const Role: NextPage<TProps> = () => {
  return <RoleListPage />
}

export default Role
