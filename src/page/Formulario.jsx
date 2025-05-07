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

    if (!formRef.current) {
      console.error("formRef.current está indefinido!");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData(formRef.current);

      const nome = formData.get("nome") || "Anônimo";
      const emailOuTelefone = formData.get("email") || "";
      const isEmail = emailOuTelefone.includes("@");

      // Dados principais
      const opportunityData = {
        queueId: 0,
        apiKey: "string", // Substitua por sua chave real
        fkPipeline: 0,
        fkStage: 0,
        responsableid: 0,
        title: `Ocorrência: ${
          formData.get("descricao")?.substring(0, 50) || "Sem título"
        }`,
        clientid: "string", // Substitua pelo seu clientid
        mainphone: isEmail ? "" : emailOuTelefone,
        mainmail: isEmail ? emailOuTelefone : "",
        description: "Ocorrência registrada via formulário",
        expectedclosedate: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        formattedlocation: "Local não especificado",
        postalcode: formData.get("cep") || "",
        address1: formData.get("endereco1") || "",
        address2: formData.get("endereco2") || "",
        city: formData.get("cidade") || "",
        state: formData.get("estado") || "",
        country: formData.get("pais") || "",
        countrycode: formData.get("codigoPais") || "",
        lat: 0,
        lon: 0,
        probability: 0,
        value: 0,
        recurrentvalue: 0,
        origin: 0,
        formsdata: {
          nome,
          data_hora: formData.get("data_hora"),
          descricao: formData.get("descricao"),
          ativos: formData.get("ativos"),
          impacto: formData.get("impacto"),
          mitigacao: formData.get("mitigacao"),
          causa: formData.get("causa"),
          anonimo: formData.get("anonimo"),
          confirmacao: formData.get("confirmacao"),
        },
        tags: [0], // A lista de tags pode estar vazia ou com IDs válidos
        files: [], // Envie arquivos, se houver
        contacts: [0], // IDs dos contatos, se necessário
        followers: [0], // IDs dos seguidores, se necessário
        products: [
          {
            id: 0, // Substitua com dados reais do produto, se aplicável
            qty: 0,
            discount: 0,
          },
        ],
      };

      console.log("Payload final:", opportunityData);

      const response = await fetch(
        "https://suportehabilis.atenderbem.com/int/createOpportunity",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(opportunityData),
        }
      );

      console.log("Resposta JSON", response);
      

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro detalhado:", errorText);
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log("Resposta da API:", data);

      setFormStatus({
        type: "success",
        message: "Ocorrência registrada com sucesso no sistema!",
      });

      formRef.current.reset();
    } catch (error) {
      console.error("Erro no envio:", error);
      setFormStatus({
        type: "error",
        message: error.message || "Erro ao registrar ocorrência",
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
            {/* Campos do formulário mantidos iguais */}
            <FormField
              label="Nome completo do denunciante (opcional se a denúncia for anônima)."
              type="text"
              name="nome"
              placeholder="Digite seu nome completo"
            />
            <FormField
              label="E-mail ou telefone de contato (para retorno, se necessário)."
              type="text"
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
              name="anexo"
              multiple
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
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
