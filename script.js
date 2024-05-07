async function fetchRandomMealWithIngredients() {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const data = await response.json();
        return data.meals[0];
    } catch (error) {
        console.error('Error fetching random meal:', error);
        return null;
    }
}

function getIngredientsList(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && measure) {
            ingredients.push(`${ingredient} - ${measure}`);
        }
    }
    return ingredients;
}

async function displayRandomMeal() {
    const randomMealSection = document.getElementById("randomMealSection");
    const randomMeal = await fetchRandomMealWithIngredients();
    if (randomMeal) {
        const ingredientsList = getIngredientsList(randomMeal);
        const mealName = randomMeal.strMeal;
        const mealImage = randomMeal.strMealThumb;
        const mealInstructions = randomMeal.strInstructions;
        randomMealSection.innerHTML = `
            <div class="meal" onclick="showIngredients('${mealName}', '${mealImage}', '${mealInstructions}', ${JSON.stringify(ingredientsList)})">
                <img src="${mealImage}" alt="${mealName}">
                <h2>${mealName}</h2>
            </div>
        `;
    } else {
        randomMealSection.innerHTML = '<p>Failed to fetch random meal</p>';
    }
}

function closeModal() {
    const modal = document.querySelector(".modal");
    modal.style.display = "none";
    modal.remove();
}

async function searchMeal(query) {
    const searchResultsSection = document.getElementById("searchResultsSection");
    if (query.trim() === "") {
        searchResultsSection.style.display = "none";
    } else {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
            const data = await response.json();
            displaySearchResults(data.meals);
        } catch (error) {
            console.error('Error searching for meal:', error);
        }
    }
}

function displaySearchResults(meals) {
    const searchResultsSection = document.getElementById("searchResultsSection");
    if (meals) {
        searchResultsSection.innerHTML = `
            <h2>Search Results</h2>
            <div class="meal-list">
                ${meals.map(meal => `
                    <div class="meal" onclick="showIngredients('${meal.strMeal}', '${meal.strMealThumb}', '${meal.strInstructions}', ${JSON.stringify(getIngredientsList(meal))})">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                        <h3>${meal.strMeal}</h3>
                    </div>
                `).join('')}
            </div>
        `;
        searchResultsSection.style.display = "block";
    } else {
        searchResultsSection.innerHTML = '<p>No results found</p>';
    }
}

window.onload = displayRandomMeal;
