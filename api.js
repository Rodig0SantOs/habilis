/* eslint-disable no-undef */
// api.js - Arquivo para centralizar as chamadas à API
import axios from 'axios';

const API_URL = 'https://api.mailgrid.net.br/';
const TOKEN = 'de735bbbbd47c1c5b32a1e6a99edcc1d';

export const checkDomain = async (domain) => {
  try {
    const response = await axios.post(
      `${API_URL}domain/check/`,
      { dominio: domain },
      {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao verificar domínio:', error);
    throw error;
  }
};

export const sendEmail = async (emailData) => {
  try {
    const response = await axios.post(
      `${API_URL}send/`,
      emailData,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        maxRedirects: 10,
        timeout: 0,
        httpAgent: new (require('http').Agent)({ keepAlive: true })
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw error;
  }
};