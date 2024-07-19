// All Variables needed to be declared outside
var audio = new Audio()
const songObjectArray = []
const artistArray = []
const likedArray = ["nullObject"]
let buttonPlayer = document.getElementById("buttonPlayPause")
let discSvg = document.querySelector(".disc")
let songNamePlayer = document.querySelector(".songname")
let artistNamePlayer = document.querySelector(".artist-player")
let favouriteContainer = document.getElementById("favourites-container")

//Function to get the links to play the songs
async function getSongLinks() {
    let a = await fetch('http://127.0.0.1:3000/Web%20Dev%20Projects/Spotify-Clone/Songs/')
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let i = 0; i < as.length; i++) {
        const element = as[i]
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href)
        }
    }
    return songs
}

// This function returns the songs names from songs folder
async function getSongNames() {
    let a = await fetch('http://127.0.0.1:3000/Web%20Dev%20Projects/Spotify-Clone/Songs/')
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songNames = []
    for (let i = 0; i < as.length; i++) {
        const element = as[i]
        if (element.innerHTML != "../" && element.innerHTML != ".DS_Store") {
            songNames.push(element.innerHTML)
        }
    }
    return songNames
}

//Function to scroll down to view where all songs are displayed
function toBeScrolled() {
    let main = document.querySelector(".main-container")
    let toScroll = document.getElementById("toBeScrolled").offsetTop
    main.scrollTo({ top: toScroll - 45, behavior: 'smooth' })
    if (document.querySelector(".side-container").style.left == '5px') {
        document.querySelector(".side-container").style.left = "-100%"
        document.querySelector(".main-container").style.opacity = "1"
    }
}

//Function to scroll to top when home is pressed
function scrollToTop() {
    let main = document.querySelector(".main-container")
    main.scrollTo({ top: 0, behavior: 'smooth' })
}

// Function to display songs in main container, artist names in side container, and Popular Artists Head in main container
// Songs added in the songs folder must be of the format : {(Song name) + " - " + (Artists name)}.mp3
// Note : For two or more than two artist use comma between names
async function createSongListInLibrary(songLinkArray, songNameArray) {
    let playlist = document.querySelector(".playlist")
    let artistContainer = document.querySelector(".artist-container")
    let count = 1;
    songNameArray.forEach(element => {
        let songObject = {
            count: '',
            SongName: '',
            ArtistName: '',
            SongLink: ''
        }
        let songArtist = element.replace(".mp3", "")
        let songArtistArray = songArtist.split(" - ")
        playlist.insertAdjacentHTML("beforeend", `<div class="song-name"><div class="count-name flex"><div class="count">${count}.</div><div class="info-library"><div class="info-image"><img src="ImagesUsed/musicLogo.svg" alt="Music"></div><div class="nameSong">${songArtistArray[0]}</div><div class="artist">${songArtistArray[1]}</div></div></div><div class="like-play flex"><div class="like"><img src="ImagesUsed/unlike.svg" alt="unlikeButton"></div><button class="play"><img src="ImagesUsed/playButton.svg" alt="PlayPauseButton"></button></div></div>`);
        songObject.count = count;
        songObject.SongName = `${songArtistArray[0]}`;
        songObject.ArtistName = `${songArtistArray[1]}`;

        if (!artistArray.includes(`${songArtistArray[1].split(", ")[0]}`)) {
            artistArray.push(songArtistArray[1].split(", ")[0])
            artistContainer.insertAdjacentHTML("beforeend", `<div class="card">
            <button>
                <img src="ArtistPic/${songArtistArray[1].split(", ")[0]}.jpeg" alt="KaranAujla">
                <div class="album-playlist-name">${songArtistArray[1].split(", ")[0]}</div>
                <div class="discription">Artist</div>
            </button>
            </div>`)
        }
        songObject.SongLink = songLinkArray[count - 1];
        songObjectArray.push(songObject)
        count++;
    });
}

