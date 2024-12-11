import { yupResolver } from '@hookform/resolvers/yup'
import { Icon } from '@iconify/react/dist/iconify.js'
import { FormControlLabel, InputAdornment, Switch } from '@mui/material'
import {
  Avatar,
  Box,
  Button,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import CustomModal from 'src/components/custom-modal'
import CustomSelect from 'src/components/custom-select'
import IconifyIcon from 'src/components/Icon'
import Spinner from 'src/components/spinner'
import CustomTextField from 'src/components/text-field'
import WrapperFileUpload from 'src/components/wrapper-file-upload'
import { EMAIL_REG, PASSWORD_REG } from 'src/configs/regex'
import { getAllRoles } from 'src/services/role'
import { getDetailsUser } from 'src/services/user'
import { getAllCities } from 'src/services/city'
import { AppDispatch, RootState } from 'src/stores'
import { createUserAsync, updateUserAsync } from 'src/stores/user/actions'
import { convertBase64, separationFullName, toFullName } from 'src/utils'
import * as yup from 'yup'

interface TCreateEditUser {
  open: boolean
  onClose: () => void
  idUser?: string
}

type TDefaultValue = {
  fullName: string
  email: string
  password?: string
  role: string
  phoneNumber: string
  address?: string
  city?: string
  status?: number
}

const CreateEditUser = (props: TCreateEditUser) => {
  const { open, onClose, idUser } = props
  const { t, i18n } = useTranslation()
  const theme = useTheme()

  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState('')
  const [optionRoles, setOptionRoles] = useState<{ label: string; value: string }[]>([])
  const [showPassword, setShowPassword] = useState(false)
  const [optionCities, setOptionCities] = useState<{ label: string; value: string }[]>([])

  const dispatch: AppDispatch = useDispatch()

  const schema = yup.object().shape({
    email: yup.string().required(t('required_field')).matches(EMAIL_REG, 'The field is must email type'),
    password: idUser? yup.string().nonNullable() :yup.string().required(t('required_field')).matches(PASSWORD_REG, t('Rules_password')),
    fullName: yup.string().required(t('required_field')),
    phoneNumber: yup.string().required(t('required_field')).min(8, 'The phone number is min 8 number'),
    address: yup.string().nonNullable(),
    city: yup.string().nonNullable(),
    role: yup.string().required(t('required_field')),
    // avatar:yup.string().required(t('required_field')),
    status: yup.number().nonNullable()
  })

  const defaultValues: TDefaultValue = {
    // firstName:"",
    // lastName:"",
    // middleName:"",
    fullName: '',
    email: '',
    password: '',
    role: '',
    phoneNumber: '',
    address: '',
    city: '',
    status: 1
  }

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })
  console.log('error2', { errors })

  //handle
  const onSubmit = (data: TDefaultValue) => {
    if (!Object.keys(errors).length) {
      const { firstName, middleName, lastName } = separationFullName(data?.fullName, i18n.language)
      console.log('dataaaa', data)
      if (idUser) {
        //update ROle
        dispatch(updateUserAsync({
          id:idUser,
          firstName,
          middleName,
          lastName,
          email: data?.email,
          role: data?.role,
          phoneNumber: data?.phoneNumber,
          address: data?.address,
          city: data?.city,
          avatar: avatar,
          status: data?.status
        }))
      } else {
        dispatch(
          createUserAsync({
            firstName,
            middleName,
            lastName,
            email: data?.email,
            password: data?.password ? data?.password :"",
            role: data?.role,
            phoneNumber: data?.phoneNumber,
            address: data?.address,
            city: data?.city,
            avatar: avatar
          })
        )
      }
    }
  }

  const handleUploadAvatar = async (file: File) => {
    const base64 = await convertBase64(file)
    console.log('base64', base64)
    setAvatar(base64 as string)
  }

  const fetchAllRole = async () => {
    setLoading(true)
    await getAllRoles({ params: { limit: -1, page: -1 } })
      .then(res => {
        const data = res?.data?.roles
        if (data) {
          setOptionRoles(
            data?.map((item: { name: string; _id: string }) => {
              return {
                label: item?.name,
                value: item?._id
              }
            })
          )
        }
        setLoading(false)
      })
      .catch(e => {
        setLoading(false)
      })
  }

  //fetchApi
  const fetchDetailsUser = async (id: string) => {
    setLoading(true)
    await getDetailsUser(id)
      .then(res => {
        const data = res.data
        console.log("babe", data)
        if (data) {
          reset({
            fullName: toFullName(data?.lastName, data?.middleName, data?.firstName, i18n?.language),
            email: data?.email,
            password: data?.password,
            role: data?.role?._id,
            phoneNumber: data?.phoneNumber,
            address: data?.address,
            city: data?.city,
            status:data?.status,
          })
          setAvatar(data?.avatar)
        }
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
      })
  }

  const fetchAllCities = async () => {
    setLoading(true)
    await getAllCities({ params: { limit: -1, page: -1 } })
      .then(res => {
        const data = res?.data.cities
        if (data) {
          setOptionCities(data?.map((item: { name: string; _id: string }) => ({ label: item.name, value: item._id })))
        }
        setLoading(false)
      })
      .catch(e => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchAllRole()
    fetchAllCities()
  }, [])

  useEffect(() => {
    if (!open) {
      reset({
        ...defaultValues
      })
      setAvatar("")
      setShowPassword(false)
    } else if (idUser) {
      fetchDetailsUser(idUser)
    }
  }, [open, idUser])

  return (
    <>
      {loading && <Spinner />}

      <CustomModal open={open} onClose={onClose}>
        <Box
          sx={{ backgroundColor: theme.palette.customColors.bodyBg, padding: '20px', borderRadius: '15px' }}
          minWidth={{ md: '800px', xs: '80vw' }}
          maxWidth={{ md: '80vw', xs: '80vw' }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              paddingBottom: '10px'
            }}
          >
            <Typography variant='h4' sx={{ fontWeight: 600 }}>
              {idUser ? t('Edit_user') : t('Create_user')}
            </Typography>
            <IconButton sx={{ position: 'absolute', right: '-10px' }} onClick={onClose}>
              <IconifyIcon icon='iwwa:delete' />
            </IconButton>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' noValidate>
            <Box
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: '15px',
                py: 5,
                px: 4
              }}
            >
              <Grid container spacing={5}>
                <Grid container item md={6} xs={12}>
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
                              'image/jpeg': ['.jpg'],
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
                            <div>
                              <label
                                style={{
                                  fontSize: '13px',
                                  marginBottom: '4px',
                                  display: 'block',
                                  color: errors?.role
                                    ? theme.palette.error.main
                                    : `rgba(${theme.palette.customColors.main}, 0.42)`
                                }}
                              >
                                {t('Role')} <span style={{     color: errors?.role
                                    ? theme.palette.error.main
                                    : `rgba(${theme.palette.customColors.main}, 0.42)`}}>*</span>
                              </label>
                              <CustomSelect
                                fullWidth
                                onChange={onChange}
                                options={optionRoles}
                                error={Boolean(errors?.role)}
                                onBlur={onBlur}
                                value={value}
                                placeholder={t('enter_your_role')}
                              />

                              {errors?.role?.message && (
                                <FormHelperText
                                  sx={{
                                    color: errors?.role
                                      ? theme.palette.error.main
                                      : `rgba(${theme.palette.customColors.main}, 0.42)`
                                  }}
                                >
                                  {errors?.role?.message}
                                </FormHelperText>
                              )}
                            </div>
                          )}
                          name='role'
                        />
                      </Grid>

                      {!idUser && <Grid item md={6} xs={12}>
                        <Controller
                          control={control}
                          rules={{
                            required: true
                          }}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextField
                              required
                              fullWidth
                              label={t('Password')}
                              onChange={onChange}
                              onBlur={onBlur}
                              value={value}
                              placeholder={t('Enter_password')}
                              error={Boolean(errors?.password)}
                              helperText={errors?.password?.message}
                              type={showPassword ? 'text' : 'password'}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position='end'>
                                    <IconButton edge='end' onClick={() => setShowPassword(!showPassword)}>
                                      {showPassword ? (
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
                          name='password'
                        />
                      </Grid>}

                      {idUser && (
                        <Grid item md={6} xs={12}>
                          <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => {
                              console.log('value', value)

                              return (
                                <FormControlLabel
                                  control={
                                    <Switch
                                      value={value}
                                      checked={Boolean(value)}
                                      onChange={e => {
                                        onChange(e.target.checked ? 1 : 0)
                                      }}
                                    />
                                  }
                                  label={Boolean(value) ? t('Active') : t('Block')}
                                />
                              )
                            }}
                            name='status'
                          />
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                </Grid>

                <Grid container item md={6} xs={12}>
                  <Box>
                    <Grid container spacing={4}>
                      <Grid item md={6} xs={12}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextField
                            required
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
                            <Box>
                              <InputLabel
                                sx={{
                                  fontSize: '13px',
                                  marginBottom: '4px',
                                  display: 'block',
                                  color: errors?.role
                                    ? theme.palette.error.main
                                    : `rgba(${theme.palette.customColors.main}, 0.42)`
                                }}
                              >
                                {t('City')}
                              </InputLabel>
                              <CustomSelect
                                fullWidth
                                onChange={onChange}
                                options={optionCities}
                                error={Boolean(errors?.role)}
                                onBlur={onBlur}
                                value={value}
                                placeholder={t('enter_your_city')}
                              />
                              {errors?.city?.message && (
                                <FormHelperText
                                  sx={{
                                    color: errors?.city
                                      ? theme.palette.error.main
                                      : `rgba(${theme.palette.customColors.main}, 0.42)`
                                  }}
                                >
                                  {errors?.city?.message}
                                </FormHelperText>
                              )}
                            </Box>
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
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2 }}>
                {idUser ? t('Edit') : t('Create')}
              </Button>
            </Box>
          </form>
        </Box>
      </CustomModal>
    </>
  )
}

export default CreateEditUser
