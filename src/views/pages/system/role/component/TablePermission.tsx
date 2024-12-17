import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Checkbox, IconButton, Tooltip, Typography, useTheme } from '@mui/material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import CustomDataGrid from 'src/components/custom-data-grid'
import CustomModal from 'src/components/custom-modal'
import IconifyIcon from 'src/components/Icon'
import Spinner from 'src/components/spinner'
import CustomTextField from 'src/components/text-field'
import { LIST_DATA_PERMISSIONS, PERMISSIONS } from 'src/configs/permission'
import { getDetailsRole } from 'src/services/role'
import { AppDispatch, RootState } from 'src/stores'
import { createRoleAsync, updateRoleAsync } from 'src/stores/role/actions'
import { getAllValueOfObject } from 'src/utils'
import * as yup from 'yup'

interface TTablePermisson {
  permissonSelected: string[]
  setPermissonSelected: Dispatch<SetStateAction<string[]>>
  isDisablePermisson?: boolean
}

type TDefaultValue = {
  name: string
}

const TablePermisson = (props: TTablePermisson) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const { permissonSelected, setPermissonSelected,isDisablePermisson } = props

  const [loading, setLoading] = useState(false)

  const dispatch: AppDispatch = useDispatch()

  //handle
  const getValuePermisson = (value: string, mode: string, parentValue?: string) => {
    try {
      //trường hợp có parentValue
      if (parentValue) {
        return (PERMISSIONS as any)[parentValue][value][mode]
      } else {
        //trường hợp ko có parentValue (vd : DASHBOARD)
        return (PERMISSIONS as any)[value]
      }
    } catch (error) {
      return ''
    }
  }

  const handleOnchangeCheckbox = (value: string) => {
    const isChecked = permissonSelected.includes(value)
    if (isChecked) {
      const filtered = permissonSelected.filter(item => item !== value)
      setPermissonSelected(filtered)
    } else {
      setPermissonSelected([...permissonSelected, value])
    }
  }

  const handleIsChecked = (value: string,  isParent?:boolean,parentValue?: string,) => {
    let allValue : string[]  = [];
    if(parentValue){
      allValue = getAllValueOfObject((PERMISSIONS as any)[parentValue][value]);
    }else{
      if(isParent){
        allValue = getAllValueOfObject((PERMISSIONS as any)[value])
      }else{
        allValue = [(PERMISSIONS as any)[value]]
      }
    }
    console.log('allValue', allValue)
    // nếu khi tick vào ô All Child mà tất cả các phần tử nằm trong mảng allValue đều đã tồn tại trong mảng permissonSelected
    //thì isCheckedAll = true
    const isCheckedAll = allValue.every(item => permissonSelected.includes(item))

    return {
        isChecked : isCheckedAll,
        allValue : allValue
    }
  }

  const handleCheckAllCheckBoxChild = (value: string,isParent?:boolean, parentValue?: string) => {
    const {isChecked: isCheckedAll, allValue} = handleIsChecked(value, isParent, parentValue)
// nếu khi tick vào ô All Child mà tất cả các phần tử nằm trong mảng allValue đều đã tồn tại trong mảng permissonSelected  thì
  if (isCheckedAll) {
      // sẽ setPermissonSelected  = những phần tử ko phải của mảng allValue
      const filtered = permissonSelected.filter(item => !allValue.includes(item))
      setPermissonSelected(filtered)
    } else {
      //nếu ko thì sẽ add thêm những phần tử của allValue vào mảng permissonSelected
      //dùng ..new Set() để trả về những phần tử khác nhau, để tránh bị trùng
      //(vd th trùng: giả sử ở hàng đó đã có 1 phần tử a đc check; nếu ta tick vào ô all ở hàng đó thì vẫn sẽ lọt vào trong đây do isCheckedAll= false
      // => nếu ko dùng new Set thì phần tử a này sẽ đc thêm vào trong list permisssonSekected 1 lần nữa do a nằm tòng allValue )
      setPermissonSelected([...new Set([...permissonSelected, ...allValue])])
    }
  }
  const handleCheckAllGroupCheckBoxParent = (value:string, isParent?: boolean) =>{
    console.log("hk", typeof(isParent))
    const {isChecked: isCheckedAll, allValue} = handleIsChecked(value , isParent)
    // nếu khi tick vào ô All Child mà tất cả các phần tử nằm trong mảng allValue đều đã tồn tại trong mảng permissonSelected  thì
      if (isCheckedAll) {
          // sẽ setPermissonSelected  = những phần tử ko phải của mảng allValue
          const filtered = permissonSelected.filter(item => !allValue.includes(item))
          setPermissonSelected(filtered)
        } else {
          //nếu ko thì sẽ add thêm những phần tử của allValue vào mảng permissonSelected
          //dùng ..new Set() để trả về những phần tử khác nhau, để tránh bị trùng
          setPermissonSelected([...new Set([...permissonSelected, ...allValue])])
        }
  }
  console.log('permissionSelected', permissonSelected)

  // console.log("km", {permissonSelected})
  console.log('checked', {
    getAllValuesOfObject: getAllValueOfObject(PERMISSIONS, [PERMISSIONS.ADMIN, PERMISSIONS.BASIC])
  })

  const columns: GridColDef[] = [
    {
      field: 'all', // Trường field sẽ tìm đến key="All" trong data mà mình truyền vào ở dòng row={roles.data}
      headerName: t('ALl'),
      minWidth: 80,
      maxWidth: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params
        const {isChecked} = handleIsChecked(row.value,row?.isParent, row?.parentValue)

        return (
          <>
            <Checkbox
              disabled={isDisablePermisson}
              value={row?.value}
              onChange={e => {
                if (row.isParent) {
                  handleCheckAllGroupCheckBoxParent(e.target.value, row.isParent as boolean)
                } else {
                  handleCheckAllCheckBoxChild(e.target.value,row?.isParent, row.parentValue)
                }
              }}
              checked={isChecked}
            />
          </>
        )
      }
    },
    {
      field: 'name', // Trường field sẽ tìm đến key="name" trong data mà mình truyền vào ở dòng row={roles.data}
      headerName: t('Name'),
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return (
          <Typography
            sx={{
              color: row.isParent ? theme.palette.primary.main : `rgba(${theme.palette.customColors.main},0.78)`,
              paddingLeft: row.isParent ? '0px' : '40px',
              textTransform: row.isParent ? 'uppercase' : 'normal'
            }}
          >
            {t(row?.name)}
          </Typography>
        )
      }
    },

    {
      field: 'view', // Trường field sẽ tìm đến key="view" trong data mà mình truyền vào ở dòng row={roles.data}
      headerName: t('View'),
      minWidth: 80,
      maxWidth: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params
        console.log('Rowss', { row, PERMISSIONS })
        const value = getValuePermisson(row.value, 'VIEW', row.parentValue)

        return (
          <>
            {!row.isHideView && !row.isParent && (
              <Checkbox
                disabled={isDisablePermisson}
                value={value}
                onChange={e => handleOnchangeCheckbox(e.target.value)}
                checked={permissonSelected.includes(value)}
              />
            )}
          </>
        )
      }
    },
    {
      field: 'create', // Trường field sẽ tìm đến key="Create" trong data mà mình truyền vào ở dòng row={roles.data}
      headerName: t('Create'),
      minWidth: 80,
      maxWidth: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params
        const value = getValuePermisson(row.value, 'CREATE', row.parentValue)

        return (
          <>
            {!row.isHideCreate && !row.isParent && (
              <Checkbox
                disabled={isDisablePermisson}
                value={value}
                onChange={e => handleOnchangeCheckbox(e.target.value)}
                checked={permissonSelected.includes(value)}
              />
            )}
          </>
        )
      }
    },
    {
      field: 'update', // Trường field sẽ tìm đến key="Update" trong data mà mình truyền vào ở dòng row={roles.data}
      headerName: t('Edit'),
      minWidth: 80,
      maxWidth: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params
        const value = getValuePermisson(row.value, 'UPDATE', row.parentValue)

        return (
          <>
            {!row.isHideUpdate && !row.isParent && (
              <Checkbox
                disabled={isDisablePermisson}
                value={value}
                onChange={e => handleOnchangeCheckbox(e.target.value)}
                checked={permissonSelected.includes(value)}
              />
            )}
          </>
        )
      }
    },
    {
      field: 'delete', // Trường field sẽ tìm đến key="Delete" trong data mà mình truyền vào ở dòng row={roles.data}
      headerName: t('Delete'),
      minWidth: 80,
      maxWidth: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params
        const value = getValuePermisson(row.value, 'DELETE', row.parentValue)

        return (
          <>
            {!row.isHideDelete && !row.isParent && (
              <Checkbox
                disabled={isDisablePermisson}
                value={value}
                onChange={e => handleOnchangeCheckbox(e.target.value)}
                checked={permissonSelected.includes(value)}
              />
            )}
          </>
        )
      }
    }
  ]

  return (
    <>
      {loading && <Spinner />}

      <CustomDataGrid
        rows={LIST_DATA_PERMISSIONS}
        columns={columns}
        disableRowSelectionOnClick
        autoHeight
        disableColumnMenu //ẩn tuỳ chọn menu ở các cột
        disableColumnFilter
        hideFooter //ẩn thanh paginate
      />
    </>
  )
}

export default TablePermisson
