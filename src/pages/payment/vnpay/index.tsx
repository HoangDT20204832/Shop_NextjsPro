// ** Import Next
import { NextPage } from 'next'
import { ReactNode } from 'react'
// ** views
import PaymentVNPay from 'src/views/pages/payment/vnpay'
// import BlankLayout from 'src/views/layouts/BlankLayout'
import BlackLayout from 'src/views/layouts/BlackLayout'

type TProps = {}
const Index: NextPage<TProps> = () => {
    return <PaymentVNPay />
}
export default Index
Index.getLayout = (page: ReactNode) => <BlackLayout>{page}</BlackLayout>
