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
  Grid,
  IconButton,
  InputAdornment,
  Tooltip,
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
import { resetInitialState } from 'src/stores/role'
import { useRouter } from 'next/router'
import { ROUTE_CONFIG } from 'src/configs/route'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'src/hooks/useAuth'
import { deleteRoleAsync, getAllRolesAsync } from 'src/stores/role/actions'
import CustomDataGrid from 'src/components/custom-data-grid'
import { GridColDef, GridSortModel, GridValueGetterParams } from '@mui/x-data-grid'
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import CustomPagination from 'src/components/custom-pagination'
import IconifyIcon from 'src/components/Icon'
import GridEdit from 'src/components/grid-delete'
import GridDelete from 'src/components/grid-edit'
import GridCreate from 'src/components/grid-create'
import InputSearch from 'src/components/input-search'
import CreateEditRole from './component/CreateEditRole'
import Spinner from 'src/components/spinner'
import ConfirmationDialog from 'src/components/confirmation-dialog'
import { deleteRole } from 'src/services/role'

type TProps = {}

type TDefaultValue = {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

const RoleListPage: NextPage<TProps> = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  // truyền thêm id vào để phân biệt nếu id ko phải chuỗi rỗng thì nghĩa là mở Modal Edit, ngược lại thì là mở Modal Create
  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    id: ''
  })

  const [openDeleteRole, setOpenDeleteRole] = useState({
    open: false,
    id: ''
  })

  const [sortBy, setSortBy] = useState('created asc')
  const [searchBy, setSearchBy] = useState('')

  // ** Router
  const router = useRouter()

  const {
    roles,
    isLoading,
    isSuccessCreateEdit,
    isErrorCreateEdit,
    messageCreateEdit,
    typeError,
    isSuccessDelete,
    isErrorDelete,
    messagErrorDelete
  } = useSelector((state: RootState) => state.role)
  console.log('roles', roles)

  // ** Redux
  const dispatch: AppDispatch = useDispatch() //dùng để đưa actions vào reducer xử lý

  // ** theme
  const theme = useTheme()

  // ** Translate
  const { t } = useTranslation()
  const handleGetListRoles = () => {
    dispatch(getAllRolesAsync({ params: { limit: -1, page: -1, search: searchBy, order: sortBy } }))
  }

  useEffect(() => {
    handleGetListRoles()
  }, [sortBy, searchBy])

  // xử lý thông báo khi tạo hoặc update thành công, thất bại
  useEffect(() => {
    if (isSuccessCreateEdit) {
      if (openCreateEdit.id) {
        toast.success(t('update-role-success'))
      } else {
        toast.success(t('create-role-success'))
      }
      // toast.success(t(messageCreateEdit))
      handleGetListRoles()
      dispatch(resetInitialState())
      handleCloseCreateEdit()
    } else if (isErrorCreateEdit) {
      toast.error(t(messageCreateEdit))
      dispatch(resetInitialState())
    }
  }, [isSuccessCreateEdit, isErrorCreateEdit, messageCreateEdit])

  // xử lý khi Delete thành công, thất bại
  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(t('delete-role-success'))
      handleGetListRoles()
      dispatch(resetInitialState())
      handleConfirmCloseDelete()
    } else if (isErrorDelete) {
      toast.error(t(messagErrorDelete))
      dispatch(resetInitialState())
    }
  }, [isSuccessDelete, isErrorDelete, messagErrorDelete])

  const columns: GridColDef[] = [
    {
      field: 'name', // Trường field sẽ tìm đến key="name" trong data mà mình truyền vào ở dòng row={roles.data}
      headerName: t('Name'),
      flex: 1
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
        // console.log('rrrr', row)

        return (
          <Box sx={{width:"100%"}}>
            {/* nếu role có permisson là 'ADMIN.GRANTED' hoặc 'BASIC.PUBLIC' thì hiện 2 nút chỉnh sửa và xoá */}
            {!row?.permissions?.some((per: string) => ['ADMIN.GRANTED', 'BASIC.PUBLIC']?.includes(per)) ? (
              <>
                <GridEdit
                  onClick={() =>
                    setOpenCreateEdit({
                      open: true,
                      id: String(row._id)
                    })
                  }
                />
                <GridDelete
                  onClick={() =>
                    setOpenDeleteRole({
                      open: true,
                      id: String(row._id)
                    })
                  }
                />
              </>
            ) : (<IconifyIcon icon="material-symbols-light:lock-outline" fontSize={27}/> ) 
              }
          </Box>
        )
      }
    }
  ]
  const handleOnchangePagination = (page: number, pageSize: number) => {}

  const PaginationComponent = () => {
    return (
      <CustomPagination
        onChangePagination={handleOnchangePagination}
        pageSizeOptions={PAGE_SIZE_OPTION}
        page={page}
        pageSize={pageSize}
        rowLength={roles.total}
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
    setSortBy(`${sortOption.field} ${sortOption.sort}`) // đtặ lại sortBy = "name asc" hoặc "name desc"
    // sắp xếp theo field với thuộc tính sort là ...
  }

  const handleConfirmCloseDelete = () => {
    setOpenDeleteRole({
      open: false,
      id: ''
    })
  }
  const handleDeleteRole = () => {
    dispatch(deleteRoleAsync(openDeleteRole.id))
  }

  return (
    <>
      <ConfirmationDialog
        open={openDeleteRole.open}
        handleClose={handleConfirmCloseDelete}
        handleCancle={handleConfirmCloseDelete}
        handleConfirm={handleDeleteRole}
        title={t('title_delete_role')}
        description={t('confirm_delete_role')}
      />
      <CreateEditRole open={openCreateEdit.open} onClose={handleCloseCreateEdit} idRole={openCreateEdit.id} />
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
          <Grid item md={5} xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <GridCreate
                onClick={() =>
                  setOpenCreateEdit({
                    open: true,
                    id: ''
                  })
                }
              />
              <Box sx={{ width: '200px' }}>
                <InputSearch value={searchBy} onChangeSearch={(value: string) => setSearchBy(value)} />
              </Box>
            </Box>
            <CustomDataGrid
              rows={roles.data}
              columns={columns}
              getRowId={row => row._id}
              checkboxSelection={false} // ẩn đi checkbox
              disableRowSelectionOnClick
              autoHeight
              disableColumnMenu //ẩn tuỳ chọn menu ở các cột
              hideFooter //ẩn thanh paginate
              slots={{
                pagination: PaginationComponent //custom lại thanh pagination
              }}
              pageSizeOptions={[5]}
              //cài đặt sort
              sortingMode='server' // đặt sắp xếp theo phía server, mặc định sẽ là client
              onSortModelChange={handleSort}
              sortingOrder={['asc', 'desc']} // quy định những lựa chọn cho sorting
            />
          </Grid>
          <Grid item md={7} xs={12}>
            List Permisson
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default RoleListPage
