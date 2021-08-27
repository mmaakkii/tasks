import path from 'path';
import nodemailer from 'nodemailer';
import pug from 'pug';
import { convert } from 'html-to-text';
import * as aws from '@aws-sdk/client-ses';

import { IEmail } from '@global/types/index';
import { IUserDocument } from '../modules/users/types/user';
import Logger from 'jet-logger';

const logger = new Logger();

export default class Email implements IEmail {
  public user: IUserDocument | null;
  public to: string;
  public from: string;
  public firstName: string;
  public url: string;

  constructor(user: IUserDocument, url: string) {
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
    return nodemailer.createTransport({ SES: { ses, aws } });
  }

  async send(template, subject) {
    try {
      const templateDirectory = path.join(
        __dirname,
        '..',
        'views',
        'email',
        `${template}.pug`
      );
      const html = pug.renderFile(templateDirectory, {
        firstName: this.firstName,
        url: this.url,
        subject,
      });
      const mailOptions = {
        from: this.from,
        to: this.to,
        text: convert(html),
        ses: {},
        subject,
        html,
      };
      await this.newTransport().sendMail(mailOptions);
    } catch (err) {
      logger.err(err.message);
      console.log(err.message);
    }
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Task Manager.');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (Valid for 10 minutes only)'
    );
  }
}
