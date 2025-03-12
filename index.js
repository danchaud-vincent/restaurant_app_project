import {menu} from "./data.js"
import { v4 as uuidv4 } from 'https://cdn.jsdelivr.net/npm/uuid@latest/+esm';

const menuSectionEl = document.getElementById('menu-section-el')
const completeBtn = document.getElementById('complete-btn')
const paymentForm = document.getElementById('payment-form')

let data_order = []

// generateID for each food
const data_menu = generateID(menu)

// render the data from the menu
renderMenu()

// ------------ EVENTS ------------
document.addEventListener('click', function(e){

    if (e.target.dataset.add){

        // add the item to the order
        addItem(e.target.dataset.add)

        // render the order
        renderOrder()

    }
    else if (e.target.dataset.minus){

        // remove the item to the order
        removeItem(e.target.dataset.minus)

        // render the order
        renderOrder()

    }
    else if (e.target.dataset.plus){

        // add the item to the order
        addItem(e.target.dataset.plus)

        // render the order
        renderOrder()
    }
})

completeBtn.addEventListener('click', function(){
    document.getElementById('modal').style.display = "flex"
})

paymentForm.addEventListener('submit',function(e){

    e.preventDefault()

    // hide the modal
    document.getElementById('modal').style.display = "none"

    // hide the Order
    document.getElementById('order-section-el').classList.toggle('hidden')

    // add message
    const name_customer = document.getElementById('fname').value
    document.getElementById('message-client').textContent = `Thanks, ${name_customer}! Your order is on it's way!`

    // show the answer
    document.getElementById('message-section-el').classList.toggle('hidden')

    // reset form
    paymentForm.reset()

    // reset order
    data_order = []
})

window.addEventListener('click', function(e){

    if (document.getElementById('modal').style.display === 'flex' && !e.target.matches(".complete-btn")){
        
        if(!event.target.closest(".modal-section")){
            
            document.getElementById('modal').style.display = "none"
            // reset form
            paymentForm.reset()
        }
    }
})

// ------------ FUNCTIONS ------------
function generateID(data){
    
    const data_unique_id = data.map( item => ({...item, id: uuidv4()}))

    return data_unique_id
}

function renderMenu(){
    
    const mainDOM = data_menu.map(food =>{

        return `<div class="menu-food-container">
                    <div class="menu-food-description">
                        <img src="${food.image}" alt="${food.alt}" class="food-img">
                        <div class="food-details">
                            <h3>${food.title}</h3>
                            <p class="menu-food-ingredients">${food.ingredients}</p>
                            <p class="price">$${food.price}</p>
                        </div>
                    </div>
                    <button class="add-btn" data-add="${food.id}"><i class="fa-solid fa-plus" data-add="${food.id}"></i></button>
                </div>
                `
    }).join('')

    menuSectionEl.innerHTML = mainDOM
}

function addItem(id){

    // get the data
    const item = data_menu.filter(item => item.id === id)[0]

    // update data order
    const isSelected = data_order.filter(item => item.id ===id)

    if (isSelected.length){
        // get the item to the order 
        const itemOrder = isSelected[0]

        // update the data
        itemOrder.nb_item_selected++
        itemOrder.total_price = itemOrder.unique_price * itemOrder.nb_item_selected
    }
    else{
        // add the item to the order 
        data_order.push({
            id: item.id,
            title: item.title,
            unique_price: item.price,
            total_price: item.price,
            nb_item_selected: 1,
        })
    } 
}

function removeItem(id){

    // get the data
    const item = data_menu.filter(item => item.id === id)[0]

    // update data order
    const isSelected = data_order.filter(item => item.id ===id)[0]


    if (isSelected.nb_item_selected>1){
        // update the item to the order 
        isSelected.nb_item_selected--
        isSelected.total_price = isSelected.unique_price * isSelected.nb_item_selected
    }
    else if(isSelected.nb_item_selected===1){
        // remove the item from the order 
        const indexRemoved = data_order.map(item => item.id).indexOf(id)
        data_order.splice(indexRemoved, 1)
    } 
}

function renderOrder(){

    // -------- ORDER DOM ------------------
    const orderDOM = data_order.map(item =>{

        let classIcon = ''
        
        if (item.nb_item_selected >1){
            classIcon = 'fa-minus'
        }
        else{
            classIcon = 'fa-trash'
        }

        const itemDOM = `<div class="order-item">
                            <h3>${item.title}</h3>
                            <div class="order-item-number">
                                <button data-minus=${item.id}><i id="minus-${item.id}" class="fa-solid ${classIcon}" data-minus=${item.id}></i></button>
                                <span class="number-item" >${item.nb_item_selected}</span>
                                <button data-plus=${item.id}><i class="fa-solid fa-plus" data-plus=${item.id}></i></button>
                            </div>
                            <p class="food-price">$${item.total_price}</p>
                        </div>
                        `
        
        return itemDOM
    })

    document.getElementById('order-items-el').innerHTML = orderDOM.join('')

    // TOTAL PRICE DOM
    const total = data_order.reduce((accumulator, currentValue) => accumulator + currentValue.total_price, 0)
    document.getElementById('total-price').innerHTML = `$${total}`


    // -------- CLASS HIDE/DISPLAY ------------------
    // show client message when needed
    if (!document.getElementById('message-section-el').classList.contains('hidden')){
        document.getElementById('message-section-el').classList.toggle('hidden')
    }

    // show the Order section when needed
    if (document.getElementById('order-section-el').classList.contains('hidden')){
        document.getElementById('order-section-el').classList.toggle('hidden')
    }

    // hide the Order section if no DOM
    if (!orderDOM.length && !document.getElementById('order-section-el').classList.contains('hidden')){
        document.getElementById('order-section-el').classList.toggle('hidden')
    }
        
}
