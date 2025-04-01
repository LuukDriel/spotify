const clientId = '570a68bc7060457cad8398d516a0b5e7';
const clientSecret = '2fc540e6df00481e835262859197876a';

// Function to get Spotify access token
async function getAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret), // Use the correct variable names
        },
        body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch access token: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
}

// Function to fetch top global songs and display them dynamically
async function getTopSongsGlobal() {
    try {
        const accessToken = await getAccessToken();

        const response = await fetch('https://api.spotify.com/v1/browse/new-releases', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch top songs: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        const albums = data.albums.items;

        // Display the songs in the HTML
        const songList = document.getElementById('song-list');
        songList.innerHTML = ''; // Clear any existing content

        albums.forEach(album => {
            const card = document.createElement('div');
            card.className = 'col-md-4'; // Bootstrap column class
            card.innerHTML = `
                <div class="card mb-4 shadow-sm">
                    <img src="${album.images[0]?.url || 'https://via.placeholder.com/150'}" class="card-img-top" alt="${album.name}">
                    <div class="card-body">
                        <h5 class="card-title">${album.name}</h5>
                        <p class="card-text">Artist: ${album.artists.map(artist => artist.name).join(', ')}</p>
                        <a href="${album.external_urls.spotify}" target="_blank" class="btn btn-primary">Listen on Spotify</a>
                    </div>
                </div>
            `;
            songList.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching top songs:', error.message);
    }
}

// Call the function to fetch and display top songs
getTopSongsGlobal();