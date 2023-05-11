const data = new Map([]);
/******* 
  fetching data
*********/
import { getPopularArtist, getTopAlbums, getTopTracks, getTopPlaylist,searchSong } from "./api.js";
const getHomePageData = async () => {
    console.log("fetching data");
    const tracks = await getTopTracks()
    const artists = await getPopularArtist()
    const albums = await getTopAlbums();
    const playlists = await getTopPlaylist();
    return {
        tracks,
        artists,
        albums,
        playlists
    }
}

/******* 
  html elements selectors
*********/

const homeLink = document.getElementById("home-link");
const collectionLink = document.getElementById("collection-link");
const historyLink = document.getElementById("history-link");
const pageContainer = document.getElementById("page-container");
const homePage = document.getElementById("home-page");
const collectionPage = document.getElementById("collection-page");
const historyPage = document.getElementById("history-page");
const homeLoader = document.getElementById("home-loader");
const collectionLoader = document.getElementById("collection-loader");
const historyLoader = document.getElementById("history-loader");
const homePageContent = document.getElementById("home-page-content");
const collectionPageContent = document.getElementById("collection-page-content");
const historyPageContent = document.getElementById("history-page-content");
const topTracksContainer = document.getElementById("top-tracks-container");
const topAlbumsContainer = document.getElementById("top-albums-container");
const topArtistsContainer = document.getElementById("top-artists-container");
const topPlaylistsContainer = document.getElementById("top-playlists-container");

/******* 
  page router
*********/

(() => {
    console.log("setting up page router");
    homeLink.addEventListener("click", (e) => {
        homeLink.classList.add("active-link")
        collectionLink.classList.remove("active-link")
        historyLink.classList.remove("active-link")
        collectionPage.classList.add("hide-page")
        historyPage.classList.add("hide-page")
        homePage.classList.remove("hide-page")
    })
    collectionLink.addEventListener("click", (e) => {
        collectionLink.classList.add("active-link")
        homeLink.classList.remove("active-link")
        historyLink.classList.remove("active-link")
        homePage.classList.add("hide-page")
        historyPage.classList.add("hide-page")
        collectionPage.classList.remove("hide-page")
    })
    historyLink.addEventListener("click", (e) => {
        historyLink.classList.add("active-link")
        homeLink.classList.remove("active-link")
        collectionLink.classList.remove("active-link")
        homePage.classList.add("hide-page")
        collectionPage.classList.add("hide-page")
        historyPage.classList.remove("hide-page")
    })
})()

/******* 
  render home page
*********/

const renderHomePage = async () => {
    const {
        tracks,
        artists,
        albums,
        playlists
    } = await getHomePageData()
    renderTracks(topTracksContainer,await tracks.data )
    renderArtists(topArtistsContainer, await artists.data)
    renderAlbums(topAlbumsContainer, await albums.data )
    renderPlaylists(topPlaylistsContainer, await playlists.data)
    homeLoader.classList.add("hide")
    homePageContent.classList.remove("hide")
}

async function renderTracks(container,tracksList){
    const {tracks} = tracksList;
    console.log("rendering ", tracks)
    tracks.forEach(track => {
        const htmlString = getCardHtml(track);
        container.insertAdjacentHTML("beforeend",htmlString)
    });
    console.log("current data is", data);
}
async function renderAlbums(container,albumList){
    console.log("rendering ",albumList)
    const {albums} = albumList;
    console.log("rendering ", albums)
    albums.forEach(album => {
        const htmlString = getAlbumHtml(album);
        container.insertAdjacentHTML("beforeend",htmlString)
    });
    
}
async function renderPlaylists(container,playlistList){
    console.log("rendering ",playlistList)
    // const {tracks : tracksList} = tracksList;
    // console.log("rendering ", tracksList)
    // tracksList.forEach(track => {
    //     const cardHtml = getCardHtml(track);
    //     container.insertAdjacentHTML("beforeend",cardHtml)
    // });
    
}
async function renderArtists(container,artistList){
    console.log("rendering ",artistList)
    // const {tracks : tracksList} = tracksList;
    // console.log("rendering ", tracksList)
    // tracksList.forEach(track => {
    //     const cardHtml = getCardHtml(track);
    //     container.insertAdjacentHTML("beforeend",cardHtml)
    // });

}

function getAlbumHtml(album){
    console.log("get albumHtml",album)
    const htmlString = `

    `;
    return htmlString;
}

function getCardHtml(track){
    data.set(track.id,track);
    const htmlString = `
    <div class="track-card">
        <img class="track-image" src="https://api.napster.com/imageserver/v2/albums/${track.albumId}/images/500x500.jpg" alt="">
        <div class="track-card-content">
            <h3>${track.albumName}</h3>
            <button data-action="play" data-id="${track.id}" class="play"><img src="./images/play-button.png" alt=""></button>
            <button data-action="playlist" data-id="${track.id}" class="add-to-playlist"><img src="./images/playlist.png" alt=""></button>
            <button data-action="queue" data-id="${track.id}" class="add-to-queue"><img src="./images/queue.png" alt=""></button>
        </div>
    </div>
    `;
    return htmlString;
}

/********
 * loading the app
 */
renderHomePage();

