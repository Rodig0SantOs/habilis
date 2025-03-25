/* eslint-disable no-undef */
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5173;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
  host: process.env.MAILGRID_HOST || "grid133.mailgrid.com.br",
  port: process.env.MAILGRID_PORT || 587,
  secure: false, // true para 465, false para outras portas
  auth: {
    user: process.env.MAILGRID_USER,
    pass: process.env.MAILGRID_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

app.post("/enviar-formulario", async (req, res) => {
  try {
    const formData = req.body;

    const mailOptions = {
      from: `"Formulário de Ocorrência" <${process.env.MAILGRID_USER}>`,
      to: process.env.EMAIL_DESTINO, // email que receberá os dados
      subject: "Nova Ocorrência Registrada",
      html: `
              <h1>Nova Ocorrência Registrada</h1>
              <p><strong>Nome:</strong> ${formData.nome || "Anônimo"}</p>
              <p><strong>Contato:</strong> ${
                formData.contato || "Não informado"
              }</p>
              <p><strong>Data e Hora:</strong> ${formData.data_hora}</p>
              <p><strong>Descrição:</strong> ${formData.descricao}</p>
              <p><strong>Ativos Impactados:</strong> ${formData.ativos}</p>
              <p><strong>Impacto Operacional:</strong> ${formData.impacto}</p>
              <p><strong>Evidências:</strong> ${
                formData.evidencias || "Não informado"
              }</p>
              <p><strong>Ações de Mitigação:</strong> ${formData.mitigacao}</p>
              <p><strong>Possível Causa:</strong> ${formData.causa}</p>
              <p><strong>Denúncia Anônima:</strong> ${formData.anonimo}</p>
              <p><strong>Confirmação:</strong> ${formData.confirmacao}</p>
            `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Formulário enviado com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao enviar formulário", error });
    console.error(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
