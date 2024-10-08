// **Next
import { NextPage } from 'next'

// ** React
import React, { useEffect, useMemo, useState } from 'react'

// ** Mui
import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItemTextProps,
  ListSubheader,
  styled,
  Tooltip,
  useTheme,
  useThemeProps
} from '@mui/material'

// ** Components
import IconifyIcon from 'src/components/Icon'

// ** Configs
import { TVertical, VerticalItems } from 'src/configs/layout'
import { useRouter } from 'next/router'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { PERMISSIONS } from 'src/configs/permission'
import { useAuth } from 'src/hooks/useAuth'

type TProps = {
  open: boolean
}

type TListItems = {
  level: number
  openItems: {
    [key: string]: boolean
  }
  items: any
  setOpenItems: React.Dispatch<
    React.SetStateAction<{
      [key: string]: boolean
    }>
  >
  disabled: boolean
  activePath: string | null
  setActivePath: React.Dispatch<React.SetStateAction<string | null>>
}

interface TListItemText extends ListItemTextProps {
  active: boolean
}
const StyleListItemText = styled(ListItemText)<TListItemText>(({ theme, active }) => ({
  '.MuiTypography-root.MuiTypography-body1.MuiListItemText-primary': {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    display: 'block',
    width: '100%',
    color: active ? `${theme.palette.primary.main} !important` : `rgba(${theme.palette.customColors.main}, 0.78)`,
    fontWeight: active ? 600 : 400
  }
}))

const RecursiveListItems: NextPage<TListItems> = ({
  items,
  level,
  openItems,
  setOpenItems,
  disabled,
  activePath,
  setActivePath
}) => {
  // const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({})

  const handleClick = (title: string) => {
    if (!disabled) {
      setOpenItems(pre => ({
        [title]: !pre[title]
      }))
    }
  }

  // ** theme
  const theme = useTheme()

  // ** router
  const router = useRouter()

  const handleSelectItem = (path: string) => {
    setActivePath(path)
    if (path) {
      router.push(path)
    }
  }
  console.log('activePath', { activePath })

  const isParentHaveChildActive = (item : TVertical):boolean =>{  //kiêm tra xem Parent có chứa con đang đc active ko
    if(!item.childrens){ //nếu item ko có con
      return item.path === activePath
    }else //nếu item có con
    {
      return item.childrens.some((item:TVertical) => isParentHaveChildActive(item))
    }
  }

  return (
    <>
      {items?.map((item: any) => {
        const isParentActive = isParentHaveChildActive(item)  // isParentActive= true nếu chứa thg con đang active
        console.log("kk", item) 

        return (
            <React.Fragment key={item.title}>
              <ListItemButton
                sx={{
                  padding: `8px 10px 8px ${level * (level === 1 ? 28 : 20)}px`,
                  backgroundColor:
                    (activePath && item.path === activePath) || openItems[item.title] ||isParentActive
                      ? `${hexToRGBA(theme.palette.primary.main, 0.08)} !important`
                      : theme.palette.background.paper,
                }}
                onClick={() => {
                  if (item.childrens) {
                    handleClick(item.title)
                  }
                  if(item.path){ //nếu có path thid mới set lại activePath
                    handleSelectItem(item.path)
                  }
                }}
              >
                <ListItemIcon>
                  <Box
                    sx={{
                      borderRadius: '8px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      display: 'flex',
                      height: '30px',
                      width: '30px',
                      backgroundColor:
                        (activePath && item.path === activePath) || !!openItems[item.title] || isParentActive
                          ? `${theme.palette.primary.main} !important`
                          : theme.palette.background.paper
                    }}
                  >
                    <IconifyIcon
                      style={{
                        color:
                          (activePath && item.path === activePath) || !!openItems[item.title] || isParentActive
                            ? `${theme.palette.customColors.lightPaperBg}`
                            : `rgba(${theme.palette.customColors.main}, 0.78)`
                      }}
                      icon={item.icon}
                    />
                  </Box>
                </ListItemIcon>
                {!disabled && (
                  <Tooltip title={item.title}>
                    <StyleListItemText
                      primary={item.title}
                      active={(activePath && item.path === activePath) || openItems[item.title] || isParentActive} 
                    />
                  </Tooltip>
                )}
                {item?.childrens && item?.childrens.length > 0 && (
                  <>
                    {openItems[item.title] ? (
                      <IconifyIcon
                        icon='material-symbols-light:expand-less-rounded'
                        style={{
                          transform: 'rotate(180deg)',
                          color: !!openItems[item.title] || isParentActive
                            ? `${theme.palette.primary.main}`
                            : `rgba(${theme.palette.customColors.main}, 0.78)`
                        }}
                      />
                    ) : (
                      <IconifyIcon icon='material-symbols-light:expand-less-rounded'
                      style={{
                        color:  isParentActive
                          ? `${theme.palette.primary.main}`
                          : `rgba(${theme.palette.customColors.main}, 0.78)`
                      }} />
                    )}
                  </>
                )}
              </ListItemButton>
              {item.childrens && item.childrens.length > 0 && (
                <>
                  <Collapse in={openItems[item.title]} timeout='auto' unmountOnExit>
                    <RecursiveListItems
                      items={item.childrens}
                      level={level + 1}
                      openItems={openItems}
                      setOpenItems={setOpenItems}
                      disabled={disabled}
                      activePath={activePath}
                      setActivePath={setActivePath}
                    />
                  </Collapse>
                </>
              )}
            </React.Fragment>
          )
      
      })}
    </>
  )
}

