/******* 
  Application state data
*********/
let data = new Map([]);
let songQueueList = [];
let songHistoryList = [];
let songCollectionList = [];
let searchCategory = "all";
/******* 
  fetching data
*********/
import {
    getPopularArtist,
    getTopAlbums,
    getTopTracks,
    getTopPlaylist,
    searchSong,
    getAlbumTracks,
    getArtistTracks,
} from "./api.js";
const getHomePageData = async () => {
    const tracks = await getTopTracks();
    const artists = await getPopularArtist();
    const albums = await getTopAlbums();
    const playlists = await getTopPlaylist();
    return {
        tracks,
        artists,
        albums,
        playlists,
    };
};

/******* 
  html elements selectors
*********/

const homeLink = document.getElementById("home-link");
const collectionLink = document.getElementById("collection-link");
const searchLink = document.getElementById("search-link");
const pageContainer = document.getElementById("page-container");
const homePage = document.getElementById("home-page");
const collectionPage = document.getElementById("collection-page");
const searchPage = document.getElementById("search-page");
const homeLoader = document.getElementById("home-loader");
const collectionLoader = document.getElementById("collection-loader");
const searchLoader = document.getElementById("search-loader");
const homePageContent = document.getElementById("home-page-content");
const collectionPageContent = document.getElementById(
    "collection-page-content"
);
const searchPageContent = document.getElementById("search-page-content");
const topTracksContainer = document.getElementById("top-tracks-container");
const topAlbumsContainer = document.getElementById("top-albums-container");
const topArtistsContainer = document.getElementById("top-artists-container");
const topPlaylistsContainer = document.getElementById(
    "top-playlists-container"
    );
const songCollectionListContainer = document.getElementById("collection-page-content");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

const searchResultSongs = document.getElementById("search-result-songs");
const searchResultAlbums = document.getElementById("search-result-albums");
const searchResultArtists = document.getElementById("search-result-artists");
/******* 
  page router
*********/

(() => {
    homeLink.addEventListener("click", (e) => {
        homeLink.classList.add("active-link");
        collectionLink.classList.remove("active-link");
        searchLink.classList.remove("active-link");
        collectionPage.classList.add("hide-page");
        searchPage.classList.add("hide-page");
        homePage.classList.remove("hide-page");
    });
    collectionLink.addEventListener("click", (e) => {
        collectionLink.classList.add("active-link");
        homeLink.classList.remove("active-link");
        searchLink.classList.remove("active-link");
        homePage.classList.add("hide-page");
        searchPage.classList.add("hide-page");
        collectionPage.classList.remove("hide-page");
    });
    searchLink.addEventListener("click", (e) => {
        searchLink.classList.add("active-link");
        homeLink.classList.remove("active-link");
        collectionLink.classList.remove("active-link");
        homePage.classList.add("hide-page");
        collectionPage.classList.add("hide-page");
        searchPage.classList.remove("hide-page");
    });
})();

/******* 
  render home page
*********/

const renderHomePage = async () => {
    const { tracks, artists, albums, playlists } = await getHomePageData();
    renderTracks(topTracksContainer, await tracks.data);
    renderArtists(topArtistsContainer, await artists.data);
    renderAlbums(topAlbumsContainer, await albums.data);
    homeLoader.classList.add("hide");
    homePageContent.classList.remove("hide");
};

async function renderTracks(container, tracksList) {
    const { tracks } = tracksList;
    tracks.forEach((track) => {
        container.append(getCardElement(track));
    });
}
function renderAlbums(container, albumList) {
    const { albums } = albumList;
    albums.forEach(async (album) => {
        let albumElement = await getAlbum(album);
        container.append(albumElement);
    });
}

async function renderArtists(container, artistList) {
    const { artists } = artistList;
    artists.forEach(async (artist) => {
        let artistElement = await getArtist(artist);
        container.append(artistElement);
    });
}

async function getArtist(artist) {
    const {
        links: {
            topTracks: { href: link },
        },
    } = artist;
    const artistFragment = await createArtistFragment(link);
    return artistFragment;
}
async function getAlbum(album) {
    const {
        links: {
            tracks: { href: link },
        },
    } = album;
    const albumFragment = await createAlbumFragment(link);
    return albumFragment;
}

async function createArtistFragment(link) {
    const { data, error } = await getArtistTracks(link);
    const { tracks } = await data;

    const container = document.createElement("div");
    container.classList.add("individual-artist");
    tracks.forEach(async (track) => {
        const trackCard = await getCardElement(track);
        container.append(trackCard);
    });
    return container;
}

