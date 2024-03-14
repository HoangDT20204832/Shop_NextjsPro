// ** React
import React from 'react'

import IconifyIcon from '../../../../components/Icon'
import { IconButton } from '@mui/material'
import { useSettings } from 'src/hooks/useSettings'
import { Mode } from 'src/types/layouts'

type TProps = {}
const ModeToggle = (props: TProps) => {
   
    const {settings, saveSettings} = useSettings()

    //khi thay goij saveSettings() để update lại chế độ mode thì nó được lưu vào localstorage với key:settings  và cập nhật lại giá trị "mode"
    const handleModeChange = (mode: Mode) =>{
        saveSettings({...settings, mode})
    }

    // ham xu ly bam nut de chuyen doi sang/ toi
    const handleToggleMode = () =>{
        if(settings.mode ==="dark"){
            handleModeChange("light")
        }else{
            handleModeChange("dark")
        }
    }

  return (
    <IconButton color='inherit' onClick={handleToggleMode}>
        <IconifyIcon icon={settings.mode==="light" ? "material-symbols:dark-mode-outline":"iconamoon:mode-light"} />
    </IconButton>
  )
}

export default ModeToggle
