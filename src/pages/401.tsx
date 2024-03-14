import Typography from '@mui/material/Typography'
import { ReactNode } from 'react'
import BlackLayout from 'src/views/layouts/BlackLayout'

const Error401 = () => {
  return (
    <Typography variant='h2' sx={{ mb: 1.5 }}>
      You are not authorized!
    </Typography>
  )
}

export default Error401
Error401.getLayout = (page: ReactNode) => <BlackLayout>{page}</BlackLayout>
