const itemForm = document.getElementById('item-form')
const itemInput = document.getElementById('item-input')
const itemList = document.getElementById('item-list')
const clearButton = document.getElementById('clear')
const itemFilter = document.getElementById('filter')
const formBtn = itemForm.querySelector('button')
let isEditMode = false;

function displayItems(){
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));
    checkUI();
}

function onAddItemSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value;

    if (newItem === ''){
        alert('Please add an Item');
        return;
    }

    //Check for edit mode
    if (isEditMode){
        const itemToEdit = itemList.querySelector('.edit-mode');
        itemToEdit.classList.remove('edit-mode');
        if (checkIfItemExists(newItem)) {
            alert('That item already exists');
            return checkUI();
          }
       
          removeItemFromStorage(itemToEdit.textContent);
          itemToEdit.remove();
          isEditMode = false;
    } else   if (checkIfItemExists(newItem)){
            alert('That item already exist!');
            return;
        }
    

    //Create item DOM Element
    addItemToDOM(newItem);
    
    //Add item to localstorage
    addItemToStorage(newItem);
    checkUI();
    itemInput.value = '';
}

function addItemToDOM(item){
    //Create list item
    const li = document.createElement('li')
    li.appendChild(document.createTextNode(item));

    const button = createButton('remove-item btn-link text-red')
    li.appendChild(button);
    itemList.appendChild(li);

}

function addItemToStorage(item){
    let itemsFromStorage = getItemsFromStorage();

    //Add new item to array
    itemsFromStorage.push(item);
    //convert to JSON string and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage))
}

function createButton(classes){
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

function createIcon(classes){
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function getItemsFromStorage(){
    let itemsFromStorage;

    if(localStorage.getItem('items')=== null){
        itemsFromStorage = []
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'))
    }
    return itemsFromStorage;
}

function onClickItem(e){
    if(e.target.parentElement.classList.contains('remove-item')){
        removeItem(e.target.parentElement.parentElement);
    } else if(e.target.id !== 'item-list'){
        setItemToEdit(e.target);
    }
}

function checkIfItemExists(item){
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item);
}

function setItemToEdit(item){
        isEditMode = true;
        item.classList.add("edit-mode");
        formBtn.innerHTML = "<i class = 'fa-solid fa-pen'></i>  Update Item ";
        formBtn.style.backgroundColor = "#228B22";
        itemInput.value = item.textContent;
}

function removeItem(item){
    // if(e.target.parentElement.classList.contains('remove-item')){
    //     console.log('click!')
        if(confirm('Are you sure you want to delete the item from the list?')){
            //Remove Item from DOM
            item.remove();
            //Remove Item from Storage
            removeItemFromStorage(item.textContent);
            checkUI();
        }

    // }
    
}

function removeItemFromStorage(item){
    let itemsFromStorage = getItemsFromStorage();
    //Filter out item to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    //Reset to localstorage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems(){
    while (itemList.firstChild){
            itemList.removeChild(itemList.firstChild);
        }

        //Clear from LocalStorage
        localStorage.removeItem('items');
    
    checkUI();
}

function filterItems(e){
    const items = itemList.querySelectorAll('li')
    const text = e.target.value.toLowerCase();

    items.forEach( item => {
        const itemName = item.firstChild.textContent.toLowerCase();
        if (itemName.indexOf(text)!= -1){
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function checkUI(){
    itemInput.value = '';
    const items = itemList.querySelectorAll('li')
    if (items.length === 0){
        clearButton.style.display = 'none'
        itemFilter.style.display = 'none'
    } else {
        clearButton.style.display = 'block'
        itemFilter.style.display = 'block'
    }

    formBtn.innerHTML = '<i class = "fa-solid fa-plus"></i>  Add Item'
    formBtn.style.backgroundColor = "#333";
    isEditMode = false;
}

//Initialize app
function init(){
    //Event Listener
    itemForm.addEventListener('submit', onAddItemSubmit)
    itemList.addEventListener('click', onClickItem)
    clearButton.addEventListener('click', clearItems)
    itemFilter.addEventListener('input', filterItems)
    document.addEventListener('DOMContentLoaded', displayItems)
    checkUI();
}

init();
