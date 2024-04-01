import React from 'react'
import { styled, alpha, useTheme } from '@mui/material/styles'

import InputBase from '@mui/material/InputBase'
import { useTranslation } from 'react-i18next'
import IconifyIcon from '../Icon'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25)
  },
  marginLeft: 0,
  width: '100%',
  height: '38px',
  border: `1px solid ${theme.palette.customColors.borderColor}`,
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto'
  }
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  height: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`
  }
}))

interface TInputSearch {}

const InputSearch = (props: TInputSearch) => {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <Search>
      <SearchIconWrapper>
        <IconifyIcon icon='material-symbols-light:search' />
      </SearchIconWrapper>
      <StyledInputBase placeholder='Search…' inputProps={{ 'aria-label': 'search' }} />
    </Search>
  )
}

export default InputSearch
