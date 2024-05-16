import { PERMISSIONS } from "src/configs/permission"
import { useAuth } from "./useAuth"
import { useEffect, useState } from "react"

//hàm kiểm tra quyền thêm, xoá, sửa, xem của user trong từng trang
type TActions = "UPDATE" | "DELETE" | "VIEW" |  "CREATE"
export const usePermission = (key:string, actions: TActions[]) =>{
    const defaultValues = {
        VIEW: false,
        CREATE: false,
        UPDATE: false,
        DELETE: false
    }
    const {user} = useAuth()
    const getObjectValue = (obj:any, key:string)=>{
        const keys = key.split(".");
        let result = obj;
        if(keys && !!key.length){
            for(const k of keys){
                if(k in result){
                    result = result[k]
                }
            }
        }
        console.log("result", {result})

        return result
    }
    const userPermission = user?.role?.permissions
    // const userPermission = ["SYSTEM.ROLE.CREATE","SYSTEM.ROLE.UPDATE"]

    const [permission, setPermission] = useState(defaultValues)

    useEffect(()=>{
        const mapPermission = getObjectValue(PERMISSIONS, key);
        actions.forEach((mode) =>{
            if(userPermission?.includes(PERMISSIONS.ADMIN)){
                defaultValues[mode]= true
            }else if(mapPermission[mode] && userPermission?.includes(mapPermission[mode])){
                defaultValues[mode] = true
            }else{
                defaultValues[mode] = false
            }
        })
        setPermission(defaultValues)
    }, [user?.role])

    return permission
}