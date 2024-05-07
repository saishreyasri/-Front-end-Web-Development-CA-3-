// Function to fetch a random meal with ingredients
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

// Function to display random meal in the random meal section
async function displayRandomMeal() {
    const randomMealContainer = document.getElementById("randomMealContainer");
    const randomMeal = await fetchRandomMealWithIngredients();
    if (randomMeal) {
        const mealName = randomMeal.strMeal;
        const mealImage = randomMeal.strMealThumb;
        randomMealContainer.innerHTML = `
            <div class="meal" onclick="showIngredients('${mealName}', '${mealImage}', '${randomMeal.strInstructions}', ${JSON.stringify(getIngredientsList(randomMeal))})">
                <img src="${mealImage}" alt="${mealName}">
                <h3>${mealName}</h3>
            </div>
        `;
    } else {
        randomMealContainer.innerHTML = '<p>Failed to fetch random meal</p>';
    }
}

// Function to close the ingredient modal
function closeModal() {
    const modal = document.getElementById("ingredientModal");
    modal.style.display = "none";
}

// Function to get ingredients list from the meal object
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

// Function to display ingredients in the ingredient modal
function showIngredients(mealName, mealImage, instructions, ingredients) {
    const modalMealName = document.getElementById("modalMealName");
    const ingredientList = document.getElementById("ingredientList");
    modalMealName.textContent = mealName;
    ingredientList.innerHTML = ingredients.map(ingredient => `<p>${ingredient}</p>`).join('');
    const modal = document.getElementById("ingredientModal");
    modal.style.display = "block";
}

// Event listener for window load event
window.onload = () => {
    displayRandomMeal();
};
