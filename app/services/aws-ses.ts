"use server"
import * as AWS from "aws-sdk";
import * as nodeMailer from "nodemailer";
import {generateUserTokenURL, getUserByEmail} from "@/app/db";

AWS.config.update({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
    region: "us-east-2",
});
AWS.config.getCredentials((err, credentials) => {
    if (err) {
        console.error(err.stack);
    }
});
const ses = new AWS.SES({apiVersion: "latest"});

const adminMail = "noreply@unitedwayblackhills.org"

const transporter = nodeMailer.createTransport({
    SES: ses
});

export const sendResetPasswordLink = async (prevState: any, formData: FormData) => {
    const email = formData.get("email");

    if (!email) return {
        message: "",
        error: "Email is required"
    }

    const user = await getUserByEmail(email as string);
    const userId = user[0].id;

    const tokenUrl = await generateUserTokenURL(userId);

    if(!tokenUrl) return {error: "Invalid User", msg: ""}

    console.log(tokenUrl);

    try {
        await transporter.sendMail({
            from: adminMail,
            to: email as string,
            replyTo: adminMail,
            subject: `Update your United Way Pledge Forms Account`,
            html: `
            <!DOCTYPE html >
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>test</title>
</head>
<body>
<div style="padding:20px;">
<div style="max-width: 500px;">
<p>
<strong>Please use the following link to update your account</strong>
<p>Please not this link will expire after use, or after 48 hours for security purposes</p>
<a href="${tokenUrl}">Update Account</a>
<br/>
</p>
</div>
</div>
</body>
</html>
            `
        });

        return {
            message: `A link was mailed to update your profile. Please check ${email}`,
            error: ""
        }

    } catch (e) {
        console.error(e);
        return {error: "There was a problem sending your message please try again later.", msg: ""}
    }
}