async function createAlbumFragment(link) {
    const { data, error } = await getAlbumTracks(link);
    const { tracks } = await data;

    const container = document.createElement("div");
    container.classList.add("individual-album");
    tracks.forEach(async (track) => {
        const trackCard = await getCardElement(track);
        container.append(trackCard);
    });
    return container;
}

function getCardElement(track) {
    data.set(track.id, track);
    const template = document.createElement("template");
    template.innerHTML = `
    <div class='track-card'>
        <img class='track-image' src='' alt=''>
        <div class='track-card-content'>
            <h3 class='track-title'></h3>
            <button data-action='play' data-id='' class='play'><img src='./images/play-button.png' alt=''></button>
            <button data-action='playlist' data-id='' class='add-to-playlist'><img src='./images/playlist.png' alt=''></button>
            <button data-action='queue' data-id='' class='add-to-queue'><img src='./images/queue.png' alt=''></button>
        </div>
    </div>
    `;
    const element = template.content.cloneNode(true);
    element.querySelector(
        ".track-image"
    ).src = `https://api.napster.com/imageserver/v2/albums/${track.albumId}/images/500x500.jpg`;
    element.querySelector(".track-title").innerText = track.name;
    const playButton = element.querySelector(".play");
    const queueButton = element.querySelector(".add-to-playlist");
    const playlistButton = element.querySelector(".add-to-queue");
    playButton.dataset.id = track.id;
    queueButton.dataset.id = track.id;
    playlistButton.dataset.id = track.id;
    playButton.addEventListener("click", (e) => {
        // console.log(track.id);
        // songQueueList.unshift(data.get(track.id));
        songQueueList[0] = data.get(track.id);
        renderQueue()
        playSong(songQueueList[0])
    });
    queueButton.addEventListener("click", (e) => {
        addSongToQueue(data.get(track.id));
    });
    playlistButton.addEventListener("click", (e) => {
        addSongToPlaylist(data.get(track.id));
    });
    return element;
}

function renderCollectionPage() {
    songCollectionListContainer.innerHTML = "";
    console.log("current playlist list", songCollectionList);
    collectionLoader.classList.add("hide");
    songCollectionList.forEach((song,index) => {
        console.log(index);
        songCollectionListContainer.append(getCardElement(song));
    })
}

/**********
 * Evnet listner
 ***********/

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    searchLoader.classList.remove("hide");
    getSearchResult()
})

const getSearchResult = async() => {
    const {data, error} = await searchSong(searchInput.value, searchCategory);
    if(!error){
        let {search : {data : {albums, artists,tracks}}} = await data;
        console.log(albums, artists,tracks)
        renderSearchResult({albums, artists,tracks});
    }else{
        console.log("error fetching");
    }
}

/********
 * loading the app
 */
renderHomePage();
renderCollectionPage();

/********
 * setting up the audio player
 */

const audioElement = new Audio();


/******* 
  html audio elements selectors
*********/

const songNameElement = document.getElementById("current-song-name");
const songArtistElement = document.getElementById("current-song-artist");
const songImageElement = document.getElementById("current-song-image")
;
const currenltyPlayingContainer = document.getElementById("currently-playing");
const playingNextContainer = document.getElementById("playing-next");

const playButton = document.getElementById("audio-play");
const pauseButton = document.getElementById("audio-pause");
const skipForwardButton = document.getElementById("audio-forward");
const skipBackwardButton = document.getElementById("audio-backward");
const songTimeSeekBar = document.getElementById("audio-time");
const songVolumeSeekBar = document.getElementById("audio-volume");

let seekBarUpdateInterval;
audioElement.addEventListener("canplaythrough", (event) => {
/* the audio is now playable; play it if permissions allow */
    songTimeSeekBar.min = 0;
    songTimeSeekBar.max = audioElement.duration;
    songTimeSeekBar.step = 0.1; 
    audioElement.play();
    seekBarUpdateInterval = setInterval(updateSeekBar,50);
    playButton.classList.add("hide")
    pauseButton.classList.remove("hide");
    // when song is done playing clear the interval
});
audioElement.addEventListener("ended", () => {
    console.log("ended running");
    playButton.classList.add("hide")
    pauseButton.classList.remove("hide");
    let playedSong = songQueueList.shift();
    currenltyPlayingContainer.innerHTML = "";
    renderQueue();
    if(songQueueList.length === 0){
        songNameElement.textContent = "song name";
        songArtistElement.textContent = "artist name";
        songImageElement.src = "./images/profile.png";
        songTimeSeekBar.value = 0;
    }
})
playButton.addEventListener("click", (e) => {
    console.log("play")
    audioElement.play();
    playButton.classList.add("hide")
    pauseButton.classList.remove("hide");
})
pauseButton.addEventListener("click", (e) => {
    console.log("pause")
    audioElement.pause();
    playButton.classList.remove("hide")
    pauseButton.classList.add("hide");
})
skipBackwardButton.addEventListener("click", () => {
    let newValue = audioElement.currentTime - 5;
    if(newValue <= 0) newValue = 0;
    if(newValue > audioElement.duration) newValue = duration;
    audioElement.currentTime = newValue;
})
skipForwardButton.addEventListener("click", () => {
    let newValue = audioElement.currentTime + 5;
    if(newValue >= audioElement.duration) newValue = duration;
    audioElement.currentTime = newValue;
})
songTimeSeekBar.addEventListener("input", (e) => {
    audioElement.currentTime = e.target.value;
})
songVolumeSeekBar.addEventListener('input', (e) => {
    console.log(audioElement.volume, e.target.value)
    audioElement.volume = e.target.value;
});

