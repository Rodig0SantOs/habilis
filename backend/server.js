/* eslint-disable no-undef */
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import cors from "cors";
import multer from "multer";
import sgMail from "@sendgrid/mail";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000; // Adicionando a porta faltante
const upload = multer();

// Middlewares atualizados
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração melhorada do SMTP (SendGrid)
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false, // true para 465, false para outras portas
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_SMTP_KEY,
  },
  tls: {
    ciphers: "SSLv3", // Adição para contornar possíveis problemas de TLS
    rejectUnauthorized: false, // Apenas para desenvolvimento
  },
  logger: true, // Habilita logging para debug
});

// Rota otimizada para enviar formulário
app.post("/formulario", upload.none(), async (req, res) => {
  console.log("Dados recebidos:", req.body); // Log para debug

  try {
    const {
      nome,
      contato,
      data_hora,
      descricao,
      ativos,
      impacto,
      evidencias,
      mitigacao,
      causa,
      anonimo,
      confirmacao,
    } = req.body;

    // Validação básica dos campos obrigatórios
    if (
      !data_hora ||
      !descricao ||
      !ativos ||
      !impacto ||
      !mitigacao ||
      !causa ||
      !anonimo ||
      !confirmacao
    ) {
      return res.status(400).json({
        message: "Campos obrigatórios faltando",
        requiredFields: [
          "data_hora",
          "descricao",
          "ativos",
          "impacto",
          "mitigacao",
          "causa",
          "anonimo",
          "confirmacao",
        ],
      });
    }

    sgMail.setApiKey(process.env.SENDGRID_SMTP_KEY);

    const mailOptions = {
      from: `"Formulário de Ocorrência" <${process.env.EMAIL_REMETENTE}>`,
      to: process.env.EMAIL_DESTINO,
      subject: "Nova Ocorrência Registrada - " + new Date().toLocaleString(),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h1 style="color: #2c3e50;">Nova Ocorrência Registrada</h1>
          ${
            nome
              ? `<p><strong style="color: #34495e;">Nome:</strong> ${nome}</p>`
              : ""
          }
          ${
            contato
              ? `<p><strong style="color: #34495e;">Contato:</strong> ${contato}</p>`
              : ""
          }
          <p><strong style="color: #34495e;">Data e Hora:</strong> ${data_hora}</p>
          <p><strong style="color: #34495e;">Descrição:</strong><br>${descricao.replace(
            /\n/g,
            "<br>"
          )}</p>
          <p><strong style="color: #34495e;">Ativos Impactados:</strong><br>${ativos.replace(
            /\n/g,
            "<br>"
          )}</p>
          <p><strong style="color: #34495e;">Impacto Operacional:</strong><br>${impacto.replace(
            /\n/g,
            "<br>"
          )}</p>
          ${
            evidencias
              ? `<p><strong style="color: #34495e;">Evidências:</strong><br>${evidencias.replace(
                  /\n/g,
                  "<br>"
                )}</p>`
              : ""
          }
          <p><strong style="color: #34495e;">Ações de Mitigação:</strong><br>${mitigacao.replace(
            /\n/g,
            "<br>"
          )}</p>
          <p><strong style="color: #34495e;">Possível Causa:</strong><br>${causa.replace(
            /\n/g,
            "<br>"
          )}</p>
          <p><strong style="color: #34495e;">Denúncia Anônima:</strong> ${anonimo}</p>
          <p><strong style="color: #34495e;">Confirmação:</strong> ${confirmacao}</p>
        </div>
      `,
      text:
        `Nova Ocorrência Registrada\n\n` +
        `${nome ? `Nome: ${nome}\n` : ""}` +
        `${contato ? `Contato: ${contato}\n` : ""}` +
        `Data e Hora: ${data_hora}\n` +
        `Descrição: ${descricao}\n` +
        `Ativos Impactados: ${ativos}\n` +
        `Impacto Operacional: ${impacto}\n` +
        `${evidencias ? `Evidências: ${evidencias}\n` : ""}` +
        `Ações de Mitigação: ${mitigacao}\n` +
        `Possível Causa: ${causa}\n` +
        `Denúncia Anônima: ${anonimo}\n` +
        `Confirmação: ${confirmacao}`,
    };

    // Envio do email com timeout
    const emailTimeout = setTimeout(() => {
      throw new Error("Timeout no envio do email");
    }, 10000); // 10 segundos

    const info = await transporter.sendMail(mailOptions);
    clearTimeout(emailTimeout);

    console.log("Email enviado:", info.messageId);
    res.status(200).json({
      success: true,
      message: "Formulário enviado com sucesso!",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Erro no envio:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao processar o formulário",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Rota de health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// Tratamento de erros global
app.use((err, req, res) => {
  console.error("Erro global:", err);
  res.status(500).json({
    success: false,
    message: "Erro interno no servidor",
    error: err.message,
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || "development"}`);
  console.log(`Email remetente: ${process.env.EMAIL_REMETENTE}`);
  console.log(`Email destino: ${process.env.EMAIL_DESTINO}`);
});
