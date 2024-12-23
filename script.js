let result = document.getElementById("result");
let searchBtn = document.getElementById("search-btn");
let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

// Get the value from the input field
searchBtn.addEventListener("click", () => {
    let userInp = document.getElementById("user-inp").value;
    if (userInp.length == 0) {
        result.innerHTML = `<h3>Input field Cannot be Empty </h3>`;
        return;
    }

    // Check if the data is in localStorage (cache)
    let cachedData = localStorage.getItem(userInp);

    if (cachedData) {
        // Use cached data if available
        displayMeal(JSON.parse(cachedData));
    } else {
        // Fetch data from API if not cached
        fetch(url + userInp)
            .then(response => response.json())
            .then(data => {
                let myMeal = data.meals ? data.meals[0] : null;
                if (!myMeal) {
                    result.innerHTML = `<h3>No meals found</h3>`;
                    return;
                }

                // Cache the API response in localStorage
                localStorage.setItem(userInp, JSON.stringify(data));

                displayMeal(data);
            })
            .catch(() => {
                result.innerHTML = `<h3> Sahi Dish ka Naam dalo yr...</h3>`;
            });
    }
});

// Function to display the meal details
function displayMeal(data) {
    let myMeal = data.meals[0];

    let ingredients = [];
    let count = 1;

    for (let key in myMeal) {
        if (key.startsWith("strIngredient") && myMeal[key]) {
            let ingredient = myMeal[key];
            let measure = myMeal[`strMeasure${count}`];
            ingredients.push(`${measure} ${ingredient}`);
            count++;
        }
    }

    result.innerHTML = `
        <img src="${myMeal.strMealThumb}" alt="Meal Image">
        <div class="details">
            <h2>${myMeal.strMeal}</h2>
            <h4>${myMeal.strArea}</h4>
        </div>
        <div id="ingredient-con"></div>
        <div id="recipe" style="display: none;">
            <button id="hide-recipe">X</button>
            <pre id="instructions">${myMeal.strInstructions}</pre>
        </div>
        <button id="show-recipe">View Recipe</button>
    `;

    let ingredientCon = document.getElementById("ingredient-con");
    let parent = document.createElement("ul");
    ingredients.forEach((i) => {
        let child = document.createElement("li");
        child.innerText = i;
        parent.appendChild(child);
    });
    ingredientCon.appendChild(parent);

    let recipe = document.getElementById("recipe");
    let hideRecipe = document.getElementById("hide-recipe");
    let showRecipe = document.getElementById("show-recipe");

    hideRecipe.addEventListener("click", () => {
        recipe.style.display = "none";
    });

    showRecipe.addEventListener("click", () => {
        recipe.style.display = "block";
    });
}