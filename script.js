const requestURL = 'https://api-adresse.data.gouv.fr/search/?q=';
const select = document.getElementById("selection");
const mapboxToken = 'pk.eyJ1IjoiaGFyZGk5OSIsImEiOiJjbGNranJqOGUwNWZsM3dxbDJvOWk3emhqIn0.iwPN3pTr01FrOSX-fSDe0w';
let map;
let marker;

window.onload = () => {
    const adresseInput = document.getElementById("adresse");
    adresseInput.addEventListener("input", autocompleteAdresse, false);
    initializeMap();
};

const displaySelection = (response) => {
    if (response.features.length > 0) {
        select.style.display = "block";
        select.innerHTML = ''; // Effacer les anciennes suggestions

        const ul = document.createElement('ul');
        select.appendChild(ul);

        console.log(response.features)

        response.features.forEach((element) => {
            const li = document.createElement('li');
            const ligneAdresse = document.createElement('span');
            ligneAdresse.innerHTML = element.properties.name;
            
            const infosAdresse = document.createTextNode(`${element.properties.postcode} ${element.properties.city}`);
            
            li.onclick = () => selectAdresse(element);
            li.appendChild(ligneAdresse);
            li.appendChild(infosAdresse);
            ul.appendChild(li);
        });
    } else {
        select.style.display = "none";
    }
};

const autocompleteAdresse = async () => {
    const inputValue = document.getElementById("adresse").value;
    console.log(inputValue)
    if (inputValue && inputValue.length > 3 && inputValue.length <= 200) {
        try {
            const response = await fetch(setQuery(inputValue));
            const data = await response.json();
            displaySelection(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des suggestions:', error);
        }
    } else {
        select.style.display = "none";
    }
};

const selectAdresse = (element) => {
    document.getElementById("adresse").value = element.properties.label;
    select.style.display = "none";
    document.getElementById("resAdresse").value = element.properties.name;
    document.getElementById("CP").value = element.properties.postcode;
    document.getElementById("Ville").value = element.properties.city;

    updateMap(element.geometry.coordinates);
};

const setQuery = (value) => `${requestURL}${value}&type=housenumber&limit=10`;

// Initialisation de la carte
const initializeMap = () => {
    mapboxgl.accessToken = mapboxToken;
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        zoom: 15,
        center: [2.3522, 48.8566] // Centrer la carte initialement sur Paris
    });

    marker = new mapboxgl.Marker({
        color: 'red'
    });
};

// Mise à jour de la carte et du marqueur
const updateMap = (coordinates) => {
    if (map && marker) {
        map.setCenter(coordinates);
        marker.setLngLat(coordinates).addTo(map);
    }
};

// Masquer le menu déroulant lorsque le champ de saisie perd le focus
const hideDropdown = () => {
    setTimeout(() => { select.style.display = "none"; }, 100); // Ajouter un léger délai pour permettre le clic sur les suggestions
};

// Afficher le menu déroulant lorsque le champ de saisie obtient le focus
const showDropdown = () => {
    const inputValue = document.getElementById("adresse").value;
    if (inputValue && select.innerHTML !== '') {
        select.style.display = "block";
    }
};