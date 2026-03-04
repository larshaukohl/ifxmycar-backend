exports.handler = async (event) => {
  const plate = event.queryStringParameters?.plate;
  const apiKey = process.env.MOTORAPI_KEY;
  
  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ 
      plate: plate,
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey ? apiKey.length : 0
    })
  };
};
