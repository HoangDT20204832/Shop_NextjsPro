// **Next
import { NextPage } from 'next'

// ** React
import React, { useEffect, useState } from 'react'

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
import { VerticalItems } from 'src/configs/layout'
import { useRouter } from 'next/router'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

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

  return (
    <>
      {items?.map((item: any) => {
        return (
          <React.Fragment key={item.title}>
            <ListItemButton
              sx={{
                padding: `8px 10px 8px ${level * (level === 1 ? 28 : 20)}px`,
                backgroundColor:
                  (activePath && item.path === activePath) || openItems[item.title]
                    ? `${hexToRGBA(theme.palette.primary.main, 0.08)} !important`
                    : theme.palette.background.paper
              }}
              onClick={() => {
                if (item.childrens) {
                  handleClick(item.title)
                }
                handleSelectItem(item.path)
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
                      (activePath && item.path === activePath) || !!openItems[item.title]
                        ? `${theme.palette.primary.main} !important`
                        : theme.palette.background.paper
                  }}
                >
                  <IconifyIcon
                    style={{
                      color:
                        (activePath && item.path === activePath) || !!openItems[item.title]
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
                    active={(activePath && item.path === activePath) || openItems[item.title]}
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
                        color: !!openItems[item.title]
                          ? `${theme.palette.primary.main}`
                          : `rgba(${theme.palette.customColors.main}, 0.78)`
                      }}
                    />
                  ) : (
                    <IconifyIcon icon='material-symbols-light:expand-less-rounded' />
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

  useEffect(() => {
    if (!open) {
      setOpenItems({})
    }
  }, [open])
  const listVerticalItems = VerticalItems()

  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component='nav'
      aria-labelledby='nested-list-subheader'
    >
      <RecursiveListItems
        items={listVerticalItems}
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
