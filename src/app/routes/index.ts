import { Router } from "express"
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { DivisionRoutes } from "../modules/division/division.route";

export const router = Router();

const moduleRoutes = [
   {
        path: "/user",
        route: UserRoutes
   },
   {
        path: "/auth",
        route: AuthRoutes
   },
   {
        path: "/division",
        route: DivisionRoutes
   },
//    {
//         path: "/tour",
//         route: TourRoutes
//    },
]

moduleRoutes.forEach((route) =>{
    router.use(route.path, route.route)
})

// router.use("/user", UserRoutes)
// router.use("/tour", TourRoutes)
// router.use("/booking", BookingRoutes)
// router.use("/guide", guideRoutes)
// router.use("/division", DivisionRoutes)