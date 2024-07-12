const songObjectArray = []

async function getSongLinks(){
    let a = await fetch('http://127.0.0.1:3000/Web%20Dev%20Projects/Spotify-Clone/Songs/')
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let i = 0; i < as.length; i++){
        const element = as[i]
        if(element.href.endsWith(".mp3")){
            songs.push(element.href)
        }
    }
    return songs
}

async function getSongNames(){
    let a = await fetch('http://127.0.0.1:3000/Web%20Dev%20Projects/Spotify-Clone/Songs/')
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songNames = []
    for (let i = 0; i < as.length; i++){
        const element = as[i]
        if(element.innerHTML!="../" && element.innerHTML!=".DS_Store"){
            songNames.push(element.innerHTML)
        }
    }
    return songNames
}

// Songs added in the songs folder must be of the format : {(Song name) + " - " + (Artists name)}.mp3
// Note : For two or more than two artist use comma between names
async function createSongListInLibrary(songLinkArray, songNameArray){
    let playlist = document.querySelector(".playlist")
    let count = 1;
    songNameArray.forEach(element => {
        let songObject = {
            count : '',
            SongName : '',
            ArtistName : '',
            SongLink : ''
        }
        let songArtist = element.replace(".mp3","")
        let songArtistArray = songArtist.split(" - ")
        playlist.insertAdjacentHTML("beforeend",`<div class="song-name"><div class="count-name flex"><div class="count">${count}.</div><div class="info-library"><div class="info-image"><img src="ImagesUsed/musicLogo.svg" alt="Music"></div><div class="album-playlist-name nameSong">${songArtistArray[0]}</div><div class="discription artist">${songArtistArray[1]}</div></div></div><button class="play"><img src="ImagesUsed/playButton.svg" alt="PlayPauseButton"></button></div>`);
        songObject.count = count;
        songObject.SongName = `${songArtistArray[0]}`;
        songObject.ArtistName = `${songArtistArray[1]}`;
        songObject.SongLink = songLinkArray[count-1];
        songObjectArray.push(songObject)
        count++;
    });
}

var audio = new Audio()

function timeInMinutes(time){
    if(time!=NaN){
        time = Math.round(time)
        let minute = 0;
        while(time>60){
            time = time - 60;
            minute++
        }
        if(time == 60){
            minute++;
            time = 0
        }
        let timeString = ''
        if(time<10){
            timeString = `${minute}:0${time}`
        }
        else{
            timeString = `${minute}:${time}`
        }
    }
    return timeString
}

let buttonPlayer = document.getElementById("buttonPlayPause")

if(audio.paused && buttonPlayer.innerHTML == '<img src="ImagesUsed/pauseButton.svg" alt="PlayPauseButton"></img>'){
    buttonPlayer.innerHTML = '<img src="ImagesUsed/playButton.svg" alt="PlayPauseButton"></img>'
}
else if(!audio.paused && buttonPlayer.innerHTML == '<img src="ImagesUsed/playButton.svg" alt="PlayPauseButton">'){
    buttonPlayer.innerHTML = '<img src="ImagesUsed/pauseButton.svg" alt="PlayPauseButton"></img>'
}

buttonPlayer.addEventListener('click', function(){
    if(audio.paused){
        audio.play()
        buttonPlayer.innerHTML = '<img src="ImagesUsed/pauseButton.svg" alt="PlayPauseButton"></img>'
    }
    else if(!audio.paused){
        audio.pause()
        buttonPlayer.innerHTML = '<img src="ImagesUsed/playButton.svg" alt="PlayPauseButton">'
    }
})

async function main(){
    let songLinksArray = await getSongLinks()
    let songNameArray = await getSongNames()

    await createSongListInLibrary(songLinksArray,songNameArray)

    let songNamePlayer = document.querySelector(".songname")
    let artistNamePlayer = document.querySelector(".artist-player")

    document.querySelectorAll(".play").forEach(button => {
        button.addEventListener('click' , function(){
            let songNameDiv = button.closest(".song-name")
            let countDiv = songNameDiv.querySelector(".count")

            for(let i=0; i<songObjectArray.length; i++){
                if(songObjectArray[i].count == countDiv.innerHTML.replace(".",'')){
                    artistNamePlayer.innerHTML = songObjectArray[i].ArtistName
                    songNamePlayer.innerHTML = songObjectArray[i].SongName
                    if(audio && !audio.paused){
                        audio.pause()
                        buttonPlayer.innerHTML = '<img src="ImagesUsed/playButton.svg" alt="PlayPauseButton">'
                    }
                    let link = songObjectArray[i].SongLink
                    audio.src = link
                    audio.play()
                    buttonPlayer.innerHTML = '<img src="ImagesUsed/pauseButton.svg" alt="PlayPauseButton"></img>'
                }
            }
        })
    })
}

main()

