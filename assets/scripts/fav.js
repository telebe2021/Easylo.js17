let url = "http://localhost:3000/favs/";

let card = document.querySelector(".card");
let searchInp = document.querySelector("#search");
let loadBtn = document.querySelector(".load")

let filterArr = [];
let coppy = [];

let maxl = 3;

async function getAll(){
    let res = await axios.get(url)
    let data = await res.data;
    coppy = data;

    card.innerHTML = ''

    filterArr = filterArr.length || searchInp.value ? filterArr : data;

    filterArr.slice(0, maxl).forEach(element => {
        card.innerHTML += `
            <div>
                <img src="${element.image}" alt="">
                <h6>${element.imagetxt}</h6>
                <a href="#">${element.name}</a>
                <p>${element.text}</p>
                <span>
                    <a href="./details.html?id=${element.id}" class="details"><button><i class = "bi bi-info-circle"></i> Details</button></a>
                    <button class="delete" onclick="deleteCard(${element.id})"><i class = "bi bi-trash"></i> Delete</button>
                </span>
                <i onclick="addFavorite(${element.id})" class="bi bi-heart"></i>
            </div>
        `
    });
}

getAll();

//load//

loadBtn.addEventListener("click", ()=>{
    show()
    moreORless()
    getAll()
});

function moreORless(){
    if(maxl >= coppy.length){
        loadBtn.innerHTML = "Show Less"
    } else{
        loadBtn.innerHTML = "Load More"
    }
}

function show (){
    if (loadBtn.innerHTML == "Show Less"){
        maxl = 3
    } else {
        maxl += 3
    }
}

//search//

searchInp.addEventListener("input", (e)=>{
    filterArr = coppy;
    filterArr = filterArr.filter((element)=>{
        return element.name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
    })
    getAll();
})

//delete//

async function deleteCard(id){
    let res = await axios.delete(url + id)
    window.location.reload()
    return res.data
}