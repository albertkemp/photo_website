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
        btn.addEventListener("click", (e) => {
            console.log(e.target.id);
            const folder_name = pageData[e.target.id].folder_name;
            const folder_number = pageData[e.target.id].folder_number;
            const container = document.body.querySelector("#container");
            container.innerHTML = "";
            for (let i = 0; i < folder_number; i++) {
                container.insertAdjacentHTML('beforeend', `<img src="images/${folder_name}/img${i}.JPG" height="200" title="&copy; Albert Kemp">`);
            }
        });
    });
}