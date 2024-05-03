import { IconButton, Tooltip } from '@mui/material'
import IconifyIcon from '../Icon'
import { useTranslation } from 'react-i18next'

interface TGridEdit {
  onClick: () => void
  disabled?: boolean
}

const GridEdit = (props: TGridEdit) => {
  const { onClick, disabled } = props
  const { t } = useTranslation()

  return (
    <Tooltip title={t('Edit')}>
      <IconButton sx={{zIndex:10000}} onClick={onClick} disabled={disabled}>
        <IconifyIcon icon='tabler:edit' />
      </IconButton>
    </Tooltip>
  )
}

export default GridEdit
