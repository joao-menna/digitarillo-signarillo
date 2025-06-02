import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  // @ts-ignore
  host: process.env.SMTP_HOST ?? "localhost",
  port: process.env.SMTP_PORT ?? "25",
  secure: false,
  auth: {
    user: process.env.SMTP_USERNAME ?? "username",
    pass: process.env.SMTP_PASSWORD ?? "password",
  },
})
