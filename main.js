const form = document.getElementById("myForm");
const today = new Date().toISOString().split("T")[0];
const time = new Date().toISOString().split("T")[1].split(":")[0];
const temperatureElement = document.getElementById("temperature");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const ville = document.getElementById("ville").value;

  fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${ville}&count=10&language=fr&format=json`
  )
    .then((response) => response.json())
    .then((data) => {
      // Traitement des données récupérées depuis l'API
      const villesLongitude = data.results[0].longitude;
      const villesLatitude = data.results[0].latitude;
      const latitude = villesLatitude;
      const longitude = villesLongitude;
      const nomVille = document.getElementById("nomVille");

      nomVille.innerHTML = `${data.results[0].admin4} , ${data.results[0].country}`;

      fetch(
        `https://api.open-meteo.com/v1/meteofrance?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m`
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

          texcontent;
          console.error(error);
        });
    })
    .catch((error) => {
      // Gestion des erreurs
      console.error(error);
    });
});
