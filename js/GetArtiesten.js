const clientId = '570a68bc7060457cad8398d516a0b5e7';
const clientSecret = '2fc540e6df00481e835262859197876a';

// Function voor het ophalen van de access token
async function getAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch access token: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
}

// Fubnctie voor het ophalen van de nieuwe releases
async function getGlobalNewReleases() {
    try {
        const accessToken = await getAccessToken();

        // nieuwe releases ophalen
        const response = await fetch('https://api.spotify.com/v1/browse/new-releases', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch new releases: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        const newReleases = data.albums.items;

        // unieke artiesten ophalen
        const artists = newReleases
            .flatMap(album => album.artists.map(artist => ({
                name: artist.name,
                image: album.images[0]?.url || 'https://via.placeholder.com/150', // album foto
                album: album.name
            })))
            .filter((artist, index, self) => self.findIndex(a => a.name === artist.name) === index) // verwijder dubbele artiesten
            .slice(0, 20); // max 20 artiesten

        // laat de artiesten zien in een bootstrap grid
        const artistList = document.getElementById('artist-list');
        artistList.innerHTML = ''; // leeg de lijst voordat je nieuwe artiesten toevoegt

        artists.forEach(artist => {
            const card = document.createElement('div');
            card.className = 'col-md-4';
            card.innerHTML = `
                <div class="card mb-4">
                    <img src="${artist.image}" class="card-img-top" alt="${artist.name}">
                    <div class="card-body">
                        <h5 class="card-title">${artist.name}</h5>
                        <p class="card-text">Album: ${artist.album}</p>
                    </div>
                </div>
            `;
            artistList.appendChild(card);
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

getGlobalNewReleases();