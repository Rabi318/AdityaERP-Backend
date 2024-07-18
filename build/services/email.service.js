"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv/config");
exports.transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    service: process.env.EMAIL_SERVICE_PROVIDER,
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_SERVICE_AUTH_EMAIL,
        pass: process.env.EMAIL_SERVICE_AUTH_PASS,
    },
});
const emailService = {
    setPasswordEmail: (email, name, otp) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield exports.transporter.sendMail({
                from: process.env.EMAIL_SERVICE_SEND_FROM,
                to: email,
                subject: "Set Password",
                text: `Hey ${name}, Thanks for using our service`,
                html: ` <html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Forgot Password - OTP</title>
		<style>
			/* Reset styles */
			body, html {
			    margin: 0;
			    padding: 0;
			}
			/* Email body styles */
			.email-body {
			    font-family: Arial, sans-serif;
			    background-color: #f4f4f4;
			    padding: 20px;
			}
			/* Email container styles */
			.email-container {
			    max-width: 600px;
			    margin: 0 auto;
			    border-radius: 10px;
			    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
			    padding: 20px;
			    text-align: center;
			    animation: gradient-shift 10s ease infinite;
			    background: linear-gradient(45deg, #FFC107, #FF5722, #3F51B5, #009688);
			    background-size: 400% 400%;
			}
			@keyframes gradient-shift {
			    0% {
			        background-position: 0% 50%;
			    }
			    50% {
			        background-position: 100% 50%;
			    }
			    100% {
			        background-position: 0% 50%;
			    }
			}
			/* Heading styles */
			h1 {
			    color: #fff;
			    font-size: 28px;
			    margin-bottom: 20px;
			}
			/* Logo styles */
			.logo {
			    max-width: 150px;
			    margin-bottom: 20px;
			}
			/* Description styles */
			.description {
			    color: #fff;
			    font-size: 16px;
			    line-height: 1.6;
			    margin-bottom: 20px;
			}
			/* OTP box styles */
			.otp-box {
			    display: inline-block;
			    background-color: #f0f0f0;
			    padding: 10px 20px;
			    border-radius: 5px;
			    font-size: 24px;
			    margin-bottom: 20px;
			    animation: pulse 1s infinite alternate;
			}
			@keyframes pulse {
			    from {
			        transform: scale(1);
			    }
			    to {
			        transform: scale(1.1);
			    }
			}
			/* Expiry message styles */
			.expiry-msg {
			    color: #fff;
			    font-size: 14px;
			    margin-bottom: 20px;
			}
			/* Button styles */
			.button {
			    background-color: #007bff;
			    color: #fff;
			    text-decoration: none;
			    padding: 10px 20px;
			    border-radius: 5px;
			    transition: background-color 0.3s ease;
			}
			.button:hover {
			    background-color: #0056b3;
			}
		</style>
	</head>
	<body class="email-body">
		<div class="email-container">
			<img src="https://e-commerce-theta-six.vercel.app/logo.png" alt="Logo" class="logo" />
			<h1>Set Your Password</h1>
			<p class="description">Hi ${name}, you have requested to set your password. Here is your One-Time Password (OTP) to proceed:</p>
			<div class="otp-box">${otp}</div>
			<p class="expiry-msg">This OTP is valid for 3 minutes. Please do not share this OTP with anyone.</p>
			<a href="#" class="button">Reset Password</a>
		</div>
	</body>
</html>`,
            });
            return data;
        }
        catch (error) {
            console.log(error);
        }
    }),
};
exports.default = emailService;
