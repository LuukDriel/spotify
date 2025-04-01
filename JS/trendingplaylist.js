const fetch = require('node-fetch');

const clientId = '570a68bc7060457cad8398d516a0b5e7';
const clientSecret = '2fc540e6df00481e835262859197876a';

const getToken = async () => {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'grant_type': 'client_credentials'
        })
    });

    const data = await response.json();
    return data.access_token;
};

const getTrendingPlaylists = async (token) => {
    const response = await fetch('https://api.spotify.com/v1/browse/categories/pop/playlists', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    const data = await response.json();
    return data.playlists.items;
};

const getPlaylistTracks = async (playlistId, token) => {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    const data = await response.json();
    return data.items;
};

const displayTrendingSongs = async () => {
    const token = await getToken();
    const playlists = await getTrendingPlaylists(token);

    const playlistsSection = document.getElementById('playlists');
    playlistsSection.innerHTML = ''; // Clear existing content

    for (const playlist of playlists) {
        const playlistElement = document.createElement('article');
        playlistElement.classList.add('playlist');

        const playlistTitle = document.createElement('h2');
        playlistTitle.textContent = playlist.name;

        const playlistDescription = document.createElement('p');
        playlistDescription.textContent = playlist.description || 'No description available.';

        playlistElement.appendChild(playlistTitle);
        playlistElement.appendChild(playlistDescription);

        const tracks = await getPlaylistTracks(playlist.id, token);
        const trackList = document.createElement('ul');

        tracks.forEach(track => {
            const trackItem = document.createElement('li');
            trackItem.textContent = `${track.track.name} by ${track.track.artists.map(artist => artist.name).join(', ')}`;
            trackList.appendChild(trackItem);
        });

        playlistElement.appendChild(trackList);
        playlistsSection.appendChild(playlistElement);
    }
};

displayTrendingSongs();