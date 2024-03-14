import Typography from '@mui/material/Typography'
import { ReactNode } from 'react'
import BlackLayout from 'src/views/layouts/BlackLayout'

const Error500 = () => {
  return (
    <Typography variant='h2' sx={{ mb: 1.5 }}>
      Oops, something went wrong!
    </Typography>
  )
}

export default Error500
Error500.getLayout = (page: ReactNode) => <BlackLayout>{page}</BlackLayout>

