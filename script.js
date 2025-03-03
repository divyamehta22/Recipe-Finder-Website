//API used: TheMealDB
const searchBox = document.querySelector(".searchBox");
const searchBtn = document.querySelector(".searchBtn");
const recipeContainer = document.querySelector(".recipe-container");

const recipeCloseBtn = document.querySelector(".recipe-close-btn");
const recipeDetailsContent = document.querySelector(".recipe-details-content");

searchBtn.addEventListener('click', (e)=>{
    e.preventDefault();     //prevents refreshing
    const searchInput = searchBox.value.trim();
    if(!searchInput){
        recipeContainer.innerHTML=`<h2>Type the meal to search</h2>`;
        return;
    }
    fetchRecipes(searchInput);
})

recipeCloseBtn.addEventListener('click', ()=>{
    recipeDetailsContent.parentElement.style.display="none";
})

//function to get recipes
const fetchRecipes = async(query) => {
    recipeContainer.innerHTML="<h2>Fetching Recipes...</h2>";
    try {      
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)     //fetch returns a promise
        
        //converting promise to json
        const response = await data.json();
        // console.log(response.meals);

        recipeContainer.innerHTML="";        //removing any previous text from recipeContainer
        response.meals.forEach(meal => {
            // console.log(meal);
            const recipeDiv = document.createElement('div');    //creating div for fetched recipe array
            recipeDiv.classList.add('recipe');      //providing class to recipeDiv
            recipeDiv.innerHTML = `
                <img src="${meal.strMealThumb}">
                <h3>${meal.strMeal}</h3>
                <p><span>${meal.strArea}</span> Dish</p>
                <p><span>${meal.strCategory}</span> Category</p>
            `
        
            recipeContainer.appendChild(recipeDiv);     

            // adding button to view recipe [can also add a button after p tag in for loop instaed]
            const button = document.createElement('button');
            button.textContent = 'View Recipe';
            recipeDiv.appendChild(button);

            // adding event listener to recipe button
            button.addEventListener('click', () => {
                openRecipePopup(meal);
            });
        });
    } catch (error) {
        // recipeContainer.innerHTML="<h2>Error in fetching Recipes...</h2>";
        
    recipeContainer.innerHTML="<h2>Fetching Recipes...</h2>";
    }
}

const openRecipePopup = (meal) => {
    // when button is clicked set recipeDetailsContent's parent element's display to block
    recipeDetailsContent.parentElement.style.display='block';

    recipeDetailsContent.innerHTML = `
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3>Ingredients</h3>
        <ul class="ingredientList">${fetchIngredients(meal)}</ul>
        <div class="recipeInstructions">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
    `
}

// function to fetch ingredients and measurements for recipeDetailsContent
const fetchIngredients = (meal) => {
    // console.log(meal);
    let ingredientsList = "";
    // taking all 20 ingredients and measurments from api through loop
    for(let i=1; i<=20; i++){
        const ingredient = meal[`strIngredient${i}`];
        if(ingredient){
            const measure = meal[`strMeasure${i}`];
            ingredientsList += `<li>${measure} ${ingredient}</li>`
        }
        else{
            break;
        }
    }
    return ingredientsList;
}