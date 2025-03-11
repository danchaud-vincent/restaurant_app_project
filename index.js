import {menu} from "/data.js"
import { v4 as uuidv4 } from 'https://cdn.jsdelivr.net/npm/uuid@latest/+esm';

const menuSectionEl = document.getElementById('menu-section-el')
const data_order = []

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

        if (document.getElementById('order-section-el').classList.contains('hidden')){
            // show the Order
            document.getElementById('order-section-el').classList.toggle('hidden')
        }
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
        // update the item to the order 
        const itemOrder = isSelected[0]
        itemOrder.nb_item_selected++
    }
    else{
        // add the item to the order 
        data_order.push({
            id: item.id,
            title: item.title,
            price: item.price,
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
    }
    else if(isSelected.nb_item_selected===1){
        // remove the item from the order 
        const indexRemoved = data_order.map(item => item.id).indexOf(id)
        data_order.splice(indexRemoved, 1)
    } 
}

function renderOrder(){
        
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
                                <p class="food-price">$${item.price}</p>
                            </div>
                            `
            
            return itemDOM
        })

        document.getElementById('order-items-el').innerHTML = orderDOM.join('')
        
}
