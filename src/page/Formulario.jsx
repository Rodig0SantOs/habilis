/* eslint-disable no-undef */
import React, { useRef, useState } from "react";
import style from "./Formulario.module.css";
import FormField from "../utils/form";
import Footer from "../components/Footer/Footer";

const Formulario = () => {
  const formRef = useRef(null);
  const [formStatus, setFormStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus(null);

    try {
      const formData = new FormData(formRef.current);
      const fileInput = formRef.current.elements.evidencias;
      let fileBase64 = null;

      // Processar arquivo se existir
      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        fileBase64 = await toBase64(file);
      }

      // Preparar dados para o email
      const emailData = {
        host_smtp: process.env.REACT_APP_SMTP_HOST,
        usuario_smtp: process.env.REACT_APP_SMTP_USER,
        senha_smtp: process.env.REACT_APP_SMTP_PASS,
        emailRemetente: process.env.REACT_APP_SMTP_USER,
        nomeRemetente: "Sistema de Denúncias",
        emailDestino: ["rodrigo.santos@stwbrasil.com"], // Pode adicionar mais destinatários
        assunto: `Nova Ocorrência Registrada - ${formData.get("data_hora")}`,
        mensagem: `
          <h1>Nova Ocorrência Registrada</h1>
          <p><strong>Nome:</strong> ${formData.get("nome") || "Anônimo"}</p>
          <p><strong>Contato:</strong> ${
            formData.get("contato") || "Não informado"
          }</p>
          <p><strong>Data/Hora:</strong> ${formData.get("data_hora")}</p>
          <p><strong>Descrição:</strong> ${formData.get("descricao")}</p>
          <p><strong>Ativos Impactados:</strong> ${formData.get("ativos")}</p>
          <p><strong>Impacto Operacional:</strong> ${formData.get(
            "impacto"
          )}</p>
          <p><strong>Ações de Mitigação:</strong> ${formData.get(
            "mitigacao"
          )}</p>
          <p><strong>Possível Causa:</strong> ${formData.get("causa")}</p>
          <p><strong>Denúncia Anônima:</strong> ${formData.get("anonimo")}</p>
        `,
        mensagemTipo: "html",
        mensagemEncoding: "utf-8",
        mensagemAlt: `Nova ocorrência registrada em ${formData.get(
          "data_hora"
        )}. Verifique o email HTML para detalhes.`,
      };

      // Adicionar anexo se existir
      if (fileBase64) {
        emailData.mensagemAnexos = {
          file1: {
            name: fileInput.files[0].name,
            type: fileInput.files[0].type,
            content: fileBase64.split(",")[1], // Remove o prefixo data:...
          },
        };
      }

      // Enviar email
      await sendEmail(emailData);

      setFormStatus({
        type: "success",
        message: "Ocorrência registrada com sucesso!",
      });
      formRef.current.reset();
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      setFormStatus({
        type: "error",
        message: "Erro ao enviar ocorrência. Por favor, tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para converter arquivo para base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

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
