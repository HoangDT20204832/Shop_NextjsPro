// ** Next
import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'

// ** React
import { useEffect, useState, useTransition } from 'react'

// ** Mui
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  Grid,
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
import IconifyIcon from 'src/components/Icon'
import { useTranslation } from 'react-i18next'
import WrapperFileUpload from 'src/components/wrapper-file-upload'
import { useAuth } from 'src/hooks/useAuth'
import { getAuthMe } from 'src/services/auth'
import { UserDataType } from 'src/contexts/types'
import { convertBase64, separationFullName, toFullName } from 'src/utils'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import toast from 'react-hot-toast'
import { resetInitialState } from 'src/stores/apps/auth'
import { ROUTE_CONFIG } from 'src/configs/route'
import { updateAuthMeAsync } from 'src/stores/apps/auth/actions'
import FallbackSpinner from 'src/components/fall-back'
import Spinner from 'src/components/spinner'

type TProps = {}

type TDefaultValue = {
  email: string
  address: string
  fullName: string
  city: string
  phoneNumber: string
  role: string
}

const MyProfilePage: NextPage<TProps> = () => {
  // State
  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState('')
  const [roleId, setRoleId] = useState('')

  // const [user, setUser] = useState<UserDataType | null>(null);

  // ** translate
  const { i18n } = useTranslation()
  const { t } = useTranslation()

  // ** theme
  const theme = useTheme()

  // ** redux
  const dispatch: AppDispatch = useDispatch()
  const {isErrorUpdateMe, isLoading, isSuccessUpdateMe, messageUpdateMe} = useSelector((state:RootState) => state.auth)

  const schema = yup.object().shape({
    email: yup.string().required('The field is required').matches(EMAIL_REG, 'The field is must email type'),
    fullName: yup.string().notRequired(),
    city: yup.string().notRequired(),
    phoneNumber: yup.string().required('The field is required').min(8, 'The phone number is min 8 number'),
    address: yup.string().notRequired(),
    role: yup.string().required('The field is required')
  })

  const defaultValues: TDefaultValue = {
    email: '',
    address: '',
    fullName: '',
    city: '',
    phoneNumber: '',
    role: ''
  }

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const fetchGetAuthMe = async () => {
    setLoading(true)
    await getAuthMe()
      .then(async response => {
        console.log('response: ', response)
        setLoading(false)
        const data = response?.data
        if (data) {
          setRoleId(data?.roleId?._id)
          setAvatar(data?.avatar)
          reset({
            email: data?.email,
            address: data?.address,
            city: data?.city,
            phoneNumber: data?.phoneNumber,
            role: data?.role?.name,
            fullName: toFullName(data?.lastName, data?.middleName, data?.firstName, i18n?.language)
          })
        }
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchGetAuthMe()
  }, [i18n?.language])

  useEffect(()=>{
    if(messageUpdateMe){  // tất cả thằng dưới pahri có message thì mưới hiện thông báo toast(tranh việc mưới vào trang reggister đã hiện toast)
      if(isErrorUpdateMe){
        toast.error(messageUpdateMe)
      }else if(isSuccessUpdateMe){
        toast.success(messageUpdateMe)
        fetchGetAuthMe()
      }

      //khi ấn đky xong thì phải reset lại state để nếu ấn liên tục đky mà ko thành công sẽ hiện toast thông báo lỗi liên tục cho họ thấy
      dispatch(resetInitialState())
    }
  
  },[isErrorUpdateMe,isSuccessUpdateMe, messageUpdateMe])


  // console.log('errors', { errors })
  const onSubmit = (data: any) => {
    console.log('data', { data, errors })
    const {firstName, middleName, lastName} = separationFullName(data?.fullName,i18n.language )
    dispatch(updateAuthMeAsync({
      email: data.email,
      role: roleId,
      phoneNumber: data.phoneNumber,
      firstName:firstName,
      middleName:middleName,
      lastName:lastName,
      address: data.address,
      avatar: avatar,

      // city: data.city,
    }))
  }

  const handleUploadAvatar = async (file: File) => {
    const base64 = await convertBase64(file)
    console.log('base64', base64)
    setAvatar(base64 as string)
  }


  return (
    <>
    {loading || isLoading && <Spinner/>}
    <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' noValidate>
      <Grid container>
        <Grid
          container
          item
          md={6}
          xs={12}
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: '15px',
            py: 5,
            px: 4
          }}
        >
          <Box sx={{ height: '100%', width: '100%' }}>
            <Grid container spacing={4}>
              <Grid item md={12} xs={12}>
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    justifyContent: 'center',
                    alignItems: 'center'

                    // position: 'relative'
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative'
                    }}
                  >
                    {avatar ? (
                      <IconButton
                        edge='start'
                        sx={{
                          position: 'absolute',
                          bottom: -6,
                          right: -6,
                          zIndex: 2,
                          color: theme.palette.primary.main
                        }}
                        onClick={() => setAvatar('')}
                      >
                        <IconifyIcon icon='material-symbols-light:delete-outline'></IconifyIcon>
                      </IconButton>
                    ) : (
                      <></>
                    )}

                    {avatar ? (
                      <Avatar src={avatar} sx={{ width: 100, height: 100 }}></Avatar>
                    ) : (
                      <Avatar sx={{ width: 100, height: 100 }}>
                        <IconifyIcon icon='ph:user-thin' fontSize={50} />
                      </Avatar>
                    )}
                  </Box>

                  <WrapperFileUpload
                    uploadFunc={handleUploadAvatar}
                    objectAcceptFile={{
                      'image/jpeg': ['.jpg', 'jpeg'],
                      'image/png': ['.png']
                    }}
                  >
                    <Button
                      variant='outlined'
                      sx={{ width: 'auto', display: 'flex', justifyContent: 'center', gap: 2 }}
                    >
                      <IconifyIcon icon='ph:camera-thin' />
                      {avatar ? t('change_avatar') : t('upload_avatar')}
                    </Button>
                  </WrapperFileUpload>
                </Box>
              </Grid>
              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      required
                      disabled
                      autoFocus
                      fullWidth
                      label={t('Email')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder={t('enter_your_email')}
                      error={Boolean(errors?.email)}
                      helperText={errors?.email?.message}
                    />
                  )}
                  name='email'
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      required
                      autoFocus
                      fullWidth
                      disabled
                      label={t('Role')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder={t('enter_your_role')}
                      error={Boolean(errors?.role)}
                      helperText={errors?.role?.message}
                    />
                  )}
                  name='role'
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid container item md={6} xs={12} mt={{ md: 0, xs: 5 }}>
          <Box
            sx={{
              height: '100%',
              width: '100%',
              backgroundColor: theme.palette.background.paper,
              borderRadius: '15px',
              py: 5,
              px: 4
            }}
            marginLeft={{ md: 5, xs: 0 }}
          >
            <Grid container spacing={4}>
              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      autoFocus
                      fullWidth
                      label={t('Full_name')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder={t('enter_your_full_name')}
                      error={Boolean(errors?.fullName)}
                      helperText={errors?.fullName?.message}
                    />
                  )}
                  name='fullName'
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      autoFocus
                      fullWidth
                      label={t('Address')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder={t('enter_your_address')}
                      error={Boolean(errors?.address)}
                      helperText={errors?.address?.message}
                    />
                  )}
                  name='address'
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      autoFocus
                      fullWidth
                      label={t('City')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder={t('enter_your_city')}
                      error={Boolean(errors?.city)}
                      helperText={errors?.city?.message}
                    />
                  )}
                  name='city'
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      required
                      autoFocus
                      fullWidth
                      label={t('Phone_number')}
                      onChange={e => {
                        const numValue = e.target.value.replace(/\D/g, '')
                        onChange(numValue)
                      }}
                      inputProps={{
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                        minLength: 8
                      }}
                      onBlur={onBlur}
                      value={value}
                      placeholder={t('enter_your_phone')}
                      error={Boolean(errors?.phoneNumber)}
                      helperText={errors?.phoneNumber?.message}
                    />
                  )}
                  name='phoneNumber'
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2 }}>
          {t('Update')}
        </Button>
      </Box>
    </form></>
  )
}

export default MyProfilePage
