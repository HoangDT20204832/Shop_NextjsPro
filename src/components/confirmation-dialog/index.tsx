import React, { useEffect, useState } from 'react'
import { styled, alpha, useTheme } from '@mui/material/styles'

import InputBase from '@mui/material/InputBase'
import { useTranslation } from 'react-i18next'
import IconifyIcon from '../Icon'
import { useDebounce } from 'src/hooks/useDebounce'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography
} from '@mui/material'

interface TConfirmationDialog {
  open: boolean
  handleClose: () => void
  handleCancle: () => void
  handleConfirm: () => void
  title: string
  description: string
}
const CustomDialogContent = styled(DialogContent)(() => ({
  padding: '10px 20px'
}))

const StyledDialog = styled(Dialog)(() => ({
  '.MuiPaper-root.MuiPaper-elevation': {
    width: '500px'
  }
}))

const ConfirmationDialog = (props: TConfirmationDialog) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const { open, handleClose, handleCancle, handleConfirm, title, description } = props

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
        <IconifyIcon icon='ep:warning' fontSize={80} color={theme.palette.warning.main} />
      </Box>
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Typography variant='h4' sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </DialogTitle>
      <CustomDialogContent>
        <DialogContentText sx={{ textAlign: 'center', marginBottom: '20px' }} id='alert-dialog-description'>
          {description}
        </DialogContentText>
      </CustomDialogContent>
      <DialogActions>
        <Button variant='contained' onClick={handleConfirm}>
          {t('confirm')}
        </Button>
        <Button variant='outlined' color='error' onClick={handleCancle} autoFocus>
          {t('cancel')}
        </Button>
      </DialogActions>
    </StyledDialog>
  )
}

export default ConfirmationDialog
