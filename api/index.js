const axios = require("axios");
const server = require("./src/app.js");
const { conn } = require("./src/db.js");
const { Country } = require("./src/db.js");
// const { DB_URL } = process.env;

// Syncing all the models at once.
conn.sync({ force: false }).then(async () => {
  try {
    const countriesAllApi = await axios.get("https://restcountries.com/v3/all");
    const apiInfo = await countriesAllApi.data.map((e) => {
      return {
        name: e.name.common || "No se ha encontrado el nombre de este país",
        id: e.cca3 || e.cioc || "No se ha encontrado el código de este país",
        flags:
          e.flags.find((e) => e.includes("png")) || "No se ha encontrado la",
        continent: e.region || "No se ha encontrado el continente de este país",
        capital:
          (e.capital && e.capital[0]) || "Este país no tiene una capital",
        subregion: e.region || "No se ha encontrado la región de este pais",
        population: e.population || 0,
        area: e.area || 0,
      };
    });
    await Country.bulkCreate(apiInfo);
    console.log("Conectado a la BD");
  
  } catch (error) {
    console.log(error);
  }
  server.listen(process.env.PORT || 3001, () => {
    console.log("%s listening at 3001");
  });
});

//Borrador index
// const server = require("./src/app.js");
// const { conn } = require("./src/db.js");

// // Syncing all the models at once.
// conn.sync({ force: false }).then(() => {
//   server.listen(3001, () => {
//     console.log("%s listening at 3001"); // eslint-disable-line no-console
//   });
// });
