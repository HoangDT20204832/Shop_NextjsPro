

// ** React
import * as React from 'react'

// ** next
import { NextPage } from 'next'

// ** Mui
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'

// ** views
import HorizontalLayout from 'src/views/layouts/HorizontalLayout'
import VerticalLayout from 'src/views/layouts/VerticalLayout'

type TProps = {
  children: React.ReactNode    //children ở đây chính là các component thể hiện các trang giao diện 
                                //=> set type để là: React.ReactNode
}

const LayoutNotApp: NextPage<TProps> = ({ children }) => {
  const [open, setOpen] = React.useState(true)

//   const toggleDrawer = () => {
//     setOpen(!open)
//   }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* <VerticalLayout toggleDrawer={toggleDrawer} open={open} /> */}
      <HorizontalLayout toggleDrawer={()=>{}} open={false} isHideMenu />
      <Box
        component='main'
        sx={{
          backgroundColor: theme =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto'
        }}
      >
        <Toolbar />
        <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  )
}

export default LayoutNotApp