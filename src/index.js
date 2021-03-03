// write your code here
const details = document.querySelector(`div#spice-blend-detail`)
const titleForm = document.querySelector(`form#update-form`)
const ingredientForm = document.querySelector(`form#ingredient-form`)
const imgDiv = document.querySelector('div#spice-images')
const ingredients = details.querySelector(`ul.ingredients-list`)

function startPage(){
    
    renderBlend(1)
    fetch(`http://localhost:3000/spiceblends`)
        .then(resp => resp.json())
        .then(blends => {
            blends.forEach(blend =>{
                const img = document.createElement('img')
                img.src = blend.image
                img.dataset.id = blend.id
                imgDiv.append(img)
            })
        })
}


function renderBlend(num){

    fetch(`http://localhost:3000/spiceblends/${num}`)
        .then(resp => resp.json())
        .then(blend => {
            const img = details.querySelector(`img.detail-image`)
            const h2 = details.querySelector(`h2.title`)

            img.src = blend.image
            img.alt = blend.title
            h2.textContent = blend.title
            titleForm.dataset.id = blend.id
            ingredientForm.dataset.id = blend.id
            ingredients.dataset.id = blend.id
            while(ingredients.firstChild) ingredients.removeChild(ingredients.firstChild);

            blend.ingredients.forEach(ingredient =>{
                const myIngredient = document.createElement(`li`)
                myIngredient.textContent = ingredient.name
                ingredients.append(myIngredient)
            })})
}
titleForm.addEventListener('submit', function(event){
    event.preventDefault()
    const title = event.target[0].value
    const newBlend = {title}

    console.log(event.target)
    
    fetch(`http://localhost:3000/spiceblends/${event.target.dataset.id}`,{
        method: `PATCH`,
        headers: { 
            "Content-Type": "application/json"},
        body: JSON.stringify(newBlend)
    })
        .then(resp => resp.json())
        .then(blend => renderBlend(blend.id))
})

ingredientForm.addEventListener(`submit`, function(event){
    event.preventDefault()

    const ingredient = document.createElement('li')
    ingredient.textContent = event.target[0].value
    
    ingredients.append(ingredient)

    fetch(`http://localhost:3000/ingredients`,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name: event.target[0].value,
        spiceblendId: parseInt(event.target.dataset.id)})
    })
})

imgDiv.addEventListener('click', function(event){
    if(event.target.tagName === "IMG"){
        fetch(`http://localhost:3000/spiceblends/${event.target.dataset.id}`)
            .then(resp => resp.json())
            .then(blend => renderBlend(blend.id))
    }
})

startPage()