// Function to convert the song duration and current time in minutes
function timeInMinutes(time) {
    let timeString = ''
    if (time != NaN) {
        time = Math.round(time)
        let minute = 0;
        while (time > 60) {
            time = time - 60;
            minute++
        }
        if (time == 60) {
            minute++;
            time = 0
        }
        if (time < 10) {
            timeString = `${minute}:0${time}`
        }
        else {
            timeString = `${minute}:${time}`
        }
    }
    if (timeString.split(":").includes('NaN')) {
        return '0:00'
    }
    else return timeString
}

//Event listener on the play/pause button in the song bar at bottom
buttonPlayer.addEventListener('click', function () {
    if (audio.paused) {
        audio.play()
        buttonPlayer.innerHTML = '<img src="ImagesUsed/pauseButton.svg" alt="PlayPauseButton"></img>'
    }
    else if (!audio.paused) {
        audio.pause()
        buttonPlayer.innerHTML = '<img src="ImagesUsed/playButton.svg" alt="PlayPauseButton">'
    }
})

// Play Songs based on index
function playSong(index) {
    artistNamePlayer.innerHTML = songObjectArray[index].ArtistName
    songNamePlayer.innerHTML = songObjectArray[index].SongName

    let artistNamePic = songObjectArray[index].ArtistName.split(",")[0]
    if (audio && !audio.paused) {
        audio.pause()
        buttonPlayer.innerHTML = '<img src="ImagesUsed/playButton.svg" alt="PlayPauseButton">'
    }
    let link = songObjectArray[index].SongLink
    audio.src = link
    audio.play()
    buttonPlayer.innerHTML = '<img src="ImagesUsed/pauseButton.svg" alt="PlayPauseButton"></img>'
    discSvg.innerHTML = `<img src="ArtistPic/${artistNamePic}.jpeg" alt="Music">`
}