function playSong(song){
    console.log(song);
    audioElement.src = song.previewURL;
    songNameElement.textContent = song.name;
    songArtistElement.textContent = song.artistName;
    songImageElement.src = `https://api.napster.com/imageserver/v2/albums/${song.albumId}/images/500x500.jpg`;
}

function updateSeekBar(){
    songTimeSeekBar.value = audioElement.currentTime;
}
function addSongToQueue(song){
    songQueueList.push(song);
    renderQueue()
}
function renderQueue(){
    if(!currenltyPlayingContainer.firstChild && songQueueList.length > 0){
        playSong(songQueueList[0]);
    }
    currenltyPlayingContainer.innerHTML = "";
    playingNextContainer.innerHTML = "";
    songQueueList.forEach((song,index) => {
        const template = document.createElement("template");
        template.innerHTML = `
        <div class='song-queue-song-card'>
            <img class='song-image' src='' alt=''>
            <div class='song-queue-song-card-content'>
                <p class='song-title'></p>
                <p class='song-artist'></p>
                <p class='song-duration'>30s</p>
                <img src='./images/play-button.png' alt=''>
            </div>
        </div>
        `;
        // ${index === 0 ? "<img src='./images/play-button.png' alt=''>" : ""}
        const element = template.content.cloneNode(true);
        element.querySelector(
            ".song-image"
        ).src = `https://api.napster.com/imageserver/v2/albums/${song.albumId}/images/500x500.jpg`;
        element.querySelector(".song-title").innerText = song.name;
        element.querySelector(".song-artist").innerText = song.artistName;
        
        if(index === 0 ){
            currenltyPlayingContainer.append(element)
        }else{
            playingNextContainer.append(element);
        }
        
    })
    
}
function addSongToPlaylist(song){
    songCollectionList.push(song);
    renderCollectionPage();
}

function filterSearchResult(current){

}

function renderSearchResult({albums, artists,tracks}){
    searchLoader.classList.add("hide");
    searchResultAlbums.innerHTML = "";
    searchResultArtists.innerHTML = "";
    searchResultSongs.innerHTML="";
    if(albums && albums.length > 0){
        const title = document.createElement('h2');
        title.textContent = "Albums matching the query"
        searchResultAlbums.insertAdjacentElement("beforebegin",title);
        renderAlbums(searchResultAlbums,{albums})
    }
    if(artists && artists.length > 0){
        const title = document.createElement('h2');
        title.textContent = "artists matching the query"
        searchResultArtists.insertAdjacentElement("beforebegin",title);
        renderArtists(searchResultArtists,{artists})
    }
    if(tracks && tracks.length > 0){
        const title = document.createElement('h2');
        title.textContent = "songs matching the query"
        searchResultSongs.insertAdjacentElement("beforebegin",title);
        renderTracks(searchResultSongs,{tracks})
    }
}

/***************
 *  search page router
 * *************/
// getSearchResult
const allSearchLink = document.getElementById("search-all-link");
const tracksSearchLink = document.getElementById("search-tracks-link");
const artistsSearchLink = document.getElementById("search-artists-link");
(() => {
    allSearchLink.addEventListener("click", (e) => {
        e.preventDefault();
        allSearchLink.classList.add("selected")
        tracksSearchLink.classList.remove("selected")
        artistsSearchLink.classList.remove("selected")
        searchCategory = "all";
        getSearchResult()
    });
    tracksSearchLink.addEventListener("click", (e) => {
        e.preventDefault();
        tracksSearchLink.classList.add("selected")
        allSearchLink.classList.remove("selected")
        artistsSearchLink.classList.remove("selected")
        searchCategory = "album";
        getSearchResult()
    });
    artistsSearchLink.addEventListener("click", (e) => {
        e.preventDefault();
        artistsSearchLink.classList.add("selected")
        allSearchLink.classList.remove("selected")
        tracksSearchLink.classList.remove("selected")
        searchCategory = "artist";
        getSearchResult()
    });
})();