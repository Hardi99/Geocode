const requestURL = 'https://api-adresse.data.gouv.fr/search/?q=';
const select = document.getElementById("selection");
const mapboxToken = 'pk.eyJ1IjoiaGFyZGk5OSIsImEiOiJjbGNranJqOGUwNWZsM3dxbDJvOWk3emhqIn0.iwPN3pTr01FrOSX-fSDe0w';
let map, marker;

window.onload = () => {
  const adresseInput = document.getElementById("adresse");
  adresseInput.addEventListener("input", autocompleteAdresse);
  initializeMap();

  // Gestion de la fermeture du menu déroulant au clic en dehors
  document.addEventListener('click', (event) => {
    if (!select.contains(event.target) && event.target !== adresseInput) {
      select.style.display = "none";
    }
  });
};

const displaySelection = (features) => {
  select.innerHTML = ''; 
  if (features.length === 0) {
    select.style.display = "none";
    return;
  }

  const ul = document.createElement('ul');
  features.forEach(feature => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${feature.properties.name}</span> ${feature.properties.postcode} ${feature.properties.city}`;
    li.onclick = () => selectAdresse(feature);
    ul.appendChild(li);
  });
  select.appendChild(ul);
  select.style.display = "block";
};

const autocompleteAdresse = async () => {
  const inputValue = document.getElementById("adresse").value;
  if (inputValue.length < 3 || inputValue.length > 200) {
    select.style.display = "none";
    return;
  }

  try {
    const response = await fetch(setQuery(inputValue));
    const data = await response.json();
    displaySelection(data.features);
  } catch (error) {
    console.error('Erreur :', error);
    // Gérer l'erreur utilisateur ici (ex: message d'erreur)
  }
};

const selectAdresse = (feature) => {
  document.getElementById("adresse").value = feature.properties.label;
  document.getElementById("resAdresse").value = feature.properties.name;
  document.getElementById("CP").value = feature.properties.postcode;
  document.getElementById("Ville").value = feature.properties.city;
  select.style.display = "none";
  updateMap(feature.geometry.coordinates);
};

const setQuery = (value) => `${requestURL}${value}&type=housenumber&limit=10`;

const initializeMap = () => {
  mapboxgl.accessToken = mapboxToken;
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom: 15,
    center: [2.3522, 48.8566] 
  });
  marker = new mapboxgl.Marker({ color: 'red' });
};

const updateMap = (coordinates) => {
  map.setCenter(coordinates);
  marker.setLngLat(coordinates).addTo(map);
};