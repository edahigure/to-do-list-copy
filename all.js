<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>To do list</title>
    <script src="https://kit.fontawesome.com/173db1d6d6.js" crossorigin="anonymous"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter&family=Lato:wght@300;400&family=Poppins&family=Roboto&display=swap" rel="stylesheet">
</head>
<body>
    <div class="toDoList-wrapper">
        <div class="item"> <div>Today's to do </div> <i class="fa fa-refresh" aria-hidden="true"></i> </div>
        <div class="item"> 
            <input class="add-item" id="new-item" type="text" placeholder="Add to your list">
            <div type ="button" id="add-event"> <i class="fa-solid fa-arrow-turn-down" ></i>  </div>
        </div>
       
        <ul class="list">
            
        </ul>

        <input class="clear-all" id="clearAll" type="button" value="Clear all completed"> 
        
         
    </div>
</body>

</html>


import './style.css';

import { myTask } from './taskList.js';

myTask.inform();


export class ListTasks {
  taskListArr;

  id;

  constructor(taskListArr) {
    // initial array from the local storage
    this.taskListArr = taskListArr;

    this.printList();

    this.id = this.taskListArr.length - 1;

    const addEvent = document.querySelector('#add-event');
    addEvent.addEventListener('click', () => this.addTask());

    const enterAddEvent = document.querySelector('#new-item');
    enterAddEvent.addEventListener('keypress', (e) => this.enterAddTask(e));

    this.initEvents();
    this.initClearEvent();
  }

  enterAddTask(event) {
    if (event.key === 'Enter') {
      this.addTask();
    }
  }

  addTask = () => {
    const list = document.querySelector('.list');
    const newItem = document.querySelector('#new-item');

    this.id += 1;
    this.taskListArr.push({ index: this.id, completed: false, description: newItem.value });
    const newTask = document.createElement('div');
    const i = this.id;

    newTask.id = `item-id-${i}`;

    newTask.innerHTML = `
    <li class="item" id="item-${i}">
        <input type="checkbox" id = "check-${i}" >

        <label for="check-${i}">
            <input type="text" id="label-${i}" value="${this.taskListArr[i].description}">    
        </label>

        <div type ="button" id="edit-${i}""> 
            <i class="fa-solid fa-ellipsis-vertical" ></i> 
        </div>

        <div type ="button" id="trash-${i}">      
            <i class="fa-solid fa-trash"></i>
        </div>

     </li>     
    `;

    list.appendChild(newTask);

    this.initEvent(i);

    const str = JSON.stringify(this.taskListArr);
    localStorage.setItem('taksListStorage', str);

    newItem.value = '';
  }

  edit = (itemId) => {
    const id = itemId.split('-')[1];

    const editLabel = document.querySelector(`#label-${id}`);

    this.taskListArr[id].description = editLabel.value;
    const str = JSON.stringify(this.taskListArr);
    localStorage.setItem('taksListStorage', str);

    document.querySelector(`#trash-${id}`).style.display = 'none';
    document.querySelector(`#edit-${id}`).style.display = 'block';

    const editItem = document.querySelector(`#item-${id}`);
    editItem.style.backgroundColor = 'white';
  }

  trash = (itemId) => {
    const id = itemId.split('-')[1];

    const result = this.taskListArr.filter((item) => item.index !== Number(id));
    this.taskListArr = result;

    for (let i = 0; i < result.length; i += 1) {
      result[i].index = i;
    }

    const str = JSON.stringify(result);
    localStorage.setItem('taksListStorage', str);

    document.querySelector('.list').innerHTML = '';

    this.id = result.length - 1;
    this.printList();
    this.initEvents();
  }

  printList = () => {
    const toDoList = this.taskListArr;
    const list = document.querySelector('.list');

    for (let i = 0; i < toDoList.length; i += 1) {
      const newItem = document.createElement('div');

      newItem.id = `item-id-${i}`;
      let str = '';
      str = `
        <li class="item" id="item-${i}" >
        `;
      if (toDoList[i].completed === true) {
        str += `
        <input type="checkbox" id = "check-${i}" checked>
            <label for="check-${i}">
        <input type="text" id="label-${i}" value="${toDoList[i].description}" style="text-decoration: line-through;">
        </label>`;
      } else {
        str += `
        <input type="checkbox" id = "check-${i}">
        <label for="check-${i}">
            <input type="text" id="label-${i}" value="${toDoList[i].description}" checked>
        </label> `;
      }
      str += `
          <div type ="button" id="edit-${i}">      
              <i class="fa-solid fa-ellipsis-vertical" ></i>    
          </div>
  
          <div type ="button" id="trash-${i}">      
              <i class="fa-solid fa-trash"></i>
          </div>
            
       </li>     
      `;
      newItem.innerHTML = str;
      list.appendChild(newItem);
    }
  }

  initEvent = (i) => {
    const editLabel = document.querySelector(`#label-${i}`);
    editLabel.addEventListener('change', () => this.edit(editLabel.id));

    const edit = document.querySelector(`#edit-${i}`);
    edit.addEventListener('click', () => {
      edit.style.display = 'none';
      document.querySelector(`#trash-${i}`).style.display = 'block';
      const editItem = document.querySelector(`#item-${i}`);
      editItem.style.backgroundColor = 'lightyellow';
    });

    const trashItem = document.querySelector(`#trash-${i}`);
    trashItem.addEventListener('click', () => this.trash(trashItem.id));

    this.addCheckEvent(i);
  }

  initEvents = () => {
    for (let i = 0; i < this.taskListArr.length; i += 1) {
      this.initEvent(i);
    }
  }

  initClearEvent = () => {
    document.querySelector('#clearAll').addEventListener('click',
      () => {
        const newArray = [];

        for (let i = 0; i < this.taskListArr.length; i += 1) {
          if (this.taskListArr[i].completed === false) {
            newArray.push(this.taskListArr[i]);
          }
        }
        this.taskListArr = newArray;
        this.id = this.taskListArr.length - 1;
        const str = JSON.stringify(this.taskListArr);
        localStorage.setItem('taksListStorage', str);
        document.querySelector('.list').innerHTML = '';
        this.printList();
        this.initEvents();
      });
  };

  addCheckEvent = (index) => {
    const checkItem = document.querySelector(`#check-${index}`);
    checkItem.addEventListener('change', () => this.editLabel(checkItem.id));
  };

  editLabel = (checkId) => {
    const id = checkId.split('-')[1];
    const checkItem = document.querySelector(`#check-${id}`);

    if (checkItem.checked === true) {
      const labelItem = document.querySelector(`#label-${id}`);
      const newLabel = document.createElement('input');
      newLabel.id = `label-${id}`;
      newLabel.style = 'text-decoration: line-through;';
      newLabel.type = 'text';
      newLabel.value = `${labelItem.value}`;
      labelItem.parentNode.replaceChild(newLabel, labelItem);
      this.taskListArr[Number(id)].completed = true;
    } else {
      const labelItem = document.querySelector(`#label-${id}`);
      const newLabel = document.createElement('input');
      newLabel.id = `label-${id}`;
      newLabel.type = 'text';
      newLabel.value = `${labelItem.value}`;
      labelItem.parentNode.replaceChild(newLabel, labelItem);
      this.taskListArr[Number(id)].completed = false;
    }

    const str = JSON.stringify(this.taskListArr);
    localStorage.setItem('taksListStorage', str);
  };

  inform = () => 0
}

let retDataTemp = [];

if (localStorage.taksListStorage !== undefined) {
  retDataTemp = JSON.parse(localStorage.taksListStorage);
}

export const myTask = new ListTasks(retDataTemp);