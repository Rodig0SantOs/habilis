import emailjs from "@emailjs/browser";

export const initEmailJS = () => {
  emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
};

export const sendEmail = async (formData) => {
  try {
    await initEmailJS();

    // Verifica se existem anexos e formata
    let anexosFormatados = "Nenhum anexo";
    if (formData.anexo && formData.anexo.length > 0) {
      anexosFormatados = formData.anexo
        .map((anexo) => `${anexo.name}: ${anexo.url}`)
        .join("\n");
    }

    console.log("Anexos formatados:", anexosFormatados);
    console.log(
      "Dados do formulário antes do envio:",
      {
        ...formData,
        anexo: anexosFormatados,
      } // Excluindo o campo de anexos para não enviar no log
    );

    const templateParams = {
      from_name: formData.nome || "Anônimo",
      email: formData.email || "Não informado",
      incident_date: formData.data_hora || "Não informado",
      description: formData.descricao || "Não informado",
      assets: formData.ativos || "Não informado",
      impact: formData.impacto || "Não informado",
      mitigation: formData.mitigacao || "Não informado",
      cause: formData.causa || "Não informado",
      anonymous: formData.anonimo || "Não informado",
      confirmation: formData.confirmacao || "Não informado",
      anexo: anexosFormatados,
      message: "",
    };

    const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

    const response = await emailjs.send(serviceID, templateID, templateParams);
    return response;
  } catch (error) {
    console.error("Erro detalhado no envio:", error);
    throw new Error("Falha ao enviar e-mail: " + error.message);
  }
};
