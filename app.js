const mealsContainer = document.getElementById('meals-container');
const getMeals = url => {
    fetch(url)
        .then(res => res.json())
        .then(data => displayMeals(data.meals));
}

getMeals(`https://www.themealdb.com/api/json/v1/1/search.php?f=a`);

const formatString = str => {
    return str.split(' ')
              .slice(0, 40)
              .join(' ');
}

const displayMeals = meals => {
    mealsContainer.textContent = '';
    meals.forEach(meal => {
        const mealDiv = document.createElement('div')
        mealDiv.classList.add('col');
        mealDiv.innerHTML = `
            <div class="card" data-id=${meal.idMeal} data-bs-toggle="modal" data-bs-target="#mealModal">
                <img src="${meal.strMealThumb}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${meal.strMeal}</h5>
                    <p class="card-text">${formatString(meal.strInstructions)}</p>
                </div>
            </div>
        `;
        mealsContainer.appendChild(mealDiv);
    });
}

const searchMeals = () => {
    const searchField = document.getElementById('search-field');
    const searchValue = searchField.value;
    getMeals(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`);
    searchField.value = '';
}

const getDetails = e => {
    const { id } = e.target.closest('.card').dataset;
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(res => res.json())
    .then(data => displayDetails(data.meals[0]));
}

const renderIngredients = meal => {
    const ingsArr = [];
    let count = 1;
    for (const key in meal) {
        
        if (key !== `strIngredient${count}` || !meal[key]) continue;
        ingsArr.push(meal[key]);
        count++
    }

    return ingsArr;
}

const displayDetails = meal => {
    const mealDialog = document.getElementById('modal-dialog');
    const mealDiv = document.createElement('div');
    mealDiv.classList.add('modal-content');

    const ingsArr = renderIngredients(meal);

    mealDiv.innerHTML = `
        <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">${meal.strMeal}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <img class='img-fluid' src='${meal.strMealThumb}'>
            <p>${meal.strInstructions}</p>
            <ul>
                ${ingsArr.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
        </div>
    `;
    mealDialog.appendChild(mealDiv);
}

const resetModal = e => {
    if (
        e.target.classList.contains('btn-close') ||
        e.target.classList.contains('modal')
    ) {
        document.getElementById('modal-dialog').textContent = '';
    }
}

document.getElementById('mealModal').addEventListener('click', resetModal);
mealsContainer.addEventListener('click', getDetails);
document.getElementById('btn-search').addEventListener('click', searchMeals);