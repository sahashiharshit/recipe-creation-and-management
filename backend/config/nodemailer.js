import nodemailer from "nodemailer";

const transporter =  nodemailer.createTransport({

service:"gmail",
auth:{user:process.env.EMAIL_USER,pass:process.env.EMAIL_PASS},
});

export const sendOTPEmail = async(email,otp)=>{
    const mailOptions = {
        from:process.env.EMAIL_USER,
        to:email,
        subject:"Your OTP Code",
        text:`Your OTP code is ${otp}. It will expire in 10 minutes.`,
    };
    return transporter.sendMail(mailOptions);

};