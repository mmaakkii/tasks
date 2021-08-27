"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const path_1 = __importDefault(require("path"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const pug_1 = __importDefault(require("pug"));
const html_to_text_1 = require("html-to-text");
const aws = __importStar(require("@aws-sdk/client-ses"));
class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.firstName;
        this.url = url;
        this.from = `Makki Omer <${process.env.EMAIL_FROM}>`;
    }
    newTransport() {
        const ses = new aws.SES({
            apiVersion: '2010-12-01',
            region: 'ap-south-1',
        });
        return nodemailer_1.default.createTransport({ SES: { ses, aws } });
    }
    send(template, subject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const templateDirectory = path_1.default.join(__dirname, '..', 'views', 'email', `${template}.pug`);
                const html = pug_1.default.renderFile(templateDirectory, {
                    firstName: this.firstName,
                    url: this.url,
                    subject,
                });
                const mailOptions = {
                    from: this.from,
                    to: this.to,
                    text: html_to_text_1.convert(html),
                    ses: {},
                    subject,
                    html,
                };
                yield this.newTransport().sendMail(mailOptions);
            }
            catch (err) {
                console.log(err.message);
            }
        });
    }
    sendWelcome() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.send('welcome', 'Welcome to the Task Manager.');
        });
    }
    sendPasswordReset() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.send('passwordReset', 'Your password reset token (Valid for 10 minutes only)');
        });
    }
}
exports.default = Email;
