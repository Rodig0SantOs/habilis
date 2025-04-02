import React, { useRef, useState } from "react";
import style from "./Formulario.module.css";
import FormField from "../utils/form";
import Footer from "../components/Footer/Footer";
import { sendEmail } from "../services/emailService";
import { uploadFileToImgBB } from "../utils/uploadFile";

const Formulario = () => {
  const formRef = useRef(null);
  const [formStatus, setFormStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20MB total

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formRef.current) {
      console.error("formRef.current está indefinido!");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData(formRef.current);

      // Extrair dados do formulário
      const formValues = {
        nome: formData.get("nome") || "",
        email: formData.get("email") || "",
        data_hora: formData.get("data_hora"),
        descricao: formData.get("descricao"),
        ativos: formData.get("ativos"),
        impacto: formData.get("impacto"),
        mitigacao: formData.get("mitigacao"),
        causa: formData.get("causa"),
        anonimo: formData.get("anonimo"),
        confirmacao: formData.get("confirmacao"),
      };

      // Processar anexos
      const files = formData.getAll("anexo");
      let totalSize = 0;
      const anexos = [];

      // Verificar tamanhos primeiro
      for (let i = 0; i < files.length; i++) {
        // Verifica se é um arquivo válido (tamanho > 0)
        if (files[i].size > 0) {
          if (files[i].size > MAX_FILE_SIZE) {
            throw new Error(
              `O arquivo ${files[i].name} excede o limite de 10MB`
            );
          }
          totalSize += files[i].size;
        }
      }

      if (totalSize > MAX_TOTAL_SIZE) {
        throw new Error("O tamanho total dos anexos excede 20MB");
      }

      // Upload dos arquivos válidos para imgBB
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > 0) {
          // Verifica se é um arquivo válido
          const uploadResult = await uploadFileToImgBB(files[i]);
          anexos.push({
            name: uploadResult.name,
            url: uploadResult.url,
          });
        }
      }

      // Enviar email com as URLs dos anexos
      await sendEmail({
        ...formValues,
        anexo: anexos, // Passando o array de anexos
      });

      setFormStatus({
        type: "success",
        message: "Formulário enviado com sucesso!",
      });

      formRef.current.reset();
    } catch (error) {
      console.error("Erro no envio:", error);
      setFormStatus({
        type: "error",
        message: error.message || "Erro ao enviar formulário",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={style.body}>
      <section className={style.container}>
        <div className={style.containerBlock}>
          <h1>Registro de Ocorrência</h1>
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className={style.form}
            encType="multipart/form-data"
          >
            <FormField
              label="Nome completo do denunciante (opcional se a denúncia for anônima)."
              type="text"
              name="nome"
              placeholder="Digite seu nome completo"
            />
            <FormField
              label="E-mail ou telefone de contato (para retorno, se necessário)."
              type="text" // Isso está correto para aceitar tanto email quanto telefone
              name="email"
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
              name="anexo" // Este nome deve ser consistente em todos os lugares
              multiple
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
