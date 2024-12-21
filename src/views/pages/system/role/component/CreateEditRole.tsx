import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, IconButton, Tooltip, Typography, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { PERMISSIONS } from 'src/configs/permission'
import CustomModal from 'src/components/custom-modal'
import IconifyIcon from 'src/components/Icon'
import Spinner from 'src/components/spinner'
import CustomTextField from 'src/components/text-field'
import { getDetailsRole } from 'src/services/role'
import { AppDispatch, RootState } from 'src/stores'
import { createRoleAsync, updateRoleAsync } from 'src/stores/role/actions'
import * as yup from 'yup'

interface TCreateEditRole {
  open: boolean
  onClose: () => void
  idRole?: string
}

type TDefaultValue = {
  name: string
}

const CreateEditRole = (props: TCreateEditRole) => {
  const { open, onClose, idRole } = props
  const { t } = useTranslation()
  const theme = useTheme()

  const [loading, setLoading] = useState(false)

  const dispatch: AppDispatch = useDispatch()

  const schema = yup.object().shape({
    name: yup.string().required(t('required_field'))
  })

  const defaultValues: TDefaultValue = {
    name: ''
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
  console.log('error', { errors })

  const onSubmit = (data: { name: string }) => {
    if (!Object.keys(errors).length) {
      if (idRole) {
        //update ROle
        dispatch(updateRoleAsync({ name: data?.name, id: idRole }))
      } else {
        dispatch(createRoleAsync({ name: data?.name, permissions: [PERMISSIONS.DASHBOARD] }))
      }
    }
  }

  //fetchApi
  const fetchDetailsRole = async (id: string) => {
    setLoading(true)
    await getDetailsRole(id)
      .then(res => {
        const data = res.data
        if (data) {
          reset({
            name: data?.name
          })
        }
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (!open) {
      reset({
        name: ''
      })
    } else if (idRole) {
      fetchDetailsRole(idRole)
    }
  }, [open, idRole])

  return (
    <>
      {loading && <Spinner />}

      <CustomModal open={open} onClose={onClose}>
        <Box
          sx={{ backgroundColor: theme.palette.customColors.bodyBg, padding: '20px', borderRadius: '15px' }}
          minWidth={{ md: '500px', xs: '80vw' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' ,paddingBottom:"10px"}}>
            <Typography variant='h4' sx={{ fontWeight: 600 }}>
              {idRole ? t('Chỉnh sửa nhóm vai trò') : t('Tạo nhóm vai trò')}
            </Typography>
            <IconButton sx={{ position: 'absolute', right: '-10px' }} onClick={onClose}>
              <IconifyIcon icon='iwwa:delete' />
            </IconButton>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' noValidate>
            <Box sx={
              {
                width:"100%",
                padding:"30px 20px",
                backgroundColor: theme.palette.background.paper,
                borderRadius:"15px"
              }
            }>
              <Controller
                control={control}
                rules={{
                  required: true
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomTextField
                    required
                    label={t('Name_role')}
                    fullWidth
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={Boolean(errors?.name)}
                    placeholder={t('enter_name')}
                    helperText={errors?.name?.message}
                  />
                )}
                name='name'
              />
              {/* {errors.email && <Typography>{errors?.email?.message}</Typography>} */}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2 }}>
                {idRole ? t('Edit') : t('Create')}
              </Button>
            </Box>
          </form>
        </Box>
      </CustomModal>
    </>
  )
}

export default CreateEditRole
