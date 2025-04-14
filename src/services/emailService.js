// emailService.js
import emailjs from "@emailjs/browser";

// Inicializa assim que o arquivo é carregado
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

export const sendEmail = async (formData) => {
  try {
    console.log("Public Key:", import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
    console.log("Service ID:", import.meta.env.VITE_EMAILJS_SERVICE_ID);
    console.log("Template ID:", import.meta.env.VITE_EMAILJS_TEMPLATE_ID);

    const templateParams = {
      from_name: formData.nome || "Sistema de Ocorrências",
      subject: `Registro de Ocorrência - ${formData.nome || "Anônimo"}`,
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

    const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

    const response = await emailjs.send(serviceID, templateID, templateParams);
    return response;
  } catch (error) {
    console.error("Erro detalhado no envio:", error);
    throw new Error("Falha ao enviar e-mail: ", error.message);
  }
};
