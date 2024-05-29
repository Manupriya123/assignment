export const loadJsonFromPublic = async (): Promise<any> => {
    const response = await fetch(`${process.env.PUBLIC_URL}/Manufac_India_Agro_Dataset.json`);
    if (!response.ok) {
      throw new Error('Failed to load JSON data');
    }
    const data = await response.json();
    return data;
  };
  