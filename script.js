const songObjectArray = []
const artistArray = []

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
    let toScroll = document.getElementById("toBeScrolled").offsetTop
    let main = document.querySelector(".main-container")
    main.scrollTo({ top: toScroll - 45, behavior: 'smooth' })
    if(document.querySelector(".side-container").style.left == '5px'){
        document.querySelector(".side-container").style.left = "-100%"
        document.querySelector(".main-container").style.opacity = "1"
    }
}

// Function to display songs in main container, artist names in side container, and Popular Artists Head in main container
// Songs added in the songs folder must be of the format : {(Song name) + " - " + (Artists name)}.mp3
// Note : For two or more than two artist use comma between names
async function createSongListInLibrary(songLinkArray, songNameArray) {
    let playlist = document.querySelector(".playlist")
    let artistContainer = document.querySelector(".artist-container")
    let favouriteContainer = document.getElementById("favorites-container")
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
        playlist.insertAdjacentHTML("beforeend", `<div class="song-name"><div class="count-name flex"><div class="count">${count}.</div><div class="info-library"><div class="info-image"><img src="ImagesUsed/musicLogo.svg" alt="Music"></div><div class="nameSong">${songArtistArray[0]}</div><div class="artist">${songArtistArray[1]}</div></div></div><button class="play"><img src="ImagesUsed/playButton.svg" alt="PlayPauseButton"></button></div>`);
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
            favouriteContainer.insertAdjacentHTML("beforeend", `<div class="artist-album-card">
            <div class="imageLibrary">
                <img src="ArtistPic/${songArtistArray[1].split(", ")[0]}.jpeg" alt="ArtistPic">
            </div>
            <div class="nameSong">${songArtistArray[1].split(", ")[0]}</div>
            <div class="artist">Artist</div>
            </div>`)
        }
        songObject.SongLink = songLinkArray[count - 1];
        songObjectArray.push(songObject)
        count++;
    });
}

var audio = new Audio()

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

let buttonPlayer = document.getElementById("buttonPlayPause")
let discSvg = document.querySelector(".disc")

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

async function main() {
    let songLinksArray = await getSongLinks()
    let songNameArray = await getSongNames()

    await createSongListInLibrary(songLinksArray, songNameArray)

    let songNamePlayer = document.querySelector(".songname")
    let artistNamePlayer = document.querySelector(".artist-player")

    //Code to add event listener on the play button in front of the songs
    document.querySelectorAll(".play").forEach(button => {
        button.addEventListener('click', function () {
            let songNameDiv = button.closest(".song-name")
            let countDiv = songNameDiv.querySelector(".count")
            for (let i = 0; i < songObjectArray.length; i++) {
                if (songObjectArray[i].count == countDiv.innerHTML.replace(".", '')) {
                    artistNamePlayer.innerHTML = songObjectArray[i].ArtistName
                    songNamePlayer.innerHTML = songObjectArray[i].SongName

                    let artistNamePic = songObjectArray[i].ArtistName.split(",")[0]
                    if (audio && !audio.paused) {
                        audio.pause()
                        buttonPlayer.innerHTML = '<img src="ImagesUsed/playButton.svg" alt="PlayPauseButton">'
                    }
                    let link = songObjectArray[i].SongLink
                    audio.src = link
                    audio.play()
                    buttonPlayer.innerHTML = '<img src="ImagesUsed/pauseButton.svg" alt="PlayPauseButton"></img>'
                    discSvg.innerHTML = `<img src="ArtistPic/${artistNamePic}.jpeg" alt="Music">`
                }
            }
        })
    })

    // Function to have a responsive seekbar which progresses as the song continues
    let widthSeekbar = window.getComputedStyle(document.getElementById('seekbar')).width;
    let widthInt = parseInt(widthSeekbar) 
    audio.addEventListener("timeupdate", () => {
        document.querySelector(".total-duration").innerHTML = timeInMinutes(audio.duration)
        document.querySelector(".current-duration").innerHTML = timeInMinutes(audio.currentTime)

        let circleStyle = document.getElementById('circle').style
        circleStyle.width = `${((widthInt/audio.duration)*audio.currentTime)}px`
    })

    // Function to play the song from where we click the playbar
    document.getElementById("seekbar").addEventListener('click',(e)=>{
        let percent = (e.offsetX/widthInt) * 100;
        document.getElementById("circle").style.width = percent + "%";
        audio.currentTime = (audio.duration * percent)/100
    })

    //Hamburger onclick function
    document.querySelector(".hamburger").addEventListener('click',()=>{
        document.querySelector(".side-container").style.left = "5px"
        document.querySelector(".main-container").style.opacity = "0.5"
    })

    document.querySelector(".closeButton").addEventListener('click',()=>{
        document.querySelector(".side-container").style.left = "-100%"
        document.querySelector(".main-container").style.opacity = "1"
    })

    // Responsiveness to album-container
    // let albumContainerWidth = window.getComputedStyle(document.querySelector(".album-container")).width
    // console.log(albumContainerWidth)

    // responsive()
    // window.onresize = responsive

    // function responsive(){
    //     let newWidth = window.getComputedStyle(document.querySelector(".album-container")).width.split("px")[0]
    //     console.log(newWidth)
    //     let albumContainer = document.querySelector(".artist-container")

    //     if(newWidth > 1050){
    //         albumContainer.style.gridTemplateAreas = '"11 12 13 14 15 16" "21 22 23 24 25 26" "31 32 33 34 35 36" "41 42 43 44 45 46";'
    //     }
    //     else if(newWidth <= 1050 && newWidth > 870){
    //         location.reload()
    //         albumContainer.style.gridTemplateAreas ='"11 12 13 14 15" "21 22 23 24 25" "31 32 33 34 35" "41 42 43 44 45" "51 52 53 54 55"';
    //     }
    //     else if(newWidth <= 870){
    //         location.reload()
    //         albumContainer.style.gridTemplateAreas = '"11 12 13 14" "21 22 23 24" "31 32 33 34" "41 42 43 44" "51 52 53 54" "61 62 63 64";'
    //     }
    // }
}

main()

