import { createClient } from "@/utils/supabase/client"
import { NextResponse } from "next/server"
import nodemailer from 'nodemailer'

export async function POST(req){
    try{
        const {email} = await req.json()
        const supabase = createClient()

        const {data,error} = await supabase.auth.admin.generateLink({
            type: "magiclink",
            email,
            options:{
                redirectTo:`http://localhost:3000/invite-vendor`

            }

        })

        if(error){
            return NextResponse.json({success:false,error:error.message})
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },


        })

        const mailOptions={
            from:process.env.Email_User,
            to:email,
            subject:"Invitation for Vendor from Euroasiann",
            text:`Hello! Thank you for signing up. This is a test email.`

        }

        await transporter.sendEmail(mailOptions)
        return NextResponse.json({success:true,message:"Email sent successfull"})


    }catch(error){

        return NextResponse.json({success:false, error:error.message})

    }
}