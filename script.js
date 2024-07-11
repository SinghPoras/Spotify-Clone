async function getSongs(){
    let a = await fetch('http://127.0.0.1:3000/Web%20Dev%20Projects/Spotify-Clone/Songs/')
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let i = 0; i < as.length; i++){
        const element =as[i]
        if(element.href.endsWith(".mp3")){
            songs.push(element.href)
        }  
    }
    return songs
}

async function main(){
    let songArray = await getSongs()
    let audio = new Audio(songArray[])
    audio.play()
}

main()