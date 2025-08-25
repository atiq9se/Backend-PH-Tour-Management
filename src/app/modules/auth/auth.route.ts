import { checkAuth } from './../../middlewares/checkAuth';
import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import { Role } from '../user/user.interface';
import passport from 'passport';


const router = Router()

router.post("/login", AuthControllers.credentialsLogin)
router.post("/refresh-token", AuthControllers.getNewAccessToken)
router.post("/logout", AuthControllers.logOut)
router.post("/reset-password", checkAuth(...Object.values(Role)), AuthControllers.resetPassword)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.get("/google", async(req:Request, res: Response, next: NextFunction)=>{
    const redirect = req.query.redirect ||"/"
    passport.authenticate("google", {scope:["profile", "email"], state: redirect as string})(req, res)
})
//api/v1/auth/google/callback?state=/booking
router.get("/google/callback", passport.authenticate("google", {failureRedirect:"/login"}), AuthControllers.googleCallbackController)

export const AuthRoutes = router;
