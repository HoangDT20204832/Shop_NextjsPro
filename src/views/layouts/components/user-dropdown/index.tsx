// ** React
import React from 'react'

// ** Mui Imports
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Image from 'next/image'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import IconifyIcon from '../../../../components/Icon'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { ROUTE_CONFIG } from 'src/configs/route'

// import PersonAdd from '@mui/icons-material/PersonAdd';
// import Settings from '@mui/icons-material/Settings';
// import Logout from '@mui/icons-material/Logout';

type TProps = {}
const UserDropdown = (props: TProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  //lây {t} để chuyển đổi ngôn ngư
  const { t } = useTranslation()

  //lấy thoogn tin user khi đăng nhập và chức năng logout
  const { user, logout } = useAuth()

  const open = Boolean(anchorEl)
  const router = useRouter()
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleNavigateMyProfile = () => {
    // dùng với push để điều hướng trang vẫn giống như replace => nhưng khác ở chỗ push dùng khi  muốn cho phép họ quay lại trang trước đó bằng cách sử dụng nút "Back" trong trình duyệt => có thể back về trang home
    // còn replace thì sử dụng khi bạn không muốn người dùng quay lại trang trước đó bằng cách sử dụng nút "Back" trong trình duyệt // vd trang login thì ko muốn họ back về trang home
    router.push(`/${ROUTE_CONFIG.MY_PROFILE}`) 
    handleClose()
  }

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title={t('Account')}>
          <IconButton
            onClick={handleClick}
            size='small'
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.avatar ? (
                <Image
                  src={user?.avatar || ''}
                  alt='avatar'
                  style={{
                    height: 'auto',
                    width: 'auto'
                  }}
                />
              ) : (
                <IconifyIcon icon='ph:user-thin' />
              )}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          {user?.email}
          {/* {user?.firstName}{user?.middleName}{user?.lastName} */}
        </MenuItem>
        <MenuItem onClick={handleNavigateMyProfile}>
          <Avatar /> {t('my_profile')}
        </MenuItem>

        <MenuItem onClick={logout}>
          <ListItemIcon>{/* <Logout fontSize="small" /> */}</ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  )
}

export default UserDropdown
