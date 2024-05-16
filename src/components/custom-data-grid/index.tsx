import React, { Ref } from 'react'
import Box from '@mui/material/Box'
import { DataGrid, DataGridProps, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import { styled } from '@mui/material'

const StyleCustomGrid = styled(DataGrid)<DataGridProps>(({ theme }) => ({
  '& .MuiDataGrid-main': {
    border: `1px solid ${theme.palette.customColors.borderColor}`,
    borderRadius: '8px'
  },
  '.MuiDataGrid-withBorderColor':{
    outline: "none !important"
  },
  '.MuiDataGrid-columnHeaderTitle' :{
    color : theme.palette.primary.main
  }
}))

const CustomDataGrid = React.forwardRef((props: DataGridProps, ref: Ref<any>) => {
  return (
    <Box sx={{ height: "100%", width: '100%', overflow:"auto" }}>
      <StyleCustomGrid {...props} />
    </Box>
  )
})

export default CustomDataGrid
