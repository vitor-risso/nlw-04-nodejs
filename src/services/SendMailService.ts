import nodemailer, { Transporter } from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';

class SendMailService {
  private client: Transporter 

  // Constructor is initialized when a class is called. Cant not be use async/await
  constructor(){
    nodemailer.createTestAccount()
      .then(account => {
        const transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
              user: account.user,
              pass: account.pass
          }
      });
        this.client = transporter;
      })
  }

  async execute(to: string, subject: string, variables: object, path: string){

    const templateFileContent = fs.readFileSync(path).toString("utf8");
    
    const mailTemplateParse =handlebars.compile(templateFileContent)

    const html = mailTemplateParse(variables)

    const msg = await this.client.sendMail({
      to,
      subject,
      html: html,
      from: 'NPS <noreply@nps.com.br>'
    })

    console.log('Message sent: %s', msg.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(msg));

  }
}

export default new SendMailService();
