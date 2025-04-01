const clientId = '570a68bc7060457cad8398d516a0b5e7';
const clientSecret = '2fc540e6df00481e835262859197876a';

// Function to get Spotify access token
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

// Function to get top 20 artists in the Netherlands and display them in the HTML
async function getTopArtistsInNetherlands() {
    try {
        const accessToken = await getAccessToken();

        // Fetch featured playlists
        const response = await fetch('https://api.spotify.com/v1/browse/featured-playlists', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch playlists: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        const netherlandsTopPlaylist = data.playlists.items.find(playlist => playlist.name.toLowerCase().includes('netherlands'));

        if (!netherlandsTopPlaylist) {
            console.log('No top playlist found for the Netherlands.');
            return;
        }

        // Fetch tracks from the playlist
        const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${netherlandsTopPlaylist.id}/tracks`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!playlistResponse.ok) {
            throw new Error(`Failed to fetch playlist tracks: ${playlistResponse.status} - ${playlistResponse.statusText}`);
        }

        const playlistData = await playlistResponse.json();
        const topArtists = playlistData.items
            .map(item => item.track.artists[0].name)
            .slice(0, 20);

        // Display the artists in the HTML
        const artistList = document.getElementById('artist-list');
        artistList.innerHTML = ''; // Clear any existing content

        topArtists.forEach(artist => {
            const listItem = document.createElement('li');
            listItem.textContent = artist;
            artistList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Function to get new releases globally and display their artists in the HTML using Bootstrap cards
async function getGlobalNewReleases() {
    try {
        const accessToken = await getAccessToken();

        // Fetch new releases
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

        // Extract unique artists from the new releases
        const artists = newReleases
            .flatMap(album => album.artists.map(artist => ({
                name: artist.name,
                image: album.images[0]?.url || 'https://via.placeholder.com/150', // Use album image or placeholder
                album: album.name
            })))
            .filter((artist, index, self) => self.findIndex(a => a.name === artist.name) === index) // Remove duplicates
            .slice(0, 20); // Limit to top 20 artists

        // Display the artists in the HTML using Bootstrap cards
        const artistList = document.getElementById('artist-list');
        artistList.innerHTML = ''; // Clear any existing content

        artists.forEach(artist => {
            const card = document.createElement('div');
            card.className = 'col-md-4'; // Bootstrap column class
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

// Call the function to get global new releases
getGlobalNewReleases();