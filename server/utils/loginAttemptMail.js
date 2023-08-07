const nodemailer = require("nodemailer");
const dotenv = require('dotenv').config();

let dateOfAttempt = new Date();

const sendLoginAttemptMail = async (userFirstname, userLastname, userEmail) => {
    const html = `
        <h3>Dear ${userFirstname} ${userLastname},</h3>
        <p>Someone (hopefully you) tried to log in to your account on ${dateOfAttempt.toLocaleDateString()} at ${dateOfAttempt.toLocaleTimeString()}</p><br/>
        
        
        <p>If you didn't attempt to log in at the time stated above,please change your password immediately to protect your account.</p><br/>
        <p>
            Kind Regards,<br/>Tochukwu.
        </p>
    `

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL,
            pass: process.env.MAIL_AUTH
        }
    });

    const info = await transporter.sendMail({
        from: `Tochukwu Amaechi <${process.env.MAIL}>`, 
        to: userEmail,
        subject: "Login Attempt",
        html: html
    })
}
module.exports = sendLoginAttemptMail;