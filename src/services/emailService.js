// emailService.js
import emailjs from "@emailjs/browser";

// Inicialização única (não dentro de sendEmail)
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

export const sendEmail = async (formData) => {
  try {
    const templateParams = {
      from_name: formData.nome,
      subject: `Registro de Ocorrência - ${formData.nome}`,
      email: formData.email || "Não informado",
      reply_to: formData.email || "",
      incident_date: formData.data_hora || "Não informado",
      description: formData.descricao || "Não informado",
      assets: formData.ativos || "Não informado",
      impact: formData.impacto || "Não informado",
      mitigation: formData.mitigacao || "Não informado",
      cause: formData.causa || "Não informado",
      anonymous: formData.anonimo || "Não informado",
      confirmation: formData.confirmacao || "Não informado",
      /* anexo: anexosFormatados, */
    };

    const response = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log(response);

    return response;
  } catch (error) {
    console.error("Erro no envio:", error);
    throw error;
  }
};
