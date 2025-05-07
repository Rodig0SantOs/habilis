// src/services/apiService.js
export const sendOpportunityData = async (opportunityData) => {
  try {
    const response = await fetch(
      "https://suportehabilis.atenderbem.com/webhookcapture/capture/186216716d1c4b25b8d93ddfd6e894f6",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(opportunityData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro HTTP: ${response.status} - ${errorText}`);
    }

    const responseText = await response.text();
    return responseText ? JSON.parse(responseText) : {};
  } catch (error) {
    console.error("Erro no serviço de API:", error);
    throw error;
  }
};