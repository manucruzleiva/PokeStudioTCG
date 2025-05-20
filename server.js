const express = require("express");
const fs = require("fs");
const axios = require("axios");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));

app.post("/update", (req, res) => {
  const { tipo, contenido } = req.body;
  const ruta = path.join(__dirname, "obs", `${tipo}.txt`);
  fs.writeFileSync(ruta, contenido);
  res.sendStatus(200);
});

app.get("/buscar-carta", async (req, res) => {
  const nombre = req.query.nombre;
  try {
    const resp = await axios.get(`https://api.pokemontcg.io/v2/cards?q=name:"${encodeURIComponent(nombre)}"`, {
      headers: { 'X-Api-Key': 'f05f0a9f-e3db-4a8b-9ffa-446054f3410b' }
    });
    const img = resp.data?.data?.[0]?.images?.large;
    if (img) {
      const carta = await axios.get(img, { responseType: "arraybuffer" });
      fs.writeFileSync(path.join(__dirname, "obs", "carta.jpg"), carta.data);
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
