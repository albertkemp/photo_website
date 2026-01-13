//Serivce worker register:
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('Service Worker registered!', reg))
        .catch(err => console.err('Registration failed:', err));
    });
  }
//


const elements = document.querySelectorAll("#Melbourne, #Bermagui, #Botanics, #Metung, #PortFairy, #Qld, #WTP, #Misc");
const [Melbourne, Bermagui, Botanics, Metung, PortFairy, Qld, WTP, Misc] = elements;
let pageData;

fetch('data/index.json')
  .then(response => response.json())
  .then(data => {
      pageData = data.pages;
      console.log(pageData)
      renderPage();
      //backBurner();
  })
  .catch(error => {
    console.error('Error fetching the JSON file:', error);
  });/*
async function backBurner() {
    for (data in pageData) {
        for (let i = 0; i < Math.floor(pageData[data].folder_number/2); i++) {
            for (data in pageData) {
                const flname = pageData[data].folder_name; 
                document.body.insertAdjacentHTML("beforeend", `<img src="images/${flname}/img${i}.JPG" style="display:none;" height="0">`);
            }
        }
    }
}*/
function renderPage() {
    elements.forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const lod = document.getElementById("lod");
            lod.style.display="block";
            console.log(e.target.id);
            const folder_name = pageData[e.target.id].folder_name;
            const folder_number = pageData[e.target.id].folder_number;
            const container = document.body.querySelector("#container");
            container.innerHTML = "";

            
            for (let i = 1; i <= folder_number; i++) {
                
                await new Promise((resolve) => {
                    const img = new Image();
                    img.src = `images/${folder_name}/img${i}.JPG`;
                    img.height = 200;
                    img.title = "(c) Albert Kemp";
                    
                    img.onload = () => {
                        container.appendChild(img);
                        if (i>5) {
                            lod.style.display="none";
                        }
                        resolve();
                    };
        
                    img.onerror = () => {
                        console.log(`Skipping img${i}`);
                        resolve();
                    };
                });
            }
        });
    });
}
let bgUp =false;
document.addEventListener("click", (e) => {
    if (bgUp) {
        fsc.style.display="none";
        bgUp = false;
    } else {
    
    if (e.target.tagName === "IMG") {
        console.log("Image clicked!"); 
        
        const fsc = document.getElementById("fsc");
        const innerImage = document.createElement("img");
        
        innerImage.src = e.target.src;
        innerImage.id = "inim";
        fsc.innerHTML="";
        fsc.appendChild(innerImage);
        fsc.style.display = "block";
        bgUp = true;
    }
    }
});
document.addEventListener('keydown', function(event) {
    
    console.log("Key pressed:", event.key); 
    
    if (event.key === 'Escape' || event.key === ' ') {
        event.preventDefault();
        fsc.style.display="none";
        bgUp = false;
    }
    const inim = document.getElementById("inim");
    if (event.key === 'ArrowRight' || event.key === 'd') {
        event.preventDefault();
        
        const match = inim.src.match(/(\d+)(?=\.\w+$)/);
        if (match) {
            const currentNum = parseInt(match[0]);
            const totalImages = document.querySelector("#container").getElementsByTagName('img').length;
    
            if (currentNum < totalImages) {
                inim.src = inim.src.replace(/(\d+)(?=\.\w+$)/, currentNum + 1);
            }
        }
    }
    
    if (event.key === 'ArrowLeft' || event.key === 'a') {
        event.preventDefault();
        
        const match = inim.src.match(/(\d+)(?=\.\w+$)/);
        if (match) {
            const currentNum = parseInt(match[0]);
    
            if (currentNum > 1) {
                inim.src = inim.src.replace(/(\d+)(?=\.\w+$)/, currentNum - 1);
            }
        }
    }
});
