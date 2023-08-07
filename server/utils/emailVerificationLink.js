const nodemailer = require("nodemailer");
const dotenv = require('dotenv').config();


const verifyEmail = async (userFirstname, userLastname, userEmail, verificationLink) => {
    const html = `
        <h3>Dear ${userFirstname} ${userLastname},</h3>
        <p>Welcome to my technical interview test. To proceed with the login, you'd need to verify your email address by clicking the link provided below</p><br/>
        
        <p>
            ${verificationLink}
        </p>
        <p>Verification allows you access to login sucessfully. Please note that this link expires in 1 hour.</p> <br/>
        <p>Welcome Onboard!</p>
        <p>
            Best,<br/>Tochukwu.
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
        subject: "Account Email Verification",
        html: html
    })
}
module.exports = verifyEmail;