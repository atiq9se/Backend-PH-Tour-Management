import { User } from './../modules/user/user.model';
import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./.env";

passport.use(
    new GoogleStrategy(
        {
            clientID: envVars.GOOGLE_CLIENT_ID,
            clientSecret: envVars.GOOGLE_CLIENT_SECRET,
            callbackURL: envVars.GOOGLE_CALLBACK_URL
        }, async(accessToken:string, refreshToken:string, profile: Profile, done: VerifyCallback)
        =>{
            const email= profile.emails?.[0].value;
            if(!email){
                return done(null, false, {message: "No email found"})
            }
            let user = await User.findOne({email})
            if(!user){
                user = await User.create({
                    email,
                    name: profile.displayName,
                    picture: profile.photos?.[0].value,
                    roll: Roll.USER,
                    isVerified: true,
                    auths: [
                        {
                            provider: "google",
                            providerId: profile.id
                        }
                    ]
                })
            }
        }catch(error){
            error
        }
    )
)