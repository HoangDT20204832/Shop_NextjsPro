// ** Next
import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'

// ** React
import { useEffect, useMemo, useState } from 'react'

// ** Mui
import {
  Box,
  Button,
  Checkbox,
  Chip,
  ChipProps,
  CssBaseline,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Tooltip,
  Typography,
  styled,
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
import { resetInitialState } from 'src/stores/user'
import { useRouter } from 'next/router'
import { ROUTE_CONFIG } from 'src/configs/route'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'src/hooks/useAuth'
import CustomDataGrid from 'src/components/custom-data-grid'
import {
  GridColDef,
  GridRowClassNameParams,
  GridRowSelectionModel,
  GridSortModel,
  GridValueGetterParams
} from '@mui/x-data-grid'
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import CustomPagination from 'src/components/custom-pagination'
import IconifyIcon from 'src/components/Icon'
import GridEdit from 'src/components/grid-edit'
import GridDelete from 'src/components/grid-delete'
import GridCreate from 'src/components/grid-create'
import InputSearch from 'src/components/input-search'
import CreateEditRole from './component/CreateEditUser'
import Spinner from 'src/components/spinner'
import ConfirmationDialog from 'src/components/confirmation-dialog'
import { deleteRole, getAllRoles, getDetailsRole } from 'src/services/role'
import { OBJECT_TYPE_ERROR_ROLE } from 'src/configs/role'
import { PERMISSIONS } from 'src/configs/permission'
import { getAllValueOfObject, toFullName } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

// ** Hooks
import { usePermission } from 'src/hooks/usePermission'
import { deleteMultipleUserAsync, deleteUserAsync, getAllUsersAsync } from 'src/stores/user/actions'
import { getDetailsUser } from 'src/services/user'
import CreateEditUser from './component/CreateEditUser'
import TableHeader from 'src/components/table-header'
import CustomSelect from 'src/components/custom-select'
import { OBJECT_STATUS_USER } from 'src/configs/user'

type TProps = {}

type TDefaultValue = {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

type TSelectedRow = { id: string; role: { name: string; permissions: string[] } }

const ActiveUserStyled = styled(Chip)<ChipProps>(({ theme }) => ({
  backgroundColor: '#28c76f29',
  color: '#3a843f',
  fontSize: '14px',
  padding: '8px 4px',
  fontWeight: 400
}))

const DeactivateUserStyled = styled(Chip)<ChipProps>(({ theme }) => ({
  backgroundColor: '#da251d29',
  color: '#da251d',
  fontSize: '14px',
  padding: '8px 4px',
  fontWeight: 400
}))

const UserListPage: NextPage<TProps> = () => {
  // ** Translate
  const { t, i18n } = useTranslation()

  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  // truyền thêm id vào để phân biệt nếu id ko phải chuỗi rỗng thì nghĩa là mở Modal Edit, ngược lại thì là mở Modal Create
  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    id: ''
  })

  const [openDeleteUser, setOpenDeleteUser] = useState({
    open: false,
    id: ''
  })
  const [openDeleteMultipleUser, setOpenDeleteMultipleUser] = useState(false)

  const [sortBy, setSortBy] = useState('createdAt desc')
  const [searchBy, setSearchBy] = useState('')
  const [permissonSelected, setPermissonSelected] = useState<string[]>([])
  const [selectedRow, setSelectedRow] = useState<TSelectedRow[]>([])
  const [isDisablePermisson, setIsDisablePermisson] = useState(false)
  const tableActions = [{ label: t('Xoá'), value: 'delete' }]
  const [optionRoles, setOptionRoles] = useState<{ label: string; value: string }[]>([])
  const [roleSelected, setRoleSelected] = useState('')
  const [filterBy, setFilterBy] = useState<Record<string, string>>({})
  const [statusSelected, setStatusSelected] = useState('')

  console.log('selectedRow', selectedRow)

  const CONSTANT_STATUS_USER = OBJECT_STATUS_USER()

  // ** Router
  const router = useRouter()
  // check permission xem, thêm, xoá, sửa của User  trên từng trang(trang UserList)
  const { VIEW, CREATE, UPDATE, DELETE } = usePermission('SYSTEM.USER', ['CREATE', 'VIEW', 'UPDATE', 'DELETE'])
  console.log('permisson', { VIEW, CREATE, UPDATE, DELETE })

  const {
    users,
    isLoading,
    isSuccessCreateEdit,
    isErrorCreateEdit,
    messageCreateEdit,
    typeError,
    isSuccessDelete,
    isErrorDelete,
    messagErrorDelete,
    isSuccessMultipleDelete,
    isErrorMultipleDelete,
    messageErrorMultipleDelete
  } = useSelector((state: RootState) => state.user)

  console.log('userr', users)

  // ** Redux
  const dispatch: AppDispatch = useDispatch() //dùng để đưa actions vào reducer xử lý

  // ** theme
  const theme = useTheme()

  // fetch Api

  const columns: GridColDef[] = [
    {
      field: i18n.language === 'vi' ? 'lastName' : 'firstName', // Trường field sẽ tìm đến key="name" trong data mà mình truyền vào ở dòng row={roles.data}
      headerName: t('Full_name'),
      flex: 1,
      minWidth: 200,
      maxWidth: 200,
      renderCell: params => {
        const { row } = params
        const fullName = toFullName(row?.lastName || '', row?.middleName || '', row?.firstName || '', i18n?.language)

        return <Typography>{fullName}</Typography>
      }
    },
    {
      field: 'email', // Trường field sẽ tìm đến key="name" trong data mà mình truyền vào ở dòng row={roles.data}
      headerName: t('Email'),
      minWidth: 200,
      maxWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row?.email}</Typography>
      }
    },
    {
      field: 'role', // Trường field sẽ tìm đến key="name" trong data mà mình truyền vào ở dòng row={roles.data}
      headerName: t('Role'),
      minWidth: 100,
      maxWidth: 100,
      renderCell: params => {
        const { row } = params

        return <Typography>{row?.role?.name}</Typography>
      }
    },
    {
      field: 'phoneNumber', // Trường field sẽ tìm đến key="name" trong data mà mình truyền vào ở dòng row={roles.data}
      headerName: t('Phone_number'),
      minWidth: 150,
      maxWidth: 150,
      renderCell: params => {
        const { row } = params

        return <Typography>{row?.phoneNumber}</Typography>
      }
    },
    {
      field: 'city', // Trường field sẽ tìm đến key="name" trong data mà mình truyền vào ở dòng row={roles.data}
      headerName: t('City'),
      minWidth: 150,
      maxWidth: 150,
      renderCell: params => {
        const { row } = params

        return <Typography>{row?.city}</Typography>
      }
    },
    {
      field: 'status', // Trường field sẽ tìm đến key="name" trong data mà mình truyền vào ở dòng row={roles.data}
      headerName: t('Status'),
      minWidth: 180,
      maxWidth: 180,
      renderCell: params => {
        const { row } = params

        return (
          <>{row?.status ? <ActiveUserStyled label={t('Active')} /> : <DeactivateUserStyled label={t('Block')} />}</>
        )
      }
    },
    {
      field: 'action',
      headerName: t('Actions'),
      width: 150,
      align: 'left',
      sortable: false,
      renderCell: params => {
        // console.log('params', params)
        const { row } = params
        console.log('rrrr', row)

        return (
          <Box sx={{ width: '100%' }}>
            <Box>
              <GridEdit
                disabled={!UPDATE}
                onClick={() =>
                  setOpenCreateEdit({
                    open: true,
                    id: String(row._id)
                  })
                }
              />
              <GridDelete
                disabled={!DELETE}
                onClick={() =>
                  setOpenDeleteUser({
                    open: true,
                    id: String(row._id)
                  })
                }
              />
            </Box>
          </Box>
        )
      }
    }
  ]

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

  const handleOnchangePagination = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  }

  const PaginationComponent = () => {
    return (
      <CustomPagination
        onChangePagination={handleOnchangePagination}
        pageSizeOptions={PAGE_SIZE_OPTION}
        page={page}
        pageSize={pageSize}
        rowLength={users.total}
      />
    )
  }

  const handleCloseCreateEdit = () => {
    setOpenCreateEdit({
      open: false,
      id: ''
    })
  }

  const handleSort = (sort: GridSortModel) => {
    console.log('check', sort)
    const sortOption = sort[0]
    if (sortOption) {
      setSortBy(`${sortOption.field} ${sortOption.sort}`) // đtặ lại sortBy = "name asc" hoặc "name desc"
      // sắp xếp theo field với thuộc tính sort là ...
    } else {
      setSortBy('createAt desc')
    }
  }

  const handleConfirmCloseDelete = () => {
    setOpenDeleteUser({
      open: false,
      id: ''
    })
  }
  const handleCloseConfirmDeleteMultipleUser = () => {
    setOpenDeleteMultipleUser(false)
  }

  const handleDeleteUser = () => {
    dispatch(deleteUserAsync(openDeleteUser.id))
  }
  const handleGetListUsers = () => {
  const query =  { params: { limit: pageSize, page: page, search: searchBy, order: sortBy, ...filterBy } }

    dispatch(getAllUsersAsync(query))
  }

  const handleDeleteMultipleUser = () => {
    dispatch(
      deleteMultipleUserAsync({
        userIds: selectedRow?.map((item: TSelectedRow) => item.id)
      })
    )
  }

  const handleAction = (action: string) => {
    switch (action) {
      case 'delete': {
        setOpenDeleteMultipleUser(true)
        break
      }
    }
  }

  const memoDisabledDeleteUser = useMemo(() => {
    return selectedRow.some((item: TSelectedRow) => item?.role?.permissions?.includes(PERMISSIONS.ADMIN))
  }, [selectedRow])

  useEffect(() => {
    fetchAllRole()
  }, [])

