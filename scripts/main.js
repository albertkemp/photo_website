const elements = document.querySelectorAll("#Melbourne, #Bermagui, #Botanics, #Metung, #PortFairy, #Qld, #WTP, #Misc");
const [Melbourne, Bermagui, Botanics, Metung, PortFairy, Qld, WTP, Misc] = elements;
let pageData;

fetch('data/index.json')
  .then(response => response.json())
  .then(data => {
      pageData = data.pages;
      console.log(pageData)
      renderPage();
  })
  .catch(error => {
    console.error('Error fetching the JSON file:', error);
  });
function renderPage() {
    elements.forEach(btn => {
        btn.addEventListener("click", async (e) => {
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
                    img.title = "© Albert Kemp";
        
                    img.onload = () => {
                        container.appendChild(img);
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