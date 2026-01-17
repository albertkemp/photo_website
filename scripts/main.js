//Serivce worker register:
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('Service Worker registered!', reg))
        .catch(err => console.err('Registration failed:', err));
    });
  }*/
//

const navContact = document.querySelector("#navContact");
const home = document.getElementById("Home");
const ToS = document.getElementById("ToS");
const galleries = document.getElementById("galleries");
const more  = document.getElementById("more");

galleries.addEventListener("click", ()=>{
    more.classList.toggle("hidden");
    home.classList.remove("focus");
    ToS.classList.remove("focus");
    navContact.classList.remove("focus");
});
ToS.addEventListener("click", ()=>{
    document.getElementById("galleryContainer").innerHTML="";
    document.getElementById("container").innerHTML="<div class='flexy'><div><h1>Terms of Service</h1><p>All photographs on this website are the exclusive property of Albert Kemp and are protected under Australian and international copyright laws. You may not copy, reproduce, distribute, or sell these images in any form without express written permission.</p><p>I love sharing photos with people but please follow the rules by contacting me through the Contact page</p></div><div><img id='sgl' src='images/big/moregull.JPG' height='400'><p>Silver gull</p></div></div>"
});
window.addEventListener('message', (event) => {
    if (event.data && event.data.includes('Tally.FormSubmitted')) {
        document.getElementById("message-hider").innerHTML="<h1>Form submitted successfully</h1><img src='images/check.svg' height='100' width='100' style='height:100px;width:100px;'>";
    }
  });
let descripOn = false;

function changeContent(){
    const ps = document.getElementById("ps");
    const nav = document.getElementsByTagName("nav")[0];
    ps.style.height=nav.getBoundingClientRect().height;
    /*
    if (window.innerWidth<=688){
        Melbourne.textContent="MEL";
        Bermagui.textContent="BER";
        Botanics.textContent="BOT";
        Metung.textContent="MET";
        PortFairy.textContent="PFY";
        Qld.textContent="QLD";
        WTP.textContent="WTP";
        Misc.textContent="MSC";
    } else{
        Melbourne.textContent="Melbourne";
        Bermagui.textContent="Bermagui";
        Botanics.textContent="Botanics";
        Metung.textContent="Metung";
        PortFairy.textContent="Port Fairy";
        Qld.textContent="Queensland";
        WTP.textContent="Western Treatment Plant";
        Misc.textContent="Misc";
    }*/
}
document.addEventListener('DOMContentLoaded', changeContent);
window.addEventListener('resize', changeContent);

