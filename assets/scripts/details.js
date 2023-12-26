let id= new URLSearchParams (window.location.search).get("id");

let card = document.querySelector(".card");

let url = "http://localhost:3000/data/";

async function getCardById(id){
    let res = await axios.get(url + id);
    let data = await res.data

        card.innerHTML += `
        <div>
        <img src="${data.image}" alt="">
        <h6>${data.imagetxt}</h6>
        <a href="#">${data.name}</a>
        <p>${data.text}</p>
        </div>
        `
    };
getCardById(id);