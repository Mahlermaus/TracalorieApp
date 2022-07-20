// STORAGE CONTROLLER
const StorageCtrl = (function(){

    return {
        storeItem: function(item){
            let items;
            
            if (localStorage.getItem('items')=== null) {
                items = [];
                items.push(item);
                localStorage.setItem('items',JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem('items')); 
                items.push(item);
                localStorage.setItem('items',JSON.stringify(items));

            }
        },
        getItemsFromStorage: function(){
            let items;
            if (localStorage.getItem('items')=== null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item,index){
                if (updatedItem.id === item.id) {
                    items.splice(index,1,updatedItem);
                } 
            });
            localStorage.setItem('items',JSON.stringify(items));
        },
        deleteItemFromStorage:function(id){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item,index){
                if (id === item.id) {
                    items.splice(index,1);
                } 
            });
            localStorage.setItem('items',JSON.stringify(items));
        },
        clearItemsFromStorage:function(id){
            localStorage.removeItem('items');
        }
    }
})();

// ITEM CONTROLLER
const ItemCtrl = (function(){
    //Constructor
    const Item = function(id,name,calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //Data Structure / State
    const data = {
        // items: [
        //     // {id:0,name:'Steak Dinner',calories:1200},
        //     // {id:1,name:'Ice Cream',calories:800},
        //     // {id:2,name:'Oreos',calories:300}
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories:0
    }

    return {
        getItems:function(){
            return data.items;
        },
        addItem: function(name,calories){
            
            //Creamos el id
            let ID;
            if (data.items.length > 0) {
                ID = data.items[data.items.length -1].id +1;
            } else{
                ID = 0;
            }

            // convertimos a num el valor de calories
            calories = parseInt(calories);            
            //creamos item
            newItem = new Item(ID,name,calories);
            //agregamos al array de items
            data.items.push(newItem);
            return newItem;
        },
        getItemById:function(id){
            let found = null;
            data.items.forEach(function(item){
                if (item.id === id) {
                    found = item;
                }
            })
            return found;
        },
        deleteItem:function(id){
            ids = data.items.map(function(item){
                return item.id;
            });
            const index = ids.indexOf(id);
            data.items.splice(index,1);
        },
        clearAllItems:function(){
            data.items = [];
        },
        updateItem:function(name,calories){
            calories = parseInt(calories);
            let found = null;
            data.items.forEach(function(item){
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem:function(){
            return data.currentItem;
        },
        getTotalCalories: function(){
            let total = 0;
            data.items.forEach(function(item){
                total+=item.calories;                
            });
            data.totalCalories = total;
            return data.totalCalories;
        },
        logData: function(){
            return data;
        }
    }

})();

// UI CONTROLLER

const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        listItems:'#item-list li',
        addBtn:'.add-btn',
        itemNameInput:'#item-name',
        itemCaloriesInput:'#item-calories',
        totalCalories: '.total-calories',
        updateBtn:'.update-btn',
        deleteBtn:'.delete-btn',
        backBtn:'.back-btn',
        clearBtn:'.clear-btn'
    }

    return{
        populateItemList: function(items){
            let html = '';
            items.forEach(function(item){
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name} </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            </li>`
            });
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function(){
            return {
                name:document.querySelector(UISelectors.itemNameInput).value,
                calories:document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item){ 
            document.querySelector(UISelectors.itemList).style.display = 'block';
            
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `<strong>${item.name} </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>`;
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li);
        },
        deleteListItem:function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        removeItems:function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);
            listItems = Array.from(listItems);
            listItems.forEach(function(item){
                item.remove();
            });
        },
        updateListItem:function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);
            //turn node list into array
            listItems = Array.from(listItems);
            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');
                if (itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML =  `<strong>${item.name} </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>`; ;
                }
            });
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm:function(){
            UICtrl.showEditState();
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;

            
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories:function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function(){
            return UISelectors;
        }
    }
})();

// APP CONTROLLER

const App = (function(ItemCtrl,StorageCtrl,UICtrl){
    //Load EventListeneres
    const loadEventListeners = function(){
        const UISelectors = UICtrl.getSelectors();
        //add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        //disable submit on enter
        document.addEventListener('keypress',function(e){
            if (e.keyCode === 13 || e.which ===13) {
                e.preventDefault();
                return false;
            }
        })

        document.querySelector(UISelectors.itemList).addEventListener('click',itemEditClick);

        document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdateSubmit);

        document.querySelector(UISelectors.backBtn).addEventListener('click',UICtrl.clearEditState);

        document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteSubmit);

        document.querySelector(UISelectors.clearBtn).addEventListener('click',clearAllItemsClick);

    }

    //add item submit
    const itemAddSubmit = function(e){
         const input = UICtrl.getItemInput();
         //validamos formularios
        if (input.name !== '' && input.calories !== '') {
        // add Item
            const newItem = ItemCtrl.addItem(input.name,input.calories);
        //add Item to UI list
        UICtrl.addListItem(newItem);
        //total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);

        //localStorage
        StorageCtrl.storeItem(newItem);


        UICtrl.clearInput();
        }

        e.preventDefault();
    }

    //edit click
    const itemEditClick = function(e){
        if (e.target.classList.contains('edit-item')) {
            //get id
            const listId = e.target.parentNode.parentNode.id;            
            const listIdArr = listId.split('-');
            const id = parseInt(listIdArr[1]);

            const itemToEdit = ItemCtrl.getItemById(id);

            ItemCtrl.setCurrentItem(itemToEdit);
            UICtrl.addItemToForm();

        }
        e.preventDefault();
    }
    
    //update item submit
    const itemUpdateSubmit = function(e){
        const input = UICtrl.getItemInput();
        const updatedItem = ItemCtrl.updateItem(input.name,input.calories)

        UICtrl.updateListItem(updatedItem);
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);

        StorageCtrl.updateItemStorage(updatedItem);
        UICtrl.clearEditState();

        e.preventDefault();
    }

    //delete item submit
    const itemDeleteSubmit = function(e){
        const currentItem = ItemCtrl.getCurrentItem();
        ItemCtrl.deleteItem(currentItem.id);

        UICtrl.deleteListItem(currentItem.id);
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);


        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    const clearAllItemsClick = function(e){
        ItemCtrl.clearAllItems();
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);

        StorageCtrl.clearItemsFromStorage();
        UICtrl.removeItems();
        UICtrl.hideList();
    }

    return{
        init:function(){
            UICtrl.clearEditState();

            const items = ItemCtrl.getItems();
            if (items.length === 0) {
                UICtrl.hideList();
            } else {                
            UICtrl.populateItemList(items);
            }

            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);
            //load eventlisteners
            loadEventListeners();
        }
    }
})(ItemCtrl,StorageCtrl,UICtrl);

App.init();