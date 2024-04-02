import React, { useEffect, useState } from 'react'
import { styled, alpha, useTheme } from '@mui/material/styles'

import InputBase from '@mui/material/InputBase'
import { useTranslation } from 'react-i18next'
import IconifyIcon from '../Icon'
import { useDebounce } from 'src/hooks/useDebounce'

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

interface TInputSearch {
  value?: string
  onChangeSearch: (value: string) => void
}

const InputSearch = (props: TInputSearch) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const { value, onChangeSearch } = props

  // const [search, setSearch] = useState<string>("")
  const [search, setSearch] = useState(value)

  const debounceSearch = useDebounce(search, 500) //cập nhật giá trị search sau 500ms

  useEffect(() => {
    onChangeSearch(debounceSearch)
  }, [debounceSearch])

  return (
    <Search>
      <SearchIconWrapper>
        <IconifyIcon icon='material-symbols-light:search' />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder='Search…'
        value={search}
        inputProps={{ 'aria-label': 'search' }}
        onChange={e => {
          setSearch(e.target.value)
        }}
      />
    </Search>
  )
}

export default InputSearch
