"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async ({ to, subject, html }) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const mailOptions = {
            from: `"Play Tube" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        };
        await transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.error("❌ Error sending email:", error);
        throw new Error("Email sending failed");
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=sendmail.js.map