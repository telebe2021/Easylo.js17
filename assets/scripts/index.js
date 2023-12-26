let url = ' http://localhost:3000/data/';
let favurl = 'http://localhost:3000/favs/';

////////NAVBAR///////////

let nav = document.querySelector("nav");

let navMenu = document.querySelector(".menu")

document.querySelector("#openMenu").addEventListener("click", (e)=>{
    e.preventDefault()
    if(navMenu.style.top == "-500px"){
        navMenu.style.top = "0";
    }
    else{
        navMenu.style.top = "-500px";
    }
})

window.addEventListener("resize", ()=>{
    if(window.innerWidth > 992){
        navMenu.style.top = "-500px"
    }
})

window.addEventListener("scroll", ()=>{
    if(window.scrollY > 50){
        nav.style.backgroundColor = "#26BE9F"
    } else{
        nav.style.backgroundColor = "transparent"
    }
})

///Go To Top///

document.addEventListener("DOMContentLoaded", function () {
    const upBtn = document.querySelector('.upBtn');

    upBtn.addEventListener('click', function (e) {
        e.preventDefault()
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});


////////////DATA-CRUD and More///////////

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
                    <button class="update" onclick="updateCard(${element.id})"><i class = "bi bi-arrow-clockwise"></i> Update</button>
                </span>
                <i onclick="addFav(${element.id})" class="bi bi-heart"></i>
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

//update//

let form = document.querySelector("form");
let fileInp = document.querySelector("#file");
let imagetxt = document.querySelector("#imagetxt");
let imageDiv = document.querySelector("#img2");
let textInp = document.querySelector("#text");
let nameInp = document.querySelector("#name");
let updateDiv = document.querySelector(".updatediv");
let closeBtn = document.querySelector(".bi-x");

fileInp.addEventListener("change", () => {
    let src = fileInp.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(src);
    reader.onload = function (e) {
        imageDiv.src = e.target.result;
    };
});

closeBtn.addEventListener("click", () => {
    updateDiv.style.display = "none";
});

function updateCard(id) {
    updateDiv.style.display = "flex";

    axios.get(url + id).then(res => {
        nameInp.value = res.data.name;
        textInp.value = res.data.text;
        imagetxt.value = res.data.imagetxt;
        imageDiv.src = res.data.image;
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        axios.patch(url + id, {
            image: imageDiv.src,
            imagetxt: imagetxt.value,
            name: nameInp.value,
            text: textInp.value
        }).then(() => {
            getAll();
            updateDiv.style.display = "none";
        });
    });
}

//favorites//

async function addFav(id){
    if(event.target.classList.contains("bi-heart")){
        event.target.classList.remove("bi-heart");
        event.target.classList.add("bi-heart-fill")

        axios.get(url + id).then(res=>{
            return res.data
        }).then(res=>{
            axios.get(favurl).then(response => {
                let aydi = response.data.find(find=> find.id ===response.id);
                if(!aydi){
                    axios.post(favurl, res)
                } else{
                    axios.delete(favurl + id)
                }
            })
        })
    }
    else{
        event.preventDefault();
        event.target.classList.remove('bi-heart-fill');
        event.target.classList.add('bi-heart');
        axios.delete(favurl + id);
    }
}