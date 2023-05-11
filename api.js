const API_KEY = "MWE1MjlmMzEtMjNiOC00NzU1LWI2MTYtZmMyZjUzYzUyOWIz";
export const getTopTracks = async () => {
    try{
        const fetchURL = `https://napi-v2-2-cloud-run-b3gtd5nmxq-uw.a.run.app/v2.2/tracks/top?apikey=${API_KEY}&limit=10`;
        const data = await fetch(fetchURL)
        return {data : data.json(), error : null};
    }catch(error){
        console.log(error)
        return  {data : null, error : error}
    } 
}

export const getAlbumTracks = async (link) => {
    try{
        const data = await fetch(`${link}?apikey=${API_KEY}`)
        return {data : data.json(), error : null};
    }catch(error){
        console.log(error)
        return  {data : null, error : error}
    } 
}
export const getPopularArtist = async () => {
    try{
        const fetchURL = `https://napi-v2-2-cloud-run-b3gtd5nmxq-uw.a.run.app/v2.2/artists/top?apikey=${API_KEY}&limit=10`;
        const data = await fetch(fetchURL)
        return {data : data.json(), error : null};
    }catch(error){
        console.log(error)
        return  {data : null, error : error}
    }
    
}
export const getTopPlaylist = async () => {
    try{
        const fetchURL = `https://napi-v2-2-cloud-run-b3gtd5nmxq-uw.a.run.app/v2.2/playlists/featured?apikey=${API_KEY}&limit=10`;
        const data = await fetch(fetchURL)
        return {data : data.json(), error : null};
    }catch(error){
        console.log(error)
        return  {data : null, error : error}
    }
    
}
export const getTopAlbums = async () => {
    try{
        const fetchURL = `https://napi-v2-2-cloud-run-b3gtd5nmxq-uw.a.run.app/v2.2/albums/new?apikey=${API_KEY}&limit=4`;
        const data = await fetch(fetchURL)
        return {data : data.json(), error : null};
    }catch(error){
        console.log(error)
        return  {data : null, error : error}
    }
}

export const searchSong = async (query, type) => {
    try{
        //  album, artist, track, tag, playlist.
        const fetchURL = "https://napi-v2-2-cloud-run-b3gtd5nmxq-uw.a.run.app/v2.2/search?apikey=${API_KEY}&per_type_limit=5"; 
        if(type && type !== "all")
            fetchURL += `&type=${type}`; 
        const data = await fetch(fetchURL)
        return {data : data.json(), error : null};
    }catch(error){
        console.log(error)
        return  {data : null, error : error}
    }
}
