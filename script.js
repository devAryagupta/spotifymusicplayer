let currentSong=new Audio();
let songs;
let currfolder;

async function getSongs(folder){
    currfolder=folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response = await a.text();
    console. log(response)
    let div = document. createElement ("div")
    div. innerHTML = response;
    let as = div. getElementsByTagName ("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element. href .endsWith(".mp4")){
            songs. push(element.href.split(`/${folder}/`)[1])
        }
    }
    
    
    let songUL =document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = "";

    for (const song of songs ) {

        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>
                                ${song.replaceAll("%20", " ")}
                                </div>
                                <div>
                                    Song artist
                                </div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img  class="invert" src="play.svg" alt="">

                            </div>
                            


                        </li>`;
        

    }


    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        });
          
    });

    return songs

}
const playMusic = (track,pause=false)=>{
    currentSong.src = `${currfolder}/${track}`;
    //let audio = new Audio("/songs/" + track)
    if(!pause){
        currentSong.play()
        play.src="pause.svg"
    }
    
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";


}
function secondsToMinutesSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}


async function displayAlbums() {

    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");
    let array =Array.from(anchors)
        for(let index =0;index < array.length;index++){
            const e =array[index];
        
            if (e.href.includes("/songs/")) {
                //console.log(e.href)
                let folder = e.href.split("/").slice(-1)[0];

                    console.log(folder)
                    let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
                    let response = await a.json();
                    console.log(response)
                    cardContainer.innerHTML+= `<div data-folder="${folder}" class="card">
                        <div class="card-image">
                            <img src="/songs/${folder}/cover.jpeg" alt="Album Cover">
                            <button class="play-button"></button>
                        </div>
                        <div class="card-content">
                            <p class="card-title">${response.title}</p>
                            <p class="card-subtitle">${response.description}</p>
                        </div>
                    </div>`

                    
            } 
        };
        // Load the playlist whenever a card is clicked
        Array.from(document.getElementsByClassName("card")).forEach(e => {
            console.log(e);
            e.addEventListener("click", async (item) => {
                console.log("Fetching Songs");
                let songs = await getSongs(`/songs/${item.currentTarget.dataset.folder}`);
                
                playMusic(songs[0]);
            });
        });

      
}
  

  

    


async function main(){
    
    await getSongs("songs/ncs")
    playMusic(songs[0],true)
    
    displayAlbums();

    play.addEventListener("click", () => {
        if (currentSong.paused) {
          currentSong.play();
          play.src="pause.svg"
        } else {
          currentSong.pause();
          play.src="play.svg"
        }
    });
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = 
        (currentSong.currentTime / currentSong.duration) * 100 + "%";

    });
    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
      });

    previous.addEventListener("click", () => {
        console.log("previous clicked");
        
        // Get the current song index
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
      
        // Play the next song if it exists
        if ((index - 1) >=0) {
          playMusic(songs[index -1]);
        } else {
          console.log("End of playlist");
        }
      });
      
      
      next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked");
        
        // Get the current song index
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
      
        // Play the next song if it exists
        if ((index + 1) < songs.length) {
          playMusic(songs[index + 1]);
        } else {
          console.log("End of playlist");
        }
      });
      document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(e, e.target, e.target.value);
        currentSong.volume = parseInt(e.target.value)/100;
      });


      document.querySelector(".volume>img").addEventListener("click", (e) => {
        
        
    
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0;
        } else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = .10; // Restore volume to full (adjust as needed)
            document.querySelector(".range").getElementsByTagName("input")[0].value=10;
        }
    });
    
      // Load the playlist whenever a card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs= await getSongs(`songs/${item.currentTarget.dataset.folder
            }`)
            

        });
    });

  
      
      
      
  
      
      
      
}
main()
    