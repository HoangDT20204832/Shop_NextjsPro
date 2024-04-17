// ** Next
import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'

// ** React
import { useEffect, useState } from 'react'

// ** Mui
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Typography,
  useTheme
} from '@mui/material'

// ** Components
import CustomTextField from 'src/components/text-field'
import Icon from 'src/components/Icon'

// ** form
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Config
import { EMAIL_REG, PASSWORD_REG } from 'src/configs/regex'

// ** Images
import RegisterDark from '/public/images/register-dark.png'
import RegisterLight from '/public/images/register-light.png'
import { useDispatch, useSelector } from 'react-redux'
import { changePasswordMeAsync, registerAuthAsync } from 'src/stores/auth/actions'
import { AppDispatch, RootState } from 'src/stores'
import toast from 'react-hot-toast'
import FallbackSpinner from 'src/components/fall-back'
import { resetInitialState } from 'src/stores/auth'
import { useRouter } from 'next/router'
import { ROUTE_CONFIG } from 'src/configs/route'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'src/hooks/useAuth'

type TProps = {}

type TDefaultValue = {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

const ChangePasswordPage: NextPage<TProps> = () => {
  // State
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)

  // ** Router
  const router = useRouter()

  // ** Auth
  const { logout } = useAuth()

  // ** Redux
  const dispatch: AppDispatch = useDispatch() //dùng để đưa actions vào reducer xử lý
  const { isSuccessChangePassword, isLoading, isErrorChangePassword, messageChangePassword } = useSelector(
    (state: RootState) => state.auth
  ) // dùng useSelector để lấy ra các state trong store

  // ** theme
  const theme = useTheme()

  // ** Translate
  const { t } = useTranslation()

  const schema = yup.object().shape({
    currentPassword: yup
      .string()
      .required(t('required_field'))
      .matches(PASSWORD_REG, t("Rules_password")),
    newPassword: yup
      .string()
      .required(t('required_field'))
      .matches(PASSWORD_REG, t("Rules_password")),
    confirmNewPassword: yup
      .string()
      .required(t('required_field'))
      .matches(PASSWORD_REG, t("Rules_password"))
      .oneOf([yup.ref('newPassword'), ''], t("rules_confirm_new_password"))
  })

  const defaultValues: TDefaultValue = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  }

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })
  console.log('errors', { errors })

  const onSubmit = (data: { currentPassword: string; newPassword: string }) => {
    // console.log('data', { data, errors })
    if (!Object.keys(errors).length) {
      dispatch(changePasswordMeAsync({ currentPassword: data.currentPassword, newPassword: data.newPassword }))
    }
  }

  useEffect(() => {
    if (messageChangePassword) {
      // tất cả thằng dưới pahri có message thì mưới hiện thông báo toast(tranh việc mưới vào trang reggister đã hiện toast)
      if (isErrorChangePassword) {
        toast.error(messageChangePassword)
      } else if (isSuccessChangePassword) {
        toast.success(messageChangePassword)
        router.push(ROUTE_CONFIG.LOGIN)
        setTimeout(() => {
          logout()
        }, 500)
      }

      //khi ấn đky xong thì phải reset lại state để nếu ấn liên tục đky mà ko thành công sẽ hiện toast thông báo lỗi liên tục cho họ thấy
      dispatch(resetInitialState())
    }
  }, [isErrorChangePassword, isSuccessChangePassword, messageChangePassword])

  return (
    <>
      {isLoading && <FallbackSpinner />}
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          display: 'flex',
          alignItems: 'center',
          padding: '40px'
        }}
      >
        <Box
          display={{
            xs: 'none',
            sm: 'flex'
          }}
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '20px',
            backgroundColor: theme.palette.customColors.bodyBg,
            height: '100%',
            minWidth: '50vw'
          }}
        >
          <Image
            src={theme.palette.mode === 'light' ? RegisterLight : RegisterDark}
            alt='login image'
            style={{
              height: 'auto',
              width: 'auto'
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Typography component='h1' variant='h5'>
              {t('Change_password')}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' noValidate>
              <Box sx={{ mt: 2 }} width={{ md: '300px', xs: '290px' }}>
                <Controller
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      required
                      fullWidth
                      autoFocus
                      label={t('Current_password')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder={t('Enter_current_password')}
                      error={Boolean(errors?.currentPassword)}
                      helperText={errors?.currentPassword?.message}
                      type={showCurrentPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton edge='end' onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                              {showCurrentPassword ? (
                                <Icon icon='material-symbols:visibility-outline' />
                              ) : (
                                <Icon icon='ic:outline-visibility-off' />
                              )}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                  name='currentPassword'
                />
              </Box>

              <Box sx={{ mt: 2 }} width={{ md: '300px', xs: '290px' }}>
                <Controller
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      required
                      fullWidth
                      autoFocus
                      label={t('New_password')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder={t('Enter_new_password')}
                      error={Boolean(errors?.newPassword)}
                      helperText={errors?.newPassword?.message}
                      type={showNewPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton edge='end' onClick={() => setShowNewPassword(!showNewPassword)}>
                              {showNewPassword ? (
                                <Icon icon='material-symbols:visibility-outline' />
                              ) : (
                                <Icon icon='ic:outline-visibility-off' />
                              )}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                  name='newPassword'
                />
              </Box>

              <Box sx={{ mt: 2 }} width={{ md: '300px', xs: '290px' }}>
                <Controller
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      required
                      fullWidth
                      autoFocus
                      label={t('Confirm_new_password')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder={t('Enter_confirm_new_password')}
                      error={Boolean(errors?.confirmNewPassword)}
                      helperText={errors?.confirmNewPassword?.message}
                      type={showConfirmNewPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton edge='end' onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
                              {showConfirmNewPassword ? (
                                <Icon icon='material-symbols:visibility-outline' />
                              ) : (
                                <Icon icon='ic:outline-visibility-off' />
                              )}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                  name='confirmNewPassword'
                />
              </Box>

              <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
                {t('Change')}
              </Button>
            </form>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default ChangePasswordPage
