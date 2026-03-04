const https = require("https");
const http = require("http");

const agent = new https.Agent({ rejectUnauthorized: false });

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const plate = url.searchParams.get("plate");

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  if (!plate) {
    res.writeHead(200);
    res.end(JSON.stringify({ status: "FixMyCar API virker!", usage: "?plate=DINPLADE" }));
    return;
  }

  const options = {
    hostname: "api.motorapi.dk",
    path: `/vehicles/${plate}`,
    agent: agent,
    headers: {
      "X-Api-Key": process.env.MOTORAPI_KEY,
      "Accept": "application/json"
    }
  };

  https.get(options, (apiRes) => {
    let data = "";
    apiRes.on("data", chunk => data += chunk);
    apiRes.on("end", () => {
      res.writeHead(apiRes.statusCode);
      res.end(data);
    });
  }).on("error", (err) => {
    res.writeHead(500);
    res.end(JSON.stringify({ error: err.message }));
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, "0.0.0.0", () => console.log(`Server kører på port ${PORT}`));
