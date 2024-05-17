// ** MUI Imports
import { Box, Button, IconButton, Typography } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import IconifyIcon from '../Icon'

const StyledTableHEader = styled(Box)(({theme}) =>({
  borderRadius:"15px",
  border: `1px solid ${theme.palette.primary.main}`,
  padding:'8px 10px',
  width:'100%',
  marginBottom:'10px',
  display:'flex',
  alignItems:'center',
  justifyContent:'space-between'
}))

type TProps = {
  numRow : number,
  onClear: () => void,
  actions : {label:string, value:string,disabled?: boolean}[],
  handleAction : (type:string) => void
}


const TableHeader = (props: TProps) => {
  const {numRow, onClear, actions, handleAction} = props

  // ** Hook
  const theme = useTheme()
  const {t} = useTranslation()


  return (
   <StyledTableHEader>
      <Box sx={{display:"flex", alignItems:"center", gap:"6px" }}>
          <Typography>{t("Selected")}</Typography>
          <Typography sx={{backgroundColor:theme.palette.primary.main, height:"20px",
            width:"20px", borderRadius:"50%", display:"flex", alignItems:"center",justifyContent:"center",
            color: theme.palette.customColors.lightPaperBg,
            fontWeight:600, fontSize:"12px !important"
          }}>{numRow}</Typography>
      </Box>

      <Box sx={{display:"flex", alignItems:"center", gap:"8px" }}>
        {actions.map((action) =>{
            return (
              <Button disabled={action?.disabled} key={action.value} variant='contained' onClick={() => handleAction(action.value)}>{action.label}</Button>
            )
        })}
      <IconButton onClick={onClear}>
            <IconifyIcon icon="iconoir:delete-circle"/>
      </IconButton>
      </Box>
      
   </StyledTableHEader>
  )
}

export default TableHeader