let pageData;
let elements = []
fetch('data/index.json')
  .then(response => response.json())
  .then(data => {
      pageData = data.pages;
      for (page in pageData) {
        let btn = document.createElement("button");
        btn.id=pageData[page].folder_name;
        btn.textContent=pageData[page].title;
        elements.push(btn);
        more.appendChild(btn);
      }
      console.log(pageData)
      renderPage();
      //backBurner();
  })
  .catch(error => {
    console.error('Error fetching the JSON file:', error);
  });
 

  //const elements = document.querySelectorAll("#Melbourne, #Bermagui, #Botanics, #Metung, #PortFairy, #Qld, #WTP, #Misc, #s2026");
  /*
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
let currentRequestId = 0; // Global tracker
function renderPage() {

navContact.addEventListener("click", ()=>{
    elements.forEach(btn => {
        btn.classList.remove("focus");
    });
    home.classList.remove("focus");
    navContact.classList.add("focus");
});
home.addEventListener("click", ()=> {
    elements.forEach(btn => {
        btn.classList.remove("focus");
    });
    navContact.classList.remove("focus");
    home.classList.add("focus");
    const container = document.getElementById("container");
    container.innerHTML = "";
    galleryContainer.innerHTML = "";
    container.insertAdjacentHTML("beforeend", `            
        <div class="background">
                <img src="images/big/home.JPG">
                <div class="cover">
                    <h2>ALBERT KEMP</h2>
                    <p>Photos of birds and other stuff.</p>
                </div>
            </div>`);
});
    elements.forEach(btn => {
        btn.addEventListener("click", (e) => {
            elements.forEach(b => b.classList.remove("focus"));
            home.classList.remove("focus");
            navContact.classList.remove("focus");
            ToS.classList.remove("focus");
            more.classList.add("hidden");
            e.target.classList.add("focus");

            const requestId = ++currentRequestId;
            const lod = document.getElementById("lod");
            //lod.style.display = "block";
            
            const { folder_name, folder_number, title, description, bg_image } = pageData[e.target.id];
            const container = document.querySelector("#container");
            const galleryContainer = document.querySelector("#galleryContainer");

            container.innerHTML = `<div class="zbackground">
                <img src="images/big/${bg_image}.JPG">
                <div class="zcover"><h2>${title}</h2><p>${descripOn ? description : ""}</p></div>
            </div>`;
            galleryContainer.innerHTML = "";

            let visibleImagesToLoad = 0;

            // This detects if an image is on the screen
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (!img.complete) {
                            visibleImagesToLoad++;
                            img.onload = () => {
                                visibleImagesToLoad--;
                                if (visibleImagesToLoad <= 0) lod.style.display = "none";
                            };
                        }
                    }
                });
            });

            for (let i = 1; i <= folder_number; i++) {
                if (requestId !== currentRequestId) return;

                const img = document.createElement("img");
                if (window.innerWidth>596) {
                    img.src = `small/${folder_name}/img${i}.JPG`;
                } else{
                    img.src = `images/${folder_name}/img${i}.JPG`;
                }
                
                img.classList.add("gallery");
                img.height = 200;
                img.loading = "lazy";

                const newDiv = document.createElement("div");
                newDiv.className = "stickyCont";
                newDiv.appendChild(img);
                galleryContainer.appendChild(newDiv);

                // Start watching this image
                observer.observe(img);
            }
        });
    });
}
let bgUp =false;
document.addEventListener("click", (e) => {
    if (bgUp/*&&!localStorage.getItem("locked")==="True"*/) {
        const fsc = document.getElementById("fsc");
        fsc.classList.toggle("active");
        document.body.style.cursor="default";
        bgUp = false;
    } else {
    
    if (e.target.tagName === "IMG" && window.innerWidth>596) {
        console.log("Image clicked!"); 
        
        
        const innerImage = document.createElement("img");
        
        innerImage.src = e.target.src.replace("/small/", "/images/");
        innerImage.id = "inim";
        fsc.innerHTML="";
        fsc.appendChild(innerImage);
        fsc.classList.toggle("active");
        document.body.style.cursor="pointer";
        bgUp = true;
    }
    }
});
document.addEventListener('keydown', function(event) {
    
    console.log("Key pressed:", event.key); 
    
    if (event.key === 'Escape' || event.key === ' ') {
        event.preventDefault();
        fsc.classList.toggle("active");
        bgUp = false;
    }
    const inim = document.getElementById("inim");
    if (event.key === 'ArrowRight' || event.key === 'd') {
        event.preventDefault();
        
        const match = inim.src.match(/(\d+)(?=\.\w+$)/);
        if (match) {
            const currentNum = parseInt(match[0]);
            const totalImages = document.querySelector("#galleryContainer").getElementsByTagName('img').length;
    
            if (currentNum < totalImages) {
                inim.style.opacity="0.3";
                inim.src = inim.src.replace(/(\d+)(?=\.\w+$)/, currentNum + 1);
            }
            inim.onload = () => {
                inim.style.opacity="1";
            };
        }
    }
    
    if (event.key === 'ArrowLeft' || event.key === 'a') {
        event.preventDefault();
        
        const match = inim.src.match(/(\d+)(?=\.\w+$)/);
        if (match) {
            const currentNum = parseInt(match[0]);
    
            if (currentNum > 1) {
                inim.style.opacity="0.3";
                inim.src = inim.src.replace(/(\d+)(?=\.\w+$)/, currentNum - 1);
            }
            inim.onload = () => {
                inim.style.opacity="1";
            };
        }
    }
});
const contacts = document.querySelectorAll(".Contact");

contacts.forEach((e)=>{
    e.addEventListener("click", ()=>{
        galleryContainer.innerHTML = "";
        
        // Use a template literal with a flex wrapper to ensure the image sits NEXT to the iframe
        container.innerHTML = `
        <div class="background">
        <img src="images/big/pinkearedducks.JPG">
        <div class="cover" style="background-color:rgba(0, 0, 0, 0);">
                    <div id="message-hider">
                <iframe src="https://tally.so/r/D4p4RN" style="width:400px;height:600px;position:absolute;top:-2px;left:-2px;"></iframe>
            </div>
        </div>
        </div>

        `;
    });
});