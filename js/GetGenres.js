// File: /c:/xampp/htdocs/spotify/js/GetGenres.js

const clientId = '570a68bc7060457cad8398d516a0b5e7';
const clientSecret = '2fc540e6df00481e835262859197876a';

// Function to get Spotify access token
async function getAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
        },
        body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch access token: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
}

// Function to fetch all categories
async function getCategories(accessToken, locale = 'en_US', limit = 20, offset = 0) {
    const response = await fetch(`https://api.spotify.com/v1/browse/categories?locale=${locale}&limit=${limit}&offset=${offset}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.categories.items; // Return the list of categories
}

// Function to fetch songs for a specific genre
async function getSongsByGenre(accessToken, genre) {
    const response = await fetch(`https://api.spotify.com/v1/recommendations?seed_genres=${genre}&limit=20`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch songs for genre ${genre}: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.tracks; // Return the list of tracks
}

// Mapping of category IDs or names to valid genre names
const categoryToGenreMap = {
    "pop": "pop",
    "rock": "rock",
    "hip-hop": "hip-hop",
    "jazz": "jazz",
    "classical": "classical",
    "electronic": "electronic",
    "country": "country",
    "blues": "blues",
    "reggae": "reggae",
    "soul": "soul",
    "party": "dance",
    "workout": "workout",
    "chill": "chill",
    "mood": "mood",
    "rnb": "r-n-b",
    "indie": "indie",
    "k-pop": "k-pop",
    "afro": "afrobeat"
};

// List of valid genre seeds
const validGenreSeeds = [
    "pop", "rap", "rock", "urbano latino", "hip hop", "trap latino",
    "reggaeton", "dance pop", "pop rap", "modern rock", "pov: indie",
    "musica mexicana", "latin pop", "classic rock", "filmi", "permanent wave",
    "trap", "alternative metal", "k-pop", "r&b"
];

// Function to display categories dynamically in the HTML
async function displayCategories() {
    try {
        const accessToken = await getAccessToken();
        console.log('Access Token:', accessToken);

        const categories = await getCategories(accessToken);
        console.log('Categories:', categories);

        const genreContainer = document.getElementById('genre-list');
        genreContainer.innerHTML = ''; // Clear any existing content

        // Create a row container for the cards
        const row = document.createElement('div');
        row.className = 'row g-4'; // Bootstrap row with gutters

        for (const category of categories) {
            console.log(`Displaying category: ${category.id} (${category.name})`);

            // Create a column for the card
            const col = document.createElement('div');
            col.className = 'col-md-4'; // 3 cards per row on medium screens

            // Create a card for the category
            col.innerHTML = `
                <div class="card shadow-sm h-100">
                    <img src="${category.icons[0]?.url || 'https://via.placeholder.com/150'}" class="card-img-top" alt="${category.name}">
                    <div class="card-body">
                        <h5 class="card-title">${category.name}</h5>
                        <button class="btn btn-primary explore-btn" data-genre="${category.id}">Explore</button>
                    </div>
                </div>
            `;

            // Append the column to the row
            row.appendChild(col);
        }

        // Append the row to the container
        genreContainer.appendChild(row);

        // Add event listeners to all "Explore" buttons
        const exploreButtons = document.querySelectorAll('.explore-btn');
        exploreButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                const categoryId = event.target.getAttribute('data-genre');
                const genre = validGenreSeeds.find(seed => seed.toLowerCase() === categoryId.toLowerCase());

                if (!genre) {
                    console.error(`No valid genre seed found for category: ${categoryId}`);
                    alert(`Sorry, we couldn't find songs for the category "${categoryId}".`);
                    return;
                }

                console.log(`Fetching songs for genre: ${genre}`);
                try {
                    const songs = await getSongsByGenre(accessToken, genre);
                    displaySongs(songs, genre);
                } catch (error) {
                    console.error(`Error fetching songs for genre ${genre}:`, error.message);
                }
            });
        });
    } catch (error) {
        console.error('Error fetching data from Spotify API:', error.message);
    }
}

// Function to display songs dynamically in the HTML
function displaySongs(songs, genre) {
    const genreContainer = document.getElementById('genre-list');
    genreContainer.innerHTML = ''; // Clear the existing content

    const header = document.createElement('h2');
    header.className = 'text-center mb-4';
    header.textContent = `Top 20 Songs in ${genre}`;
    genreContainer.appendChild(header);

    const row = document.createElement('div');
    row.className = 'row g-4';

    songs.forEach(song => {
        const col = document.createElement('div');
        col.className = 'col-md-4';

        col.innerHTML = `
            <div class="card shadow-sm h-100">
                <img src="${song.album.images[0]?.url || 'https://via.placeholder.com/150'}" class="card-img-top" alt="${song.name}">
                <div class="card-body">
                    <h5 class="card-title">${song.name}</h5>
                    <p class="card-text">Artist: ${song.artists.map(artist => artist.name).join(', ')}</p>
                    <a href="${song.external_urls.spotify}" target="_blank" class="btn btn-primary">Listen on Spotify</a>
                </div>
            </div>
        `;

        row.appendChild(col);
    });

    genreContainer.appendChild(row);
}

// Call the function to fetch and display categories
displayCategories();