const API_TOKEN="abee8f7e52feda7ef51131dd9a2b75da"

export function getFilmsFromApiWithSearchedText (text, page) {
    const url = 'https://api.themoviedb.org/3/search/movie?api_key=' + API_TOKEN + '&language=fr&query=' + text +
        '&page=' + page
    return fetch (url)
        .then((response) => response.json())
        .catch((error) => console.log(error))
}

export function getImageFromAPI (name) {
    return 'https://image.tmdb.org/t/p/w300' + name
}
