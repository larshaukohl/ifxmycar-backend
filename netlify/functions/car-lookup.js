const https = require("https");
const http = require("http");

const agent = new https.Agent({ rejectUnauthorized: false });

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const plate = url.searchParams.get("plate");

    if (!plate) {
      res.writeHead(200);
      res.end(JSON.stringify({ status: "FixMyCar API virker!", usage: "?plate=DINPLADE" }));
      return;
    }

    const apiKey = process.env.MOTORAPI_KEY;
    console.log("Plate:", plate, "HasKey:", !!apiKey);

    const options = {
      hostname: "api.motorapi.dk",
      path: `/vehicles/${plate}`,
      agent: agent,
      headers: {
        "X-Api-Key": apiKey,
        "Accept": "application/json"
      }
    };

    const apiReq = https.get(options, (apiRes) => {
      let data = "";
      apiRes.on("data", chunk => data += chunk);
      apiRes.on("end", () => {
        console.log("API svar:", apiRes.statusCode, data);
        res.writeHead(apiRes.statusCode);
        res.end(data);
      });
    });

    apiReq.on("error", (err) => {
      console.error("API fejl:", err.message, err.code);
      res.writeHead(500);
      res.end(JSON.stringify({ error: err.message, code: err.code }));
    });

    apiReq.setTimeout(10000, () => {
      console.error("Timeout!");
      apiReq.destroy();
      res.writeHead(500);
      res.end(JSON.stringify({ error: "Timeout" }));
    });

  } catch (err) {
    console.error("Server fejl:", err.message);
    res.writeHead(500);
    res.end(JSON.stringify({ error: err.message }));
  }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, "0.0.0.0", () => console.log(`Server kører på port ${PORT}`));
