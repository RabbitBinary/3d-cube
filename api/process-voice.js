export const handler = async (event) => {
  // Hlavičky pre CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Vždy vrátime úspešnú odpoveď s testovacou správou
  // Tento príkaz by mal zafarbiť kocku 1 na zeleno
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ 
      action: "setColor", 
      target: "Cube01", 
      axis: null, 
      value: "green" 
    })
  };
};