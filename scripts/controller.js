// glue b/w view and model / service
import { validateName } from "./validation.js"; 
import todoOperations from "./service.js";
import { init } from "./utils.js";
let currentEditId = null;

window.addEventListener('load', initialize);
let autoId ; 
function initialize(){
    bindEvents();
    autoId = init();
    loadFromStorage();
    showId();
}

function bindEvents(){
    document.getElementById('add').addEventListener('click', addTask);
    document.getElementById('delete').addEventListener('click', deleteMarked);
    document.getElementById('update').addEventListener('click', updateTask);
    document.getElementById('search').addEventListener('click', searchTask);
    document.getElementById('clear-fields').addEventListener('click', clearFields);
    document.getElementById('sort-name-header').addEventListener('click', toggleSortByName);
    document.getElementById('sort-date-header').addEventListener('click', toggleSortByDate);
    document.getElementById('sort-id-header').addEventListener('click', toggleSortById);


}
function showId(){
    document.querySelector('#id').innerText = autoId();
}
function addTask(){
    var task = readFields();
    if(verifyFields(task)){
        todoOperations.addTask(task);
        printTask(task);
        computeTotal();
        showId();
        saveToStorage();
    }
    //console.log('Task is ', task);

}

function printTask(task) {
    const tbody = document.querySelector('#task-list');
    const tr = tbody.insertRow();

    // Define only the fields to display
    const fieldsToDisplay = ['id', 'name', 'desc', 'date', 'time', 'photo'];
    
    fieldsToDisplay.forEach((key, index) => {
        tr.insertCell(index).innerText = task[key];
    });

    // Add operations column
    const td = tr.insertCell(fieldsToDisplay.length);
    td.appendChild(createIcon(task.id, toggleMarking));
    td.appendChild(createIcon(task.id, edit, 'fa-pen'));
}


function computeTotal(){
    document.querySelector('#total').innerText = todoOperations.getTotal();
    document.querySelector('#marked').innerText = todoOperations.getMarkedCount();
    document.querySelector('#unmarked').innerText = todoOperations.getUnmarkedCount();
}

function toggleMarking() {
    const id = this.getAttribute('task-id');
    todoOperations.toggleMark(id);
    this.closest('tr').classList.toggle('marked');  // Optional: visual cue
    computeTotal();
    toggleDeleteButtonState();  // ⬅️ update button state
}

function edit(){
    const id = this.getAttribute('task-id');
    const task = todoOperations.getTask(id);
    if(task){
        document.getElementById('name').value = task.name;
        document.getElementById('desc').value = task.desc;
        document.getElementById('date').value = task.date;
        document.getElementById('time').value = task.time;
        document.getElementById('photo').value = task.photo;
        currentEditId = id;
        document.getElementById('update').disabled = false;
    }
}

function createIcon(id, fn, className='fa-trash'){
    // <i class="fa-solid fa-trash"></i>
    const iTag = document.createElement('i');
    iTag.className = `fa-solid ${className}`;
    iTag.addEventListener('click', fn);
    iTag.setAttribute('task-id', id);
    return iTag;
}

function verifyFields(task){
    var errorMessage = "";
    errorMessage = validateName(task.name);
    if(errorMessage){
    document.getElementById('name-error').innerText  = errorMessage;
    return false;
    }
   
        return true;
    
}

function readFields(){
    // read the fields
    // var id = document.getElementById('id').value;
    // var name = document.getElementById('name').value;
    const FIELDS = ['id', 'name', 'desc' , 'date','time','photo'];
    var task = {};
    for(let field of FIELDS){
        if(field=='id'){
             task[field] = document.getElementById(field).innerText;
             continue;
        }
        task[field] = document.getElementById(field).value;
    }
    return task;
}

function toggleDeleteButtonState() {
    const markedCount = todoOperations.getMarkedCount();
    const deleteBtn = document.querySelector('#delete');
    deleteBtn.disabled = markedCount === 0;
}
function deleteMarked(){
    todoOperations.deleteMarked();
    printTable(todoOperations.tasks);  // Re-render table
    computeTotal();
    toggleDeleteButtonState(); // Disable again
    saveToStorage();

}

function deleteSingle(){
    const id = this.getAttribute('task-id');
    todoOperations.removeTask(id);  // Remove from array
    this.closest('tr').remove();    // Remove row from DOM
    computeTotal();                 // Update totals (incl. marked/unmarked)
    toggleDeleteButtonState();      // Enable/Disable delete button
    saveToStorage();

}


function printTable(tasks){
    const tbody = document.querySelector('#task-list');
    tbody.innerHTML = '';
    tasks.forEach(task => printTask(task));
}


function updateTask(){
    const updatedTask = readFields();
    todoOperations.updateTask(currentEditId, updatedTask);
    printTable(todoOperations.getAllTasks());
    computeTotal();
    document.getElementById('update').disabled = true;
    clearFields();
    saveToStorage();
}

function clearFields(){
    const fieldsToClear = ['name', 'desc', 'date', 'time', 'photo'];
    fieldsToClear.forEach(fieldId => {
        document.getElementById(fieldId).value = '';
    });
    document.getElementById('name-error').innerText = '';
    document.getElementById('update').disabled = true;
    currentEditId = null;
}



function loadFromStorage(){
    const data = localStorage.getItem('tasks');
    if(data){
        todoOperations.tasks = JSON.parse(data);
        printTable(todoOperations.tasks);
        computeTotal();
        toggleDeleteButtonState();
    }
}

function saveToStorage(){
    localStorage.setItem('tasks', JSON.stringify(todoOperations.tasks));
}

function searchTask(){
    const value = document.getElementById('search-input').value.trim();
    if(value){
        const results = todoOperations.searchTask(value);
        printTable(results);
    }
}
function clearAllTasks(){
    if(confirm("Are you sure you want to delete all tasks?")){
        todoOperations.clearAll();
        printTable([]);
        computeTotal();
        toggleDeleteButtonState();
        saveToStorage();
    }
}
let nameSortAsc = true;
let dateSortAsc = true;

function toggleSortByName(){
    const sorted = todoOperations.sortBy('name', nameSortAsc);
    printTable(sorted);
    nameSortAsc = !nameSortAsc;
}

function toggleSortByDate(){
    const sorted = todoOperations.sortBy('date', dateSortAsc);
    printTable(sorted);
    dateSortAsc = !dateSortAsc;
}

let idSortAsc = true;

function toggleSortById(){
    const sorted = todoOperations.sortBy('id', idSortAsc);
    printTable(sorted);
    idSortAsc = !idSortAsc;
}