const ListVerticalLayout: NextPage<TProps> = ({ open }) => {
  // const [open, setOpen] = React.useState(true)
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({})
  const [activePath, setActivePath] = useState<null | string>('')

  const router = useRouter()
  console.log("routerrr", router)
  const listVerticalItems = VerticalItems()

  const auth = useAuth()
    //nếu permissionUser chứa PERMISSIONS.BASIC thì sẽ đặt permissionUser = [PERMISSIONS.DASHBOARD] (vì BASIC chỉ có quyền Dashboard)
  // còn nếu ko có thì vẫn gán bình thường(auth.user?.role?.permissions)
  const permissionUser = auth.user?.role?.permissions
    ? (auth.user?.role?.permissions.includes(PERMISSIONS.BASIC)
      ? [PERMISSIONS.DASHBOARD]
      : auth.user?.role?.permissions
      )
    : []
  // const permissionUser:any[] = [PERMISSIONS.DASHBOARD, PERMISSIONS.SYSTEM.USER.VIEW]

  //tìm ra thg cha đang có thg con đang đc active để có thể mở thg cha ra bằng cách setOpenItems thg cha
  const findParentActivePath = (items : TVertical[], activePath:string) =>{
    for(const item of items){
        if(item.path === activePath){
          return item.title
        }
        if(item.childrens && item.childrens.length >0){
          const child:any = findParentActivePath(item.childrens,activePath)
          if(child){
            return item.title
          }
        }
    }

    return null
  }

  //
  const hasPermisson = (item:any, permissionUser: string[]) =>{
    //trả về true nếu user có quyền bao gồm item.permission hoặc quyền của user có ADMIN hoặc item.permission=[rỗng]
      return permissionUser.includes(item.permission) || !item.permission || permissionUser.includes(PERMISSIONS.ADMIN)
  }

  const formatMenuByPermisson = (menu: any[], permissionUser: string[])=>{
      if(menu){
        return menu.filter((item) =>{ //return true, flase trong filter là nếu return tru thì sẽ trả về những item có return là true, nếu return false thì sẽ bỏ qua những item đó
            if(hasPermisson(item, permissionUser)){  //nếu permissionUser có quyền của item cha hoặc quyền của các item con nằm trong item cha thì sẽ hiển thị item con và item cha lênn menu
              if(item.childrens && item.childrens.length > 0){
                item.childrens = formatMenuByPermisson(item.childrens, permissionUser) //nếu permissionUser có quyền nào của phần tử con của item.childrens thì item.childrens trả về 1 mảng gồm các phần tử con đó
              }
              
              if(!item?.childrens?.length  && !item.path) {//nếu item cha đó ko children con và ko có path thì cũng ko hiển thị lên menu
                  return false
              }

              return true
            }

            return false
        })
      }

      return []
  }

const memoFormatMenu = useMemo(()=>{
  return  formatMenuByPermisson(listVerticalItems, permissionUser)
},[listVerticalItems, permissionUser]) 

// console.log("formated", memoFormatMenu)
  useEffect(() => {
    if (!open) {
      setOpenItems({})
    }
  }, [open])
  
  useEffect(() =>{
    if(router.asPath){
      const parentTitle = findParentActivePath(listVerticalItems, router.asPath)
      if(parentTitle){
        setOpenItems({
          [parentTitle]:true
        })
      }
      setActivePath(router.asPath)
    }
  }, [router.asPath])

  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component='nav'
      aria-labelledby='nested-list-subheader'
    >
      <RecursiveListItems
        items={memoFormatMenu}
        level={1}
        openItems={openItems}
        setOpenItems={setOpenItems}
        disabled={!open}
        activePath={activePath}
        setActivePath={setActivePath}
      />

      {/* <ListItemButton onClick={handleClick}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Inbox" />
          {openState ? <IconifyIcon icon="material-symbols-light:expand-less-rounded" /> : <IconifyIcon icon="formkit:down" />}
        </ListItemButton> */}
    </List>
  )
}

export default ListVerticalLayout
