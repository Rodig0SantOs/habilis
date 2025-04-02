export async function uploadFileToImgBB(file) {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(
      "https://api.imgbb.com/1/upload?key=0bc8b8df44f95b413207c043c97fa31c",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao enviar arquivo: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);

    if (!data.success) {
      throw new Error(
        `Erro na API imgBB: ${data.error?.message || "Erro desconhecido"}`
      );
    }

    return {
      url: data.data.display_url, // Alterado para usar display_url
      name: file.name,
    };
  } catch (error) {
    console.error("Erro no upload:", error);
    throw error;
  }
}
