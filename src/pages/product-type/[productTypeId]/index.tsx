'use client'
import Head from 'next/head'
import { ReactNode } from 'react'
// layouts
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'
// ** Pages
import HomePage from 'src/views/pages/home'
import ProductTypePage from 'src/views/pages/product-type'

export default function ProductType() {
  return (
      <ProductTypePage />
  )
}
ProductType.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
ProductType.guestGuard = false
ProductType.authGuard = false