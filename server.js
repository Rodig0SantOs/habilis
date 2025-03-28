/* eslint-disable no-undef */
require("dotenv").config(); // Carrega as variáveis do .env
import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Configuração do transportador do Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true", // Converte string para boolean
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.post("/send-email", (req, res) => {
  const {
    nome,
    contato,
    data_hora,
    descricao,
    ativos,
    impacto,
    mitigacao,
    causa,
    anonimo,
    confirmacao,
    evidencias,
  } = req.body;

  const mailOptions = {
    from: "rodrigo.santos@stwbrasil.com",
    to: "rodrigo.santos@stwbrasil.com",
    subject: "Registro de Ocorrência",
    html: `
      <h1>Registro de Ocorrência</h1>
      <p><strong>Nome do Denunciante:</strong> ${nome || "Anônimo"}</p>
      <p><strong>Contato:</strong> ${contato}</p>
      <p><strong>Data e Hora do Incidente:</strong> ${data_hora}</p>
      <p><strong>Descrição do Incidente:</strong> ${descricao}</p>
      <p><strong>Ativos Impactados:</strong> ${ativos}</p>
      <p><strong>Impacto Operacional:</strong> ${impacto}</p>
      <p><strong>Ações de Mitigação:</strong> ${mitigacao}</p>
      <p><strong>Possível Causa:</strong> ${causa}</p>
      <p><strong>Denúncia Anônima:</strong> ${anonimo}</p>
      <p><strong>Confirmação das Informações:</strong> ${confirmacao}</p>
      <p><strong>Evidências/Logs:</strong> ${
        evidencias
          ? `<a href="${evidencias}">Ver Evidências</a>`
          : "Nenhuma evidência anexada"
      }</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res
        .status(500)
        .send({ message: "Erro ao enviar o e-mail", error });
    }
    res.status(200).send({ message: "E-mail enviado com sucesso!", info });
  });
});

app.listen(port, () => {
  console.log(`Servidor backend rodando na porta ${port}`);
});
