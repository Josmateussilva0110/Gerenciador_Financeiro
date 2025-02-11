const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, htmlContent, textContent) => {
  const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'jmateussilva044@gmail.com',
      pass: 'null',
    }
  });
  console.log("ACESSOU SEND EMAIL")

  try {
    await transport.sendMail({
      from: 'Gerenciador Financeiro <jmateussilva044@gmail.com>',
      to,
      subject,
      html: htmlContent,
      text: textContent,
    });

    console.log('Email enviado com sucesso.');
  } catch (err) {
    console.error('Erro ao enviar: ', err);
  }
};

module.exports = sendEmail;
