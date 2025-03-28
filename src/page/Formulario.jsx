/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import axios from "axios";
import style from "./Formulario.module.css";
import FormField from "../utils/form";
import Footer from "../components/Footer/Footer";

const Formulario = () => {
  const formRef = useRef(null);
  const [formStatus, setFormStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(formRef.current);

    const data = {
      nome: formData.get("nome"),
      contato: formData.get("contato"),
      data_hora: formData.get("data_hora"),
      descricao: formData.get("descricao"),
      ativos: formData.get("ativos"),
      impacto: formData.get("impacto"),
      mitigacao: formData.get("mitigacao"),
      causa: formData.get("causa"),
      anonimo: formData.get("anonimo"),
      confirmacao: formData.get("confirmacao"),
      evidencias: formData.get("evidencias"), // Aqui você pode pegar o arquivo ou link relacionado
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/send-email",
        data
      );
      setFormStatus("E-mail enviado com sucesso!");
    } catch (error) {
      setFormStatus("Erro ao enviar o e-mail. Tente novamente.");
    }
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
            />
            <input type="submit" value="Enviar"></input>
          </form>
          {formStatus && <p>{formStatus}</p>}
        </div>
      </section>
      <Footer />
    </section>
  );
};

export default Formulario;
