const todos =
  document.cookie.split(';').reduce((res, c) => {
    const [key, val] = c.trim().split('=').map(decodeURIComponent);
    const allNumbers = (str) => /^\d+$/.test(str);
    try {
      return Object.assign(res, {
        [key]: allNumbers(val) ? val : JSON.parse(val),
      });
    } catch (e) {
      return Object.assign(res, { [key]: val });
    }
  }, {}).todos || [];
let todoIndex = todos.length ? Math.max(...todos.map(e => e.id.split('-')[1])) + 1 : 0;

function listTodos(searchPhrase) {
  let todosTemp = [...todos];

  if (searchPhrase) {
    todosTemp = todosTemp.filter((e) => e.text.toLowerCase().includes(searchPhrase));
  }

  todoList.innerHTML = '';
  doneList.innerHTML = '';
  field.value = '';

  if (todosTemp.some((e) => e.completed)) {
    document.querySelector('#done-header').classList.remove('d-none');
  }

  todosTemp.forEach((e) => {
    const classesToAdd = ['list-group-item', 'my-1'];
    const newEl = document.createElement('li');
    const newElText = document.createElement('span');

    newEl.id = e.id;
    newElText.textContent = e.text;
    newEl.appendChild(newElText);

    if (e.completed) {
      classesToAdd.push('line-through', 'list-group-item-success');
      doneList.appendChild(newEl);
    } else {
      const finishBtn = document.createElement('button');
      finishBtn.textContent = 'Finish me!';
      finishBtn.type = 'button';
      finishBtn.classList.add('btn', 'btn-success', 'btn-sm', 'float-right');
      finishBtn.addEventListener('click', () => {
        const idx = todosTemp.findIndex((e) => e.id === finishBtn.parentNode.id);
        if (idx > -1) todos[idx].completed = true;
        document.cookie = `todos=${JSON.stringify(todos)}`;
        listTodos();
      });
      newEl.appendChild(finishBtn);
      classesToAdd.push('list-group-item-warning');
      todoList.appendChild(newEl);
    }
    newEl.classList.add(...classesToAdd);
  });
}

const button = document.querySelector('#todo-input-button');
const field = document.querySelector('#todo-input-field');
const todoList = document.querySelector('#todo-list');
const doneList = document.querySelector('#done-list');
const searchField = document.querySelector('#search-field');

button.addEventListener('click', (e) => {
  todos.push({
    text: field.value,
    completed: false,
    id: `todo-${todoIndex++}`,
  });
  document.cookie = `todos=${JSON.stringify(todos)}`;
  listTodos();
});

field.addEventListener('keyup', (e) =>
  e.keyCode == 13 ? button.click() : null
);

searchField.addEventListener('input', (e) => listTodos(e.target.value));

listTodos();
