const form = document.getElementById("myForm");
const today = new Date().toISOString().split("T")[0];
const time = new Date().toISOString().split("T")[1].split(":")[0];
const temperatureElement = document.getElementById("temperature");
const villeInput = document.getElementById("ville");
const selection = document.getElementById("villeSelection");
const nomVille = document.getElementById("nomVille");
let tableauVilles = [];

villeInput.addEventListener("input", function (e) {
  const ville = document.getElementById("ville").value;
  selection.innerHTML = "";
  selection.innerHTML = "<option>Choisir votre lieux</option>";
  if (ville.length > 3) {
    fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${ville}&count=10&language=fr&format=json`
    )
      .then((response) => response.json())
      .then((data) => {
        tableauVilles = data.results;
        // Traitement des données récupérées depuis l'API
        data.results.forEach((ville, index) => {
          selection.innerHTML +=
            "<option value=" +
            index +
            ">" +
            ville.name +
            ", " +
            ville.country +
            "</option>";
        });
      })
      .catch((error) => {
        // Gestion des erreurs
        console.error(error);
      });
  }
});

selection.addEventListener("change", function (e) {
  const ville = tableauVilles[e.target.value];
  const longitude = ville.longitude;
  const latitude = ville.latitude;
  nomVille.innerHTML = ville.name + ", " + ville.country;

  fetch(
    `https://api.open-meteo.com/v1/meteofrance?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m`
  )
    .then((response) => response.json())
    .then((data) => {
      // Traitement des données récupérées depuis l'API
      const dates = data.hourly.time;
      const temperatures = data.hourly.temperature_2m;
      const humidites = data.hourly.relativehumidity_2m;

      // Parcourir les données
      dates.forEach((date, index) => {
        const currentDate = date.split("T")[0];
        const currentTime = date.split("T")[1].split(":")[0];
        if (currentDate === today && currentTime === time) {
          const temperature = temperatures[index];
          const humidite = humidites[index];
          temperatureElement.innerHTML = `Température : ${temperature}°C <br> Taux d'humidité : ${humidite} %`;
          /*  console.log(
                `Date: ${currentDate} à ${currentTime} h (GMT), Temperature: ${temperature} Taux d'humidités : ${humidite} %`
              ); */
        }
      });
    })
    .catch((error) => {
      // Gestion des erreurs
      console.error(error);
    });
});
