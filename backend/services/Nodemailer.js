import { createTransport } from "nodemailer";

import config from '../config/config.js';

// create reusable transporter object using the default SMTP transport
let transporter = createTransport({
    host: "smtp.mail.yahoo.com",
    port: 587,
    secure: false,
    auth: {
      user: config.nodeMailer.user, 
      pass: config.nodeMailer.password,
    },
  });

export const sendEmail = async (data) => {
    try {

        console.log(`[task]: Issuing an signup verfication email to ${data.to}`)

        let info  = await transporter.sendMail(data);

        if(info.rejected.length === 0){
            console.log(`[task]: Signup verification email succesfully delivered to ${data.to}`);
        }
        else {
            console.log(`[task}: Signup verification email failed to deliver to ${data.to}`)
        }

    } catch (error) {
        console.log(`Error sending signup email ${error}`)
    }
}

