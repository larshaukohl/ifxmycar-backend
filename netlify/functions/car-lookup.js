const https = require("https");
const http = require("http");

exports.handler = async (event) => {
  const plate = event.queryStringParameters?.plate;
  
  if (!plate) {
    return { 
      statusCode: 400, 
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Mangler nummerplade" }) 
    };
  }

  const agent = new https.Agent({ rejectUnauthorized: false });

  return new Promise((resolve) => {
    const options = {
      hostname: "api.motorapi.dk",
      path: `/vehicles/${plate}`,
      agent: agent,
      headers: { 
        "X-Api-Key": process.env.MOTORAPI_KEY,
        "Accept": "application/json"
      }
    };

    https.get(options, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve({
        statusCode: res.statusCode,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: data
      }));
    }).on("error", (err) => resolve({
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message })
    }));
  });
};
