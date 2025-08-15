import z from "zod";

export const createUserZodSchema = z.object({
            name: z
                .string({ invalid_type_error: "Name must be string" })
                .min   (2, {message: "Name must be at least two characters long."})
                .max   (60, {message: "Name cannot exceed sixty characters."}),
            
            email: z
                .string({ invalid_type_error: "Email must be string" })
                .email ({ message: "Invalid email address format." })
                .min   (5, { message: "Email must be at least 5 characters long." })
                .max   (50, { message: "Eamil cannot exceed 50 characters." }),
            
            password: z
                   .string({ invalid_type_error: "Email must be string" })
                   .min   (8, { message: "Email must be at least 8 characters long." })
                   .regex (/^(?=.*[A-Z])/, { message: "Password must contain at least 1 uppercase letter."})
                   .regex (/^(?=.*[!@#$%^&*])/, { message: "Password must contain at least 1 special character."})
                   .regex (/^(?=.*\d)/, { message: "Password must contain at least 1 number."}),
            
            phone: z
                 .string({ invalid_type_error: "Phone must be string" })
                 .regex (/^(?:\+8801\d{9}|01\d{9})$/, { message: "Phone number must be valid for Bangladesh. Format: +8801xxxxxxxxx or 01xxxxxxxxx"})
                 .optional(),
            
            address: z
                   .string({ invalid_type_error: "Address must be string" })
                   .max(300, { message: "Address cannot exceed 300 characters."})
                   .optional()
        })