async function main() {
    // Fetch songs links and song names
    let songLinksArray = await getSongLinks()
    let songNameArray = await getSongNames()

    // Add the songs in the library
    await createSongListInLibrary(songLinksArray, songNameArray)

    // Function to access local storage and add favourite songs to favourite container
    let likedArrayFromStorage = JSON.parse(localStorage.getItem("likedArray"))
    if (likedArrayFromStorage != null) {
        likedArrayFromStorage.forEach(element => {
            if (element != "nullObject") {
                likedArray.push(element)
                favouriteContainer.insertAdjacentHTML('beforeend', `<div class="favourite-card flex"><div class="song-artist-name flex"><div class="nameOfSong">${element.SongName}</div><div class="dot"></div><div class="nameOfArtist">${element.ArtistName}</div></div><div class="link"><img src="ImagesUsed/playButton.svg" alt="playButton"></div></div>`)
                let main = document.querySelector(".main-container")
                main.querySelectorAll(".nameSong").forEach(e => {
                    if(e.innerHTML == element.SongName){
                        console.log(e)
                        let songCard = e.closest(".song-name")
                        let likeButtonInSongCard = songCard.querySelector(".like")
                        let imageInLike = likeButtonInSongCard.querySelector("img")
                        imageInLike.src = "ImagesUsed/like.svg"
                    }
                })
            }
        })
    }

    let songIndex = 0

    //Code to add event listener on the play button in front of the songs
    document.querySelectorAll(".play").forEach(button => {
        button.addEventListener('click', function () {
            let songNameDiv = button.closest(".song-name")
            let countDiv = songNameDiv.querySelector(".count")
            for (let i = 0; i < songObjectArray.length; i++) {
                if (songObjectArray[i].count == countDiv.innerHTML.replace(".", '')) {
                    songIndex = i
                    playSong(songIndex)
                }
            }
        })
    })

    // Function for next and previous
    document.getElementById("prevButton").addEventListener("click", () => {
        if (songIndex > 0) {
            songIndex--
            playSong(songIndex)
        }
    })
    document.getElementById("nextButton").addEventListener("click", () => {
        if (songIndex < songObjectArray.length) {
            songIndex++
            playSong(songIndex)
        }
    })

    // Function to have a responsive seekbar which progresses as the song continues
    let widthSeekbar = window.getComputedStyle(document.getElementById('seekbar')).width;
    let widthInt = parseInt(widthSeekbar)

    // Function to correct the width of seekbar is window is resized
    window.onresize = getWidthSeekbar;
    function getWidthSeekbar() {
        widthSeekbar = window.getComputedStyle(document.getElementById('seekbar')).width;
        widthInt = parseInt(widthSeekbar)
    }

    // Function to increase width of seekbar as the song plays
    audio.addEventListener("timeupdate", () => {
        document.querySelector(".total-duration").innerHTML = timeInMinutes(audio.duration)
        document.querySelector(".current-duration").innerHTML = timeInMinutes(audio.currentTime)

        // Code for Auto Next
        if (audio.duration == audio.currentTime && songIndex < songObjectArray.length) {
            songIndex++
            playSong(songIndex)
        }
        let circleStyle = document.getElementById('circle').style
        circleStyle.width = `${((widthInt / audio.duration) * audio.currentTime)}px`
    })

    // Function to play the song from where we click the playbar
    document.getElementById("seekbar").addEventListener('click', (e) => {
        let percent = (e.offsetX / widthInt) * 100;
        document.getElementById("circle").style.width = percent + "%";
        audio.currentTime = (audio.duration * percent) / 100
    })

    //Hamburger onclick function
    document.querySelector(".hamburger").addEventListener('click', () => {
        document.querySelector(".side-container").style.left = "5px"
        document.querySelector(".main-container").style.opacity = "0.5"
    })
    document.querySelector(".closeButton").addEventListener('click', () => {
        document.querySelector(".side-container").style.left = "-200%"
        document.querySelector(".main-container").style.opacity = "1"
    })

    // Function to like song and add the song to favourites
    document.querySelectorAll(".like").forEach(likeButton => {
        likeButton.addEventListener('click', function () {
            let songToLike = likeButton.closest(".song-name")
            let IndexOfSong = songToLike.querySelector(".count").innerHTML.replace(".", '')
            let image = likeButton.querySelector('img')
            if (image.src.includes("ImagesUsed/unlike.svg")) {
                image.src = "ImagesUsed/like.svg"
                favouriteContainer.insertAdjacentHTML('beforeend', `<div class="favourite-card flex"><div class="song-artist-name flex"><div class="nameOfSong">${songObjectArray[IndexOfSong - 1].SongName}</div><div class="dot"></div><div class="nameOfArtist">${songObjectArray[IndexOfSong - 1].ArtistName}</div></div><div class="link"><img src="ImagesUsed/playButton.svg" alt="playButton"></div></div>`)
                if(!likedArray.includes(songObjectArray[IndexOfSong-1])){
                    likedArray.push(songObjectArray[IndexOfSong - 1])
                }
                localStorage.setItem("likedArray", JSON.stringify(likedArray))
            }
            else {
                image.src = "ImagesUsed/unlike.svg"
                let songNameToRemove = songToLike.querySelector(".nameSong").innerHTML
                for (let i = 0; i < likedArray.length; i++) {
                    if (likedArray[i].SongName == songNameToRemove) {
                        likedArray.splice(i, i)
                        localStorage.setItem("likedArray", JSON.stringify(likedArray))
                    }
                }
                favouriteContainer.querySelectorAll(".nameOfSong").forEach(e => {
                    if (e.innerHTML.includes(`${songNameToRemove}`)) {
                        let childToRemove = e.closest(".favourite-card")
                        favouriteContainer.removeChild(childToRemove)
                    }
                })
            }
        })
    })

    // Function to play song from favourite container
    favouriteContainer.querySelectorAll(".link").forEach(playButton => {
        playButton.addEventListener('click', function(){
            let card = playButton.closest(".favourite-card")
            let songNameToBePlayed = card.querySelector(".nameOfSong")
            for(let i=0; i<songObjectArray.length; i++){
                if(songObjectArray[i].SongName == songNameToBePlayed.innerHTML){
                    songIndex = i
                    playSong(songIndex)
                }
            }
        })
    })
}

main()

