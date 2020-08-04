const search = document.getElementById('search')
const submit = document.getElementById('submit')
const random = document.getElementById('random-btn')
const heading = document.getElementById('result-heading')
const mealsEl =  document.getElementById('meals')
const popup = document.getElementById('popup')
const closebtn = document.getElementById('close-btn')
const popupbg = document.querySelector('.popupbg')
const container = document.querySelector('.container')
const left = document.querySelector('.left')
const right = document.querySelector('.right')

let scroll = 0; // To get the scroll value of the screen to display popup in the middle


// Loads the list of meal whenever user put something in the search value and press the submit button
const loadMeals = (e) =>{
    e.preventDefault();
    mealsEl.innerHTML=""
    if(search.value!=""){
        let term = search.value;
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
        .then(res=>res.json())
        .then(data=>{
            console.log(data);
            if(data.meals!=null){
                heading.innerHTML=`<h2>Search Results For '${term}' :</h2>`
                mealsEl.innerHTML = data.meals.map((meal)=>{
                   return `<div class="meal" data-mealid='${meal.idMeal}'>
                                <img src='${meal.strMealThumb}' />
                                <div class="meal-info" data-mealid='${meal.idMeal}'>
                                    <h3>${meal.strMeal}</h3>
                                </div>
                            </div>`
                }).join('')
            }
            else
            heading.innerHTML=`<h2>Nothing Found For '${term}'</h2>`
        })
    }
    else{
        alert("Please Enter Meal Name")
    }
}

// function to disable scroll when popup screen is active
function noScroll() {
    window.scrollTo(0, scroll);
  }

// function to display popup with the information of meal that user have clicked on
const displaypop = (e) =>{
    if(e.target.parentElement.classList=='meal' || e.target.parentElement.classList=='meal-info')
     {
        scroll = window.scrollY;
        console.log(scroll);
        popup.style.top= scroll+70+'px'
        popupbg.style.top= scroll+'px'
        window.addEventListener('scroll', noScroll);


        let selectedDish=e.target.parentElement.getAttribute('data-mealid'); 
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${selectedDish}`)
        .then(res=> res.json())
        .then(data=>{
            let datacpy = [...data.meals]
            let ingredients = Object.values(datacpy[0]).slice(9,29)
            let filtered = ingredients.filter((element)=>{
                return element!="" && element!=null;
            })
          
           
            left.innerHTML=`
            <h3>${data.meals[0].strMeal}</h3>
            <img src="${data.meals[0].strMealThumb}" alt="">
            `

            right.innerHTML = `
            <h3>Instructions</h3>
            <p>${data.meals[0].strInstructions}</p>
            <h3>Ingredients</h3>
            <div class="ingredients">
                    
                    
                </div>
            `
            const ingredientsdiv =  document.querySelector('.ingredients')

            ingredientsdiv.innerHTML = filtered.map((element)=>{
                return `<span>${element}</span>`
            }).join('');
            
        })
       
        setTimeout(()=>{
            popupbg.classList.add('popupbg-show')
           //  popupbg.scrollTop=1000;
            popup.classList.add('popup-show')

        }, 50)

     }
   
   
}

mealsEl.addEventListener('click', displaypop)
submit.addEventListener('submit', loadMeals)
closebtn.addEventListener('click', ()=>{
    
    window.removeEventListener('scroll', noScroll);
    popup.classList.remove('popup-show')
    popupbg.classList.remove('popupbg-show')
    
})