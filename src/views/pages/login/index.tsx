// ** Next
import { NextPage } from 'next'
import Link from 'next/link'

//** Mui
import {
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Typography,
  useTheme
} from '@mui/material'

import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

//** Components
import CustomTextField from 'src/components/text-field'
import { EMAIL_REG, PASSWORD_REG } from 'src/configs/regex'
import { useEffect, useState } from 'react'
import Icon from 'src/components/Icon'
import Image from 'next/image'

//** IMAGE */
import LoginDark from '/public/images/login-dark.png'
import LoginLight from '/public/images/login-light.png'

//** Hooks */
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import { signIn, useSession } from 'next-auth/react'
import { clearLocalPreTokenAuthSocial, getLocalPreTokenAuthSocial, getLocalRememberLoginAuthSocial, setLocalPreTokenAuthSocial, setLocalRememberLoginAuthSocial } from 'src/helpers/storage'
import FallbackSpinner from 'src/components/fall-back'
// import { useTheme } from '@emotion/react'
import { ROUTE_CONFIG } from 'src/configs/route'

type TProps = {}

//sử dụng yup để kiểm tra đảm bảo rằng dữ liệu được nhập vào là hợp lệ trước khi được gửi đi hoặc xử lý

const LoginPage: NextPage<TProps> = () => {
  //State
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isRemember, setIsRemember] = useState<boolean>(true)
  const prevTokenLocal = getLocalPreTokenAuthSocial() // prevTokenLocal là accessToken do google cung cấp(trả về) khi client ấn signIn
  // ** Language
  const { t } = useTranslation()

  //Theme
  const theme = useTheme()

  // console.log('thembfskje', theme)

  const { login ,loginGoogle, loginFacebook} = useAuth() //lấy login: handleLogin từ AuthContext thoogn qua hàm useAuth ở folder hooks

  const { data: session } = useSession()
  console.log("session", {session, status})

  const schema = yup.object().shape({
    email: yup.string().required(t("required_field")).matches(EMAIL_REG, t("Rules_email")),
    password: yup.string().required(t("required_field")).matches(PASSWORD_REG, t("Rules_password"))
  })

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })
  console.log('error', { errors })

  const onSubmit = (data: { email: string; password: string }) => {
    if (!Object.keys(errors).length) {
      // nếu ko có lỗi thì mưới thực hiện login
      login({ ...data, rememberMe: isRemember }, err => {
        console.log('errpr', err)
        if (err?.response?.data?.typeError === 'INVALID') {
          toast.error(t('the_email_or_password_is_wrong'))
        }
      })
    }
  }

  const handleLoginGoogle = () => {
    signIn("google")    // khi gọi hàm này thì client sẽ signIn lên google và google sẽ trả về thông tin user như
                         // name, avatar,....., accesstoken 
    clearLocalPreTokenAuthSocial()  // xoá accessTokenGoogle của google or facebook cấp cho ở trên localTrogate
    // để khi ấn đăng nhập bằng  google thì (session as any)?.accessToken thay đổi =>  re-render lại componet
     //=> gán lại  cho  prevTokenLocal =0 
     // rồi chạy đến hàm usffect (session as any)?.accessToken !== prevTokenLocal(đúng do prevTokenLocal=0)
     //=> nó sẽ thực hiên luôn chức năng login
     //()
  }
  const handleLoginFacebook = () => {
    signIn("facebook")
    clearLocalPreTokenAuthSocial()
  }

  useEffect(() => {
    if ((session as any)?.accessToken && (session as any)?.accessToken !== prevTokenLocal) {
      const rememberLocal = getLocalRememberLoginAuthSocial()
      if ((session as any)?.provider === "facebook") {
        loginFacebook({ idToken: (session as any)?.accessToken, rememberMe: rememberLocal ? rememberLocal === "true" : true }, err => {
          if (err?.response?.data?.typeError === 'INVALID') toast.error(t('The_email_or_password_wrong'))
        })
      } else {
        loginGoogle({ idToken: (session as any)?.accessToken, rememberMe: rememberLocal ? rememberLocal === "true" : true }, err => {
          if (err?.response?.data?.typeError === 'INVALID') toast.error(t('The_email_or_password_wrong'))
        })
      }
      setLocalPreTokenAuthSocial((session as any)?.accessToken)
    }
  }, [(session as any)?.accessToken])

  return (
    <>
        {status === "loading" && <FallbackSpinner />}
        <Box
      sx={{
        height: '100vh',
        width: '100vw',
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        alignItems: 'center',
        padding: '40px'
      }}
    >
      <Box
        display={{
          md: 'flex', //màn hình kcihs thước >=600px thì sẽ hiện thị ảnh
          xs: 'none' //màn hình kcihs thước <600px thì sẽ ko hiện thị ảnh(kích thước 'xs')
        }}
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '20px',
          backgroundColor: theme.palette.customColors.bodyBg,
          height: '100%',
          minWidth: '50%'
        }}
      >
        <Image
          src={theme.palette.mode === 'light' ? LoginLight : LoginDark}
          alt='login image'
          style={{ height: 'auto', width: 'auto' }}
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
            {t("Login")}
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
                    label= {t("Email")}
                    fullWidth
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={Boolean(errors?.email)}
                    placeholder={t("Enter_email")}
                    helperText={errors?.email?.message}
                  />
                )}
                name='email'
              />
              {/* {errors.email && <Typography>{errors?.email?.message}</Typography>} */}
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
                    label={t('Password')}
                    fullWidth
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={Boolean(errors?.password)}
                    placeholder={t("Enter_password")}
                    helperText={errors?.password?.message}
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton edge='end' onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? (
                              <Icon icon='material-symbols:visibility-outline' />
                            ) : (
                              <Icon icon='material-symbols:visibility-off-outline' />
                            )}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
                name='password'
              />
              {/* {errors.password && <Typography>{errors?.password?.message}</Typography>} */}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    value='remember'
                    color='primary'
                    checked={isRemember}
                    onChange={e => {
                      setIsRemember(e.target.checked)
                      setLocalRememberLoginAuthSocial(JSON.stringify(e.target.checked))
                    }}
                  />
                }
                label= {t('Remember_me')}
              />
              <Typography variant='body2' component={Link} href={`${ROUTE_CONFIG.FORGOT_PASSWORD}`}
              >{t("Forgot_password")}?</Typography>
            </Box>
            <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
               {t("Login")}
            </Button>

            <Grid container>
              <Grid item xs>
                {t("You_have_account")}?
              </Grid>
              <Grid item>
                <Link
                  href={`${ROUTE_CONFIG.REGISTER}`}
                  style={{
                    color: theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.common.white
                  }}
                >
                  {t('Register')}
                </Link>
              </Grid>
            </Grid>
            <Typography sx={{ textAlign: 'center', mt: 2, mb: 2 }}>Or</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <IconButton sx={{ color: '#497ce2' }}
                onClick={handleLoginFacebook}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  role='img'
                  fontSize='1.375rem'
                  className='iconify iconify--mdi'
                  width='1em'
                  height='1em'
                  viewBox='0 0 24 24'
                >
                  <path
                    fill='currentColor'
                    d='M12 2.04c-5.5 0-10 4.49-10 10.02c0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89c1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02Z'
                  ></path>
                </svg>
              </IconButton>
              <IconButton sx={{ color: theme.palette.error.main }}
              onClick={handleLoginGoogle}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  role='img'
                  fontSize='1.375rem'
                  className='iconify iconify--mdi'
                  width='1em'
                  height='1em'
                  viewBox='0 0 24 24'
                >
                  <path
                    fill='currentColor'
                    d='M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z'
                  ></path>
                </svg>
              </IconButton>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
    </>

  )
}

export default LoginPage
