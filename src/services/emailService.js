const sendEmail = async (formData, anexos = {}) => {
  const url = import.meta.env.VITE_API_URL;

  const data = {
    host_smtp: import.meta.env.VITE_SMTP_HOST,
    usuario_smtp: import.meta.env.VITE_SMTP_USER,
    senha_smtp: import.meta.env.VITE_SMTP_PASS,
    emailRemetente: "rodrigo.santos@stwbrasil.com",
    nomeRemetente: "StwBrasil",
    emailDestino: ["rodrigo.santos@stwbrasil.com"], // Pode adicionar mais destinatários
    assunto: `Nova Ocorrência Registrada - ${formData.data_hora}`,
    mensagem: formatEmailMessage(formData),
    mensagemTipo: "html",
    mensagemEncoding: "quoted-printable",
    mensagemAnexos: anexos,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SMTP_TOKEN}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    throw error;
  }
};

// Função para formatar o corpo do email em HTML
const formatEmailMessage = (formData) => {
  return `
      <html>
        <body>
          <h1>Nova Ocorrência Registrada</h1>
          <p><strong>Data e Hora:</strong> ${formData.data_hora}</p>
          ${
            formData.nome
              ? `<p><strong>Nome:</strong> ${formData.nome}</p>`
              : ""
          }
          ${
            formData.contato
              ? `<p><strong>Contato:</strong> ${formData.contato}</p>`
              : ""
          }
          <p><strong>Descrição:</strong><br>${formData.descricao.replace(
            /\n/g,
            "<br>"
          )}</p>
          <p><strong>Ativos Impactados:</strong><br>${formData.ativos}</p>
          <p><strong>Impacto Operacional:</strong><br>${formData.impacto.replace(
            /\n/g,
            "<br>"
          )}</p>
          <p><strong>Ações de Mitigação:</strong><br>${formData.mitigacao.replace(
            /\n/g,
            "<br>"
          )}</p>
          <p><strong>Possível Causa:</strong><br>${formData.causa.replace(
            /\n/g,
            "<br>"
          )}</p>
          <p><strong>Denúncia Anônima:</strong> ${
            formData.anonimo === "sim" ? "Sim" : "Não"
          }</p>
          <p><strong>Confirmação das Informações:</strong> ${
            formData.confirmacao === "sim" ? "Sim" : "Não"
          }</p>
          ${
            formData.evidencias
              ? `<p><strong>Evidências Anexadas:</strong> Sim (${
                  Object.keys(formData.evidencias).length
                } arquivos)</p>`
              : "<p><strong>Evidências Anexadas:</strong> Não</p>"
          }
        </body>
      </html>
    `;
};

export default sendEmail;
