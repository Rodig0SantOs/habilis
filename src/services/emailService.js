/* eslint-disable no-undef */
const sendEmail = async (emailDestino, assunto, mensagem) => {
    const url = "https://api.mailgrid.net.br/send/";
  
    const data = {
      host_smtp: process.env.REACT_APP_SMTP_HOST,
      usuario_smtp: process.env.REACT_APP_SMTP_USER,
      senha_smtp: process.env.REACT_APP_SMTP_PASS,
      emailRemetente: "rodrigo.santos@stwbrasil.com",
      nomeRemetente: "Seu Nome",
      emailDestino: [emailDestino], // Aceita um array de e-mails
      assunto: assunto,
      mensagem: mensagem,
      mensagemTipo: "html",
      mensagemEncoding: "base64",
    };
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_SMTP_TOKEN}`,
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      return result; // Retorna a resposta da API
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      throw error;
    }
  };
  
  export default sendEmail;
  