//khi filter theo Role, Status  (roleSelected (id của role)) thay đổi) thì set lại filterBy
  useEffect(() =>{
    setFilterBy({roleId: roleSelected, status: statusSelected})
  },[roleSelected, statusSelected])

  useEffect(() => {
    handleGetListUsers()
  }, [sortBy, searchBy, i18n.language, page, pageSize, filterBy])

  // xử lý thông báo khi tạo hoặc update thành công, thất bại
  useEffect(() => {
    if (isSuccessCreateEdit) {
      if (!openCreateEdit.id) {
        toast.success(t('Create_user_success'))
      } else {
        toast.success(t('Update_user_success'))
      }
      // toast.success(t(messageCreateEdit))
      handleGetListUsers()
      dispatch(resetInitialState())
      handleCloseCreateEdit()
    } else if (isErrorCreateEdit && typeError) {
      //nêu sko thành công
      const errorConfig = OBJECT_TYPE_ERROR_ROLE[typeError]
      if (errorConfig) {
        //nếu thao tác sai để trả về typeError  vd = "ALREADY_EXIST" hoặc INTERNAL_SERVER_ERROR
        toast.error(t(errorConfig))
      } else {
        // nếu bị lỗi nhưng trả  về typeError ko nằm trong khai báo
        if (openCreateEdit.id) {
          toast.error(t('Update_user_error'))
        } else {
          toast.error(t('Create_user_error'))
        }
      }
      dispatch(resetInitialState())
    }
  }, [isSuccessCreateEdit, isErrorCreateEdit, messageCreateEdit, typeError])

  // xử lý khi Delete thành công, thất bại
  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(t('Delete_user_success'))
      handleGetListUsers()
      dispatch(resetInitialState())
      handleConfirmCloseDelete()
    } else if (isErrorDelete) {
      // toast.error(t(messagErrorDelete))
      toast.success(t('Delete_user_error'))
      dispatch(resetInitialState())
    }
  }, [isSuccessDelete, isErrorDelete, messagErrorDelete])

  useEffect(() => {
    if (isSuccessMultipleDelete) {
      toast.success(t('Delete_multiple_user_success'))
      handleGetListUsers()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteMultipleUser()
      setSelectedRow([])
    } else if (isErrorMultipleDelete && messageErrorMultipleDelete) {
      toast.error(t('Delete_multiple_user_error'))
      dispatch(resetInitialState())
    }
  }, [isSuccessMultipleDelete, isErrorMultipleDelete, messageErrorMultipleDelete])

  console.log('openCE', openCreateEdit)

  return (
    <>
      {loading && <Spinner />}
      <ConfirmationDialog
        open={openDeleteUser.open}
        handleClose={handleConfirmCloseDelete}
        handleCancel={handleConfirmCloseDelete}
        handleConfirm={handleDeleteUser}
        title={t('Title_delete_user')}
        description={t('Confirm_delete_user')}
      />

      <ConfirmationDialog
        open={openDeleteMultipleUser}
        handleClose={handleCloseConfirmDeleteMultipleUser}
        handleCancel={handleCloseConfirmDeleteMultipleUser}
        handleConfirm={handleDeleteMultipleUser}
        title={t('Title_delete_multiple_user')}
        description={t('Confirm_delete_multiple_user')}
      />
      <CreateEditUser open={openCreateEdit.open} onClose={handleCloseCreateEdit} idUser={openCreateEdit.id} />
      {isLoading && <Spinner />}
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          display: 'flex',
          alignItems: 'center',
          padding: '20px',
          height: '100%'
        }}
      >
        <Grid container sx={{ height: '100%', width: '100%' }}>
          {!selectedRow?.length && (
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 4, width: '100%', gap: 4 }}
            >
               <Box sx={{ width: '200px' }}>
                <CustomSelect
                  fullWidth
                  onChange={e => {
                    setStatusSelected(String(e.target.value))
                  }}
                  options={Object.values(CONSTANT_STATUS_USER)}
                  value={statusSelected}
                  placeholder={t('Status')}
                />
              </Box>
              <Box sx={{ width: '200px' }}>
                <CustomSelect
                  fullWidth
                  onChange={e => {
                    setRoleSelected(String(e.target.value))
                  }}
                  options={optionRoles}
                  value={roleSelected}
                  placeholder={t('Role')}
                />
              </Box>
              <Box sx={{ width: '200px' }}>
                <InputSearch value={searchBy} onChangeSearch={(value: string) => setSearchBy(value)} />
              </Box>
              <GridCreate
                disabled={!CREATE}
                onClick={() =>
                  setOpenCreateEdit({
                    open: true,
                    id: ''
                  })
                }
              />
            </Box>
          )}

          {selectedRow?.length > 0 && (
            <TableHeader
              numRow={selectedRow?.length}
              onClear={() => setSelectedRow([])}
              actions={[{ label: t('Xóa'), value: 'delete', disabled: memoDisabledDeleteUser }]}
              handleAction={handleAction}
            />
          )}
          <CustomDataGrid
            rows={users.data}
            columns={columns}
            getRowId={row => row._id}
            disableRowSelectionOnClick
            autoHeight
            disableColumnMenu //ẩn tuỳ chọn menu ở các cột
            // hideFooter //ẩn thanh paginate
            slots={{
              pagination: PaginationComponent //custom lại thanh pagination
            }}
            pageSizeOptions={[5]}
            //cài đặt sort
            sortingMode='server' // đặt sắp xếp theo phía server, mặc định sẽ là client
            onSortModelChange={handleSort}
            sortingOrder={['asc', 'desc']} // quy định những lựa chọn cho sorting
            checkboxSelection
            rowSelectionModel={selectedRow?.map(item => item.id)} //set lai checkbox của các dòng : vd khi ấn nút X thì selectedRow=[] => các nút checkbox đã checked sẽ bỏ check
            onRowSelectionModelChange={(row: GridRowSelectionModel) => {
              const formatData: any = row.map(id => {
                const findRow: any = users?.data?.find((item: any) => item._id === id)
                if (findRow) {
                  return { id: findRow?._id, role: findRow?.role }
                }
              })
              setSelectedRow(formatData)
            }}
          />
        </Grid>
      </Box>
    </>
  )
}

export default UserListPage
