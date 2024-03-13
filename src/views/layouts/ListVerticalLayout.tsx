// **Next
import { NextPage } from 'next'

// ** React
import React, { useEffect, useState } from 'react'

// ** Mui
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'

// ** Components
import IconifyIcon from 'src/components/Icon'

// ** Configs 
import { VerticalItems } from 'src/configs/layout'

type TProps = {
  open: boolean
}

type TListItems = {
  level: number,
  openItems:{
    [key: string]: boolean
  },
  items: any,
  setOpenItems: React.Dispatch<
  React.SetStateAction<{
    [key: string]: boolean
  }>
  >,
  disabled: boolean
}

const RecursiveListItems:NextPage<TListItems> = ({ items, level,openItems, setOpenItems, disabled }) => {
  // const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({})

  const handleClick = (title: string) => {
    if(!disabled){
      setOpenItems((pre) => ({
        ...pre,
        [title]: !pre[title]
      }))
    }
    }

  return (
    <>
      {items?.map((item: any) => {
        return (
          <React.Fragment key={item.title}>
            <ListItemButton
              sx={{
                padding: `8px 10px 8px ${level * (level ===1 ?28: 20)}px`
              }}
              onClick={()=>{
                if(item.childrens){
                  handleClick(item.title)
                }
              }}
            >
              <ListItemIcon>
                <IconifyIcon icon={item.icon} />
              </ListItemIcon>
              {!disabled && <ListItemText primary={item.title} />}
              {item?.childrens && item?.childrens.length > 0 && (
                <>
                  {openItems[item.title] ? (
                    <IconifyIcon icon='material-symbols-light:expand-less-rounded' style={{
                      transform:"rotate(180deg)"
                    }} />
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
                  items={item.childrens} level={level + 1}
                  openItems={openItems}
                  setOpenItems={setOpenItems}
                  disabled={disabled} />
                </Collapse>
              </>
            )}
          </React.Fragment>
        )
      })}
    </>
  )
}

const ListVerticalLayout: NextPage<TProps> = ({open}) => {
  // const [open, setOpen] = React.useState(true)
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({})

  useEffect(()=>{
    if(!open){
      setOpenItems({})
    }
  },[open])

  // const handleClick = () => {
  //   setOpenItems(!open)
  // }

  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component='nav'
      aria-labelledby='nested-list-subheader'
    >
      <RecursiveListItems items={VerticalItems} level={1}
       openItems={openItems}
       setOpenItems={setOpenItems}
       disabled={!open} />

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
