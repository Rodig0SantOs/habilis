import React, { useRef, useState } from "react";
import style from "./Formulario.module.css";
import FormField from "../utils/form";
import Footer from "../components/Footer/Footer";

const Formulario = () => {
  const SMTP_HOST = import.meta.env.VITE_SMTP_HOST;
  const SMTP_USER = import.meta.env.VITE_SMTP_USER;
  const SMTP_PASS = import.meta.env.VITE_SMTP_PASS;
  const API_URL = import.meta.env.VITE_API_URL;
  const SMTP_TOKEN = import.meta.env.VITE_SMTP_TOKEN;

  const formRef = useRef(null);
  const [formStatus, setFormStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus(null);

    try {
      const formData = new FormData(formRef.current);
      const formValues = Object.fromEntries(formData.entries());

      let anexosBase64 = {};
      if (formValues.evidencias && formValues.evidencias.size > 0) {
        anexosBase64 = await processarAnexos(formValues.evidencias);
      }

      const emailData = {
        host_smtp: SMTP_HOST,
        usuario_smtp: SMTP_USER,
        senha_smtp: SMTP_PASS,
        emailRemetente: SMTP_USER,
        nomeRemetente: "Sistema de Denúncias STW Brasil",
        emailDestino: ["stwbrasil@stwbrasil.com"],
        assunto: `Nova Ocorrência Registrada - ${formValues.data_hora}`,
        mensagem: construirMensagemHTML(formValues),
        mensagemTipo: "html",
        mensagemEncoding: "base64",
        mensagemAlt: construirMensagemTexto(formValues),
      };

      if (Object.keys(anexosBase64).length > 0) {
        emailData.mensagemAnexos = anexosBase64;
      }

      const response = await fetch("/api/send", {
        // Note a ausência da barra no final
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SMTP_TOKEN}`,
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      const result = await response.json();

      if (result.status === "MSG ENVIADA") {
        setFormStatus({
          type: "success",
          message: "Ocorrência registrada com sucesso!",
        });
        formRef.current.reset();
      } else {
        throw new Error(result.status || "Erro ao enviar o email");
      }
    } catch (error) {
      console.error("Erro detalhado:", error);
      setFormStatus({
        type: "error",
        message: error.message.includes("Failed to fetch")
          ? "Falha na conexão com o servidor. Verifique sua internet."
          : error.message.includes("HTTP error")
          ? `Erro do servidor: ${error.message}`
          : "Falha ao registrar ocorrência. Por favor, tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para processar anexos em Base64
  const processarAnexos = async (arquivos) => {
    const anexos = {};

    // Converter FileList para array para facilitar iteração
    const arquivosArray = Array.from(arquivos);

    for (let i = 0; i < arquivosArray.length; i++) {
      const arquivo = arquivosArray[i];
      const base64 = await converterParaBase64(arquivo);
      anexos[`file${i + 1}`] = {
        name: arquivo.name,
        type: arquivo.type,
        content: base64.split(",")[1], // Remove o prefixo data:...
      };
    }

    return anexos;
  };

  // Converter arquivo para Base64
  const converterParaBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Construir mensagem HTML
  const construirMensagemHTML = (dados) => {
    return `
      <html>
        <body>
          <h1>Nova Ocorrência Registrada</h1>
          <p><strong>Data/Hora:</strong> ${dados.data_hora}</p>
          ${
            dados.nome
              ? `<p><strong>Denunciante:</strong> ${dados.nome}</p>`
              : "<p><strong>Denúncia anônima</strong></p>"
          }
          ${
            dados.contato
              ? `<p><strong>Contato:</strong> ${dados.contato}</p>`
              : ""
          }
          <h2>Detalhes do Incidente</h2>
          <p>${dados.descricao.replace(/\n/g, "<br>")}</p>
          <h3>Ativos Impactados</h3>
          <p>${dados.ativos}</p>
          <h3>Impacto Operacional</h3>
          <p>${dados.impacto.replace(/\n/g, "<br>")}</p>
          <h3>Ações de Mitigação</h3>
          <p>${dados.mitigacao.replace(/\n/g, "<br>")}</p>
          <h3>Possível Causa</h3>
          <p>${dados.causa.replace(/\n/g, "<br>")}</p>
          <p><strong>Denúncia anônima:</strong> ${
            dados.anonimo === "sim" ? "Sim" : "Não"
          }</p>
          <p><strong>Confirma veracidade:</strong> ${
            dados.confirmacao === "sim" ? "Sim" : "Não"
          }</p>
          ${
            Object.keys(dados.evidencias || {}).length > 0
              ? "<p><strong>Anexos:</strong> Sim</p>"
              : ""
          }
        </body>
      </html>
    `;
  };

  // Construir mensagem em texto simples
  const construirMensagemTexto = (dados) => {
    return `
Nova Ocorrência Registrada

Data/Hora: ${dados.data_hora}
${dados.nome ? `Denunciante: ${dados.nome}` : "Denúncia anônima"}
${dados.contato ? `Contato: ${dados.contato}` : ""}

Detalhes do Incidente:
${dados.descricao}

Ativos Impactados:
${dados.ativos}

Impacto Operacional:
${dados.impacto}

Ações de Mitigação:
${dados.mitigacao}

Possível Causa:
${dados.causa}

Denúncia anônima: ${dados.anonimo === "sim" ? "Sim" : "Não"}
Confirma veracidade: ${dados.confirmacao === "sim" ? "Sim" : "Não"}
${Object.keys(dados.evidencias || {}).length > 0 ? "Anexos: Sim" : ""}
    `;
  };

  return (
    <section className={style.body}>
      <section className={style.container}>
        <div className={style.containerBlock}>
          <h1>Registro de Ocorrência</h1>
          <form ref={formRef} onSubmit={handleSubmit} className={style.form}>
            <FormField
              label="Nome completo do denunciante (opcional se a denúncia for anônima)."
              type="text"
              name="nome"
              placeholder="Digite seu nome completo"
            />
            <FormField
              label="E-mail ou telefone de contato (para retorno, se necessário)."
              type="text"
              name="contato"
              placeholder="Digite seu e-mail ou telefone"
            />
            <FormField
              label="Data e hora do incidente. *Obrigatória"
              type="datetime-local"
              name="data_hora"
              required
            />
            <FormField
              label="Descrição detalhada do incidente: Explique o que aconteceu, como aconteceu e quaisquer observações relevantes. *obrigatória"
              type="textarea"
              name="descricao"
              placeholder="Descreva o incidente detalhadamente"
              required
            />
            <FormField
              label="Ativos impactados (computadores, servidores, dispositivos móveis, etc.) *obrigatória"
              type="text"
              name="ativos"
              placeholder="Liste os ativos impactados"
              required
            />
            <FormField
              label="O incidente gerou algum impacto operacional? (interrupção nas operações das áreas de negócios, impacto a marca, impacto na cadeia de suprimentos). *obrigatória"
              type="textarea"
              name="impacto"
              placeholder="Descreva o impacto operacional"
              required
            />
            <FormField
              label="O que foi feito até agora para mitigar ou conter o incidente? (Se alguma senha foi alterada, sistemas desativados, etc.). *obrigatória"
              type="textarea"
              name="mitigacao"
              placeholder="Descreva as ações de mitigação"
              required
            />
            <FormField
              label="Possível causa do incidente: Se o denunciante souber, pode tentar identificar se foi falha humana, falha técnica ou ataque cibernético. *obrigatória"
              type="textarea"
              name="causa"
              placeholder="Descreva a possível causa"
              required
            />
            <FormField
              label="Você gostaria de denunciar de forma anônima? *obrigatória"
              type="select"
              name="anonimo"
              options={[
                { value: "sim", label: "Sim" },
                { value: "nao", label: "Não" },
              ]}
              required
            />
            <FormField
              label="Confirma que as informações fornecidas são verdadeiras e completas? *obrigatória"
              type="select"
              name="confirmacao"
              options={[
                { value: "sim", label: "Sim" },
                { value: "nao", label: "Não" },
              ]}
              required
            />
            <FormField
              label="Existem evidências ou logs relacionados ao incidente? (anexar se possível)."
              type="file"
              name="evidencias"
              multiple // Permite múltiplos arquivos
            />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar"}
            </button>
          </form>
          {formStatus && (
            <p
              className={
                formStatus.type === "success" ? style.success : style.error
              }
            >
              {formStatus.message}
            </p>
          )}
        </div>
      </section>
      <Footer />
    </section>
  );
};

export default Formulario;
