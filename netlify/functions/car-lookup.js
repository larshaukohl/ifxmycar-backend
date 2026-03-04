const https = require("https");
const http = require("http");

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

    // Brug fetch i stedet for https.get
    const apiUrl = `https://api.motorapi.dk/vehicles/${plate}`;
    console.log("Kalder:", apiUrl);

    fetch(apiUrl, {
      headers: {
        "X-Api-Key": process.env.MOTORAPI_KEY,
        "Accept": "application/json"
      }
    })
    .then(r => {
      console.log("Status:", r.status, "OK:", r.ok);
      return r.text();
    })
    .then(data => {
      console.log("Data:", data);
      res.writeHead(200);
      res.end(data);
    })
    .catch(err => {
      console.error("Fetch fejl:", err.message);
      res.writeHead(500);
      res.end(JSON.stringify({ error: err.message }));
    });

  } catch (err) {
    console.error("Server fejl:", err.message);
    res.writeHead(500);
    res.end(JSON.stringify({ error: err.message }));
  }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, "0.0.0.0", () => console.log(`Server kører på port ${PORT}`));
