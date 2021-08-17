import css from "../css/styles.css";
import 'bootstrap/dist/css/bootstrap.min.css';


const get_meal_search = document.getElementById('get_meal_search');
const get_input_search = document.getElementById('inputSearch')
const muestraSearch = document.getElementById('muestraSearch')
const carouselSearch = document.getElementById('searchCarousel')
const figureSearch = document.getElementById('figureSearch');
const instruccionesSearch = document.getElementById('instruccionesSearch');
const videoSearch = document.getElementById('videoSearch');
//Contador para ver cuatos click da al buscar
let con = 0;
//Contador para ver cuatos click da a las imagenes mostradas
let cImg = 0;

const get_meal_btn = document.getElementById('get_meal');
const figureRandom = document.getElementById('figureRandom');
const carouselRandom = document.getElementById('randomCarousel')
const instruccionesRandom = document.getElementById('instruccionesRandom');
const videoRandom = document.getElementById('videoRandom');
//Contador para ver cuatos click da al random
let c = 0;


//----------------Search------------------
get_meal_search.addEventListener('click', () => {
    con++;
    let tituloIngredientesSearch = document.getElementById('tituloIngredientesSearch')
    tituloIngredientesSearch.textContent = "";
    // muestraSearch.style.visibility ="visible";
    // muestraSearch.style.height ="auto";
    muestraSearch.style.display = "inline-flex";
    carouselSearch.style.display = "none";
    figureSearch.style.display = "none";
    instruccionesSearch.style.display = "none";
    videoSearch.style.display = "none";
    let valor = get_input_search.value;
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${valor}`)
        .then(resp => resp.json())
        .then(resp => {
            mostrarMeals(resp)
        })
        .catch(error => {
            if (con > 1) {
                while (muestraSearch.firstChild) {
                    muestraSearch.removeChild(muestraSearch.firstChild)
                }
            }
            let h3 = document.createElement('h3');
            h3.className = "text-center mb-5 mt-0";
            h3.textContent = "Meals not found";
            muestraSearch.appendChild(h3)
            return false;
        })
})

function mostrarMeals(meals) {
    const arrayMeal = meals.meals;

    if (con > 1) {
        while (muestraSearch.firstChild) {
            muestraSearch.removeChild(muestraSearch.firstChild)
        }
    }

    for (let i = 0; i < arrayMeal.length; i++) {
        const element = arrayMeal[i];

        let div = document.createElement('div')
        div.className = "col-3 text-center";
        let h3 = document.createElement('h4')
        h3.textContent = element.strMeal;
        h3.style.cursor = "pointer";
        let img = document.createElement('img')
        img.className = "imgMealSearch rounded mb-5";
        img.style.cursor = "pointer";
        img.src = element.strMealThumb;
        img.width = "200";
        img.height = "200";
        img.alt = element.strMealThumb;
        img.onclick = function () { mostrarMeal(`${element.idMeal}`); };
        div.appendChild(h3);
        div.appendChild(img)
        muestraSearch.appendChild(div)
    }
}

//Hace la petición conforme al id de la comida
function mostrarMeal(id) {
    // muestraSearch.style.visibility ="hidden";
    // muestraSearch.style.height ="0";
    muestraSearch.style.display = "none";
    carouselSearch.style.display = "block";
    figureSearch.style.display = "block";
    instruccionesSearch.style.display = "block";
    videoSearch.style.display = "block";
    cImg++;
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(resp => resp.json())
        .then(resp => {
            createMealSearch(resp.meals[0]);
        })
        .catch(error => {
            console.log(error);
        })
}


const createMealSearch = meal => {
    const ingredients = [];
    console.log(cImg, "eeieieieiei");
    if (cImg > 1) {
        while (carouselSearch.firstChild) {
            carouselSearch.removeChild(carouselSearch.firstChild)
        }
        while (figureSearch.firstChild) {
            figureSearch.removeChild(figureSearch.firstChild)
        }
        while (instruccionesSearch.firstChild) {
            instruccionesSearch.removeChild(instruccionesSearch.firstChild)
        }
        while (videoSearch.firstChild) {
            videoSearch.removeChild(videoSearch.firstChild)
        }
    }
    // Get all ingredients from the object. Up to 20
    for (let i = 1; i <= 20; i++) {

        if (meal[`strIngredient${i}`]) {
            // ingredients.push(  
            //     `${meal}.strIngredient${i}` - `${meal}.strMeasure${i}`
            // );

            ingredienteSearch(meal[`strIngredient${i}`], i, meal[`strMeasure${i}`]);

        } else {
            // Stop if there are no more ingredients
            break;
        }
    }
    let tituloIngredientesSearch = document.getElementById('tituloIngredientesSearch')
    tituloIngredientesSearch.textContent = "Ingredients";
    let controlNext = document.getElementById('carousel-control-next-search');
    let controlPrev = document.getElementById('carousel-control-prev-search');
    controlNext.style.font = "20px"
    controlPrev.style.font = "20px"
    controlNext.style.display = "block";
    controlPrev.style.display = "block";

    let imgMealSearch = document.createElement('img');
    imgMealSearch.src = meal.strMealThumb;
    imgMealSearch.className = "figure-img rounded";
    imgMealSearch.alt = meal.strMeal;;
    imgMealSearch.height = "400";
    imgMealSearch.width = "400";

    let h2 = document.createElement('h2');
    h2.textContent = meal.strMeal;
    figureSearch.appendChild(h2);
    figureSearch.appendChild(imgMealSearch);
    console.log(figureSearch);

    //Nodos para el video
    let h3Video = document.createElement('h3');
    h3Video.textContent = "Video Recipe";
    let divVideo = document.createElement('div');
    divVideo.className = "w-100 d-flex justify-content-center";
    let iframeVideo = document.createElement('iframe');
    iframeVideo.src = `https://www.youtube.com/embed/${meal.strYoutube.slice(-11)}`;
    iframeVideo.width = "500px";
    iframeVideo.height = "300px";
    iframeVideo.allowFullscreen;
    videoSearch.appendChild(h3Video);
    videoSearch.appendChild(iframeVideo);

    //Nodos para adjuntar las instrucciones
    let h3Instrucciones = document.createElement('h3')
    h3Instrucciones.textContent = "Instructions";
    let h4AreaCategoria = document.createElement('h4')
    h4AreaCategoria.textContent = `Area: "${meal.strArea}" - Category: ${meal.strCategory}`;
    let pInstrucciones = document.createElement('p');
    pInstrucciones.textContent = meal.strInstructions;
    instruccionesSearch.appendChild(h3Instrucciones);
    instruccionesSearch.appendChild(h4AreaCategoria);
    instruccionesSearch.appendChild(pInstrucciones);
}

function ingredienteSearch(ingredient, i, porciones) {

    let url = `https://www.themealdb.com/images/ingredients/${ingredient}.png`

    if (i == 1) {
        let img = document.createElement('img')
        let active = document.createElement('div');
        active.className = "carousel-item active";
        img.src = url;
        img.className = "d-block w-100";
        img.alt = "Ingrediente";
        img.width = "450"
        img.height = "400";
        img.style.opacity = "0.7";
        img.style.objectFit = "scale-down"

        let divIngrediente = document.createElement('div');
        divIngrediente.className = "carousel-caption d-none d-md-block";
        let h4 = document.createElement('h4')
        h4.textContent = ingredient;
        let p = document.createElement('p');
        p.textContent = porciones;
        divIngrediente.appendChild(h4)
        divIngrediente.appendChild(p);


        active.appendChild(img)
        active.appendChild(divIngrediente)
        carouselSearch.appendChild(active)

    } else if (i > 1) {
        let div_item = document.createElement('div');
        let imgItem = document.createElement('img')
        div_item.className = "carousel-item";
        imgItem.src = url;
        imgItem.className = "d-block w-100";
        imgItem.alt = "Ingrediente";
        imgItem.width = "450"
        imgItem.height = "400";
        imgItem.style.opacity = "0.7";
        imgItem.style.objectFit = "scale-down"

        let divIngrediente = document.createElement('div');
        divIngrediente.className = "carousel-caption d-none d-md-block";
        let h4 = document.createElement('h4')
        h4.textContent = ingredient;
        let p = document.createElement('p');
        p.textContent = porciones;
        divIngrediente.appendChild(h4)
        divIngrediente.appendChild(p);

        div_item.appendChild(imgItem);
        div_item.appendChild(divIngrediente)
        carouselSearch.appendChild(div_item)

    }
}





//----------------Random------------------
get_meal_btn.addEventListener('click', clickRandom);

function clickRandom() {
    c++;
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(res => res.json())
        .then(res => {
            createMeal(res.meals[0]);
            console.log(res);
        })
        .catch(e => {
            console.warn(e);
        });
}



function ingrediente(ingredient, i, porciones) {

    let url = `https://www.themealdb.com/images/ingredients/${ingredient}.png`

    if (i == 1) {
        let img = document.createElement('img')
        let active = document.createElement('div');
        active.className = "carousel-item active";
        img.src = url;
        img.className = "d-block w-100";
        img.alt = "Ingrediente";
        img.width = "450"
        img.height = "400";
        img.style.opacity = "0.7";
        img.style.objectFit = "scale-down"

        let divIngrediente = document.createElement('div');
        divIngrediente.className = "carousel-caption d-none d-md-block";
        let h4 = document.createElement('h4')
        h4.textContent = ingredient;
        let p = document.createElement('p');
        p.textContent = porciones;
        divIngrediente.appendChild(h4)
        divIngrediente.appendChild(p);


        active.appendChild(img)
        active.appendChild(divIngrediente)
        carouselRandom.appendChild(active)

    } else if (i > 1) {
        let div_item = document.createElement('div');
        let imgItem = document.createElement('img')
        div_item.className = "carousel-item";
        imgItem.src = url;
        imgItem.className = "d-block w-100";
        imgItem.alt = "Ingrediente";
        imgItem.width = "450"
        imgItem.height = "400";
        imgItem.style.opacity = "0.7";
        imgItem.style.objectFit = "scale-down"

        let divIngrediente = document.createElement('div');
        divIngrediente.className = "carousel-caption d-none d-md-block";
        let h4 = document.createElement('h4')
        h4.textContent = ingredient;
        let p = document.createElement('p');
        p.textContent = porciones;
        divIngrediente.appendChild(h4)
        divIngrediente.appendChild(p);

        div_item.appendChild(imgItem);
        div_item.appendChild(divIngrediente)
        carouselRandom.appendChild(div_item)

    }
}


const createMeal = meal => {
    const ingredients = [];
    console.log(meal);
    console.log(`${meal.strYoutube.slice(-11)}`);
    if (c > 1) {
        while (carouselRandom.firstChild) {
            carouselRandom.removeChild(carouselRandom.firstChild)
        }
        while (figureRandom.firstChild) {
            figureRandom.removeChild(figureRandom.firstChild)
        }
        while (instruccionesRandom.firstChild) {
            instruccionesRandom.removeChild(instruccionesRandom.firstChild)
        }
        while (videoRandom.firstChild) {
            videoRandom.removeChild(videoRandom.firstChild)
        }
    }
    // Get all ingredients from the object. Up to 20
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingrediente(meal[`strIngredient${i}`], i, meal[`strMeasure${i}`]);
        } else {
            // Stop if there are no more ingredients
            break;
        }
    }

    let tituloIngredientes = document.getElementById('tituloIngredientes')
    tituloIngredientes.textContent = "Ingredients"
    let controlNext = document.getElementById('carousel-control-next');
    let controlPrev = document.getElementById('carousel-control-prev');
    controlNext.style.font = "20px"
    controlPrev.style.font = "20px"
    controlNext.style.display = "block";
    controlPrev.style.display = "block";

    let imgMealRandom = document.createElement('img');
    imgMealRandom.src = meal.strMealThumb;
    imgMealRandom.className = "figure-img rounded";
    imgMealRandom.alt = meal.strMeal;
    imgMealRandom.height = "400";

    let h2Random = document.createElement('h2');
    h2Random.textContent = meal.strMeal;
    figureRandom.appendChild(h2Random);
    figureRandom.appendChild(imgMealRandom);

    //Nodos para el video
    let h3Video = document.createElement('h3');
    h3Video.textContent = "Video Recipe";
    let divVideo = document.createElement('div');
    divVideo.className = "w-100 d-flex justify-content-center";
    let iframeVideo = document.createElement('iframe');
    iframeVideo.src = `https://www.youtube.com/embed/${meal.strYoutube.slice(-11)}`;
    iframeVideo.width = "500px";
    iframeVideo.height = "300px";
    iframeVideo.allowFullscreen;
    videoRandom.appendChild(h3Video);
    videoRandom.appendChild(iframeVideo);

    //Nodos para adjuntar las instrucciones
    let h3Instrucciones = document.createElement('h3')
    h3Instrucciones.textContent = "Instructions";
    let h4AreaCategoria = document.createElement('h4')
    h4AreaCategoria.textContent = `Area: "${meal.strArea}" - Category: ${meal.strCategory}`;
    let pInstrucciones = document.createElement('p');
    pInstrucciones.textContent = meal.strInstructions;
    instruccionesRandom.appendChild(h3Instrucciones);
    instruccionesRandom.appendChild(h4AreaCategoria);
    instruccionesRandom.appendChild(pInstrucciones);

};