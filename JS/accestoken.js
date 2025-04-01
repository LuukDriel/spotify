document.getElementById('fetchToken').addEventListener('click', async () => {
    const clientId = '570a68bc7060457cad8398d516a0b5e7';
    const clientSecret = '2fc540e6df00481e835262859197876a';
    const tokenUrl = 'https://accounts.spotify.com/api/token';

    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });

    if (response.ok) {
        const data = await response.json();
        document.getElementById('tokenDisplay').innerText = `Access Token: ${data.access_token}`;
    } else {
        document.getElementById('tokenDisplay').innerText = 'Failed to fetch access token.';
    }
});