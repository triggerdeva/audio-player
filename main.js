const data = new Map([]);
/******* 
  fetching data
*********/
import { getPopularArtist, getTopAlbums, getTopTracks, getTopPlaylist,searchSong,getAlbumTracks } from "./api.js";
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
    tracks.forEach(track => {
        container.append(getCardElement(track))
    });
    console.log("current data is", data);
}
function renderAlbums(container,albumList){
    const {albums} = albumList;
    albums.forEach(async (album) => {
        let albumElement = await getAlbum(album)
        container.append(albumElement)
    });
    
}
async function renderPlaylists(container,playlistList){
    console.log("rendering ",playlistList)
    // const {tracks : tracksList} = tracksList;
    // console.log("rendering ", tracksList)
    // tracksList.forEach(track => {
    //     const cardHtml = getCardHtml(track);
    //     container.append("beforeend",cardHtml)
    // });
    
}
async function renderArtists(container,artistList){
    console.log("rendering ",artistList)
    // const {tracks : tracksList} = tracksList;
    // console.log("rendering ", tracksList)
    // tracksList.forEach(track => {
    //     const cardHtml = getCardHtml(track);
    //     container.append("beforeend",cardHtml)
    // });

}

async function getAlbum(album){
    const { links:{tracks : {href : link}}} = album
}

async function createAlbumFragment(album){
    const {data, error} = await getAlbumTracks(link);
    const {tracks} =  await data;

    const container = document.createElement("div");
    container.classList.add("individual-album");
}

function getCardElement(track){
    data.set(track.id,track);
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
    element.querySelector(".track-image").src = `https://api.napster.com/imageserver/v2/albums/${track.albumId}/images/500x500.jpg` 
    element.querySelector(".track-title").innerText =  track.albumName
    const playButton = element.querySelector(".play"); 
    const queueButton = element.querySelector(".add-to-playlist")
    const playlistButton = element.querySelector(".add-to-queue")
    playButton.dataset.id = track.id 
    queueButton.dataset.id = track.id 
    playlistButton.dataset.id = track.id 
    playButton.addEventListener("click", (e) => {
        console.log(track.id);
    })
    queueButton.addEventListener("click", (e) => {
        console.log(track.id);
    })
    playlistButton.addEventListener("click", (e) => {
        console.log(track.id);
    })
    return element;
}

/**********
 * Evnet listner
***********/


/********
 * loading the app
 */
renderHomePage();

