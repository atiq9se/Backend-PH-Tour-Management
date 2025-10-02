import  bcryptjs  from 'bcryptjs';
import { envVars } from "../config/.env"
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model"

export const seedSuperAdmin = async() =>{
    try{
        const isSuperAdminExit = await User.findOne({email: envVars.SUPER_ADMIN_EMAIL});
        if(isSuperAdminExit){
            console.log("super admin already exit")
            return
        }

        const hashPassword = await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND))

        const authProvider: IAuthProvider ={
            provider: "credentials",
            providerId: envVars.SUPER_ADMIN_EMAIL
        }

        const payload:IUser = {
            name: "super admin",
            email: envVars.SUPER_ADMIN_EMAIL,
            password: hashPassword,
            role: Role.SUPER_ADMIN,
            IsVerified: true,
            phone: "01732090820",
            address: "mohammadpur",
            auth: [authProvider]
        }

        const superadmin = await User.create(payload)
        console.log("super admin create successfully")
        console.log(superadmin)
    }
    catch(error){
        console.log(error)
    }
}