/* eslint-disable no-undef */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json()); // Para JSON
app.use(express.urlencoded({ extended: true })); // Para form-data

const API_KEY = process.env.API_KEY_SECRET;

app.post('/api/report-incident', async (req, res) => {
  try {
    const formData = req.body;

    // Validação básica
    if (!formData.data_hora || !formData.descricao) {
      return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

    // Mapear campos do formulário para o formato esperado pela API externa
    const opportunityData = {
      apiKey: API_KEY,
      nomeDenunciante: formData.nome || "Anônimo",
      contato: formData.email,
      dataHoraIncidente: formData.data_hora,
      descricao: formData.descricao,
      ativosImpactados: formData.ativos,
      impactoOperacional: formData.impacto,
      acoesMitigacao: formData.mitigacao,
      causaProvavel: formData.causa,
      anonimo: formData.anonimo === "sim",
      confirmacaoVeracidade: formData.confirmacao === "sim",
      // Anexos precisariam de tratamento adicional se a API aceitar
    };

    const response = await axios.post(
      'https://suportehabilis.atenderbem.com/webhookcapture/capture/186216716d1c4b25b8d93ddfd6e894f6 ',
      opportunityData,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Erro no servidor:', error.message);
    res.status(500).json({ 
      error: "Erro ao processar a solicitação",
      details: error.response?.data || error.message 
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));