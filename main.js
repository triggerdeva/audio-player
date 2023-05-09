/* when the projects initally loads we have to make api calls to get data */
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

// html elements selectors

const homeLink = document.getElementById("home-link");
const collectionLink = document.getElementById("collection-link");
const historyLink = document.getElementById("history-link");
const pageContainer = document.getElementById("page-container");
const homePage = document.getElementById("home-page");
const collectionPage = document.getElementById("collection-page");
const historyPage = document.getElementById("history-page");


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

const renderHomePage = async () => {
    const {
        tracks,
        artists,
        albums,
        playlists
    } = await getHomePageData()
    while(homePage.firstChild){
        homePage.firstChild.remove();
    }
    console.log(
        tracks,
        artists,
        albums,
        playlists
    )
}
renderHomePage();


// const handleClick = async () => {

// }
