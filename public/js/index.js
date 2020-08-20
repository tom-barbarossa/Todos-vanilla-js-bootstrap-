const todos = JSON.parse(localStorage.getItem('todos')) || [];
const filters = {
  onlyInProgressTodos: true,
  searchPhrase: '',
};

const todoInputButton = document.querySelector('#todo-input-button');
const todoInputFields = document.querySelector('#todo-input-fields');
const input = {
  title: document.querySelector('#todo-input-field-title'),
  description: document.querySelector('#todo-input-field-description'),
  finishByDate: document.querySelector('#todo-input-field-finish-by-date'),
  finishByTime: document.querySelector('#todo-input-field-finish-by-time'),
};
const todoList = document.querySelector('#todo-list');
const doneList = document.querySelector('#done-list');
const searchField = document.querySelector('#search-field');
const completedCheckbox = document.querySelector('#completed-checkbox');

function listTodos() {
  let todosTemp = [...todos];

  todoList.innerHTML = '';
  doneList.innerHTML = '';
  Object.keys(input).forEach((e) => (input[e].value = ''));

  if (filters.searchPhrase) {
    todosTemp = todosTemp.filter((e) =>
      e.title.toLowerCase().includes(filters.searchPhrase)
    );
  }

  if (filters.onlyInProgressTodos) {
    todosTemp = todosTemp.filter((e) => !e.completed);
    document.querySelector('#done-header').classList.add('d-none');
  } else {
    document.querySelector('#done-header').classList.remove('d-none');
  }

  todosTemp.forEach((e, idx) => {
    const classesToAdd = ['card', 'my-1'];
    const newEl = document.createElement('div');
    const newElHeader = document.createElement('div');
    const header = document.createElement('h5');
    const headerAccordionLink = document.createElement('button');
    const actionButton = document.createElement('button');
    const newElBody = document.createElement('div');
    const body = document.createElement('div');

    actionButton.setAttribute('type', 'button');
    actionButton.classList.add('btn', 'btn-sm', 'float-right');

    headerAccordionLink.classList.add('btn', 'btn-link');
    headerAccordionLink.textContent = e.title;
    headerAccordionLink.setAttribute('data-toggle', 'collapse');
    headerAccordionLink.setAttribute('data-target', `#collapse-${idx}`);
    headerAccordionLink.setAttribute('aria-controls', `#collapse-${idx}`);
    
    header.append(headerAccordionLink);

    newElHeader.classList.add('card-header');
    newElHeader.id = `header-${idx}`;
    newElHeader.append(header);

    body.classList.add('card-body');
    body.innerHTML = `<div class="row"><div class="col-12 col-sm-6 text-xs-center mb-2"><h5>Description:</h5><span>${
      e.description
    }</span></div><div class="col-12 col-sm-6 text-xs-center mb-2"><h5>Due on:</h5><span>${moment(
      e.finishBy
    ).format('YYYY-MM-DD HH:mm')}</span></div></div>`;
    newElBody.id = `collapse-${idx}`;
    newElBody.setAttribute('aria-labelledby', `header-${idx}`);
    newElBody.setAttribute('data-parent', `#todo-list`);
    newElBody.classList.add('collapse');
    newElBody.append(body);

    newEl.id = e.id;
    newEl.append(newElHeader, newElBody);

    if (e.completed) {
      classesToAdd.push('border-success', 'bg-light');
      actionButton.textContent = 'Unfinish me!';
      actionButton.classList.add('btn-warning');
      actionButton.addEventListener('click', (e) => {
        utils.manageCompletion(
          e,
          e.target.parentNode.parentNode.id,
          todos,
          false
        );
        listTodos();
      });
      newElHeader.append(actionButton);
      newEl.classList.add(...classesToAdd);
      doneList.append(newEl);
    } else {
      actionButton.textContent = 'Finish me!';
      actionButton.classList.add('btn-success');
      actionButton.addEventListener('click', (e) => {
        utils.manageCompletion(
          e,
          e.target.parentNode.parentNode.id,
          todos,
          true
        );
        listTodos();
      });
      newElHeader.append(actionButton);
      newEl.classList.add(...classesToAdd);
      todoList.append(newEl);
    }
  });
}

todoInputButton.addEventListener('click', (e) => {
  // TODO: Add error popup
  if (Object.values(input).findIndex((e) => !e.value) > -1) return;
  todos.push({
    title: input.title.value,
    description: input.description.value,
    completed: false,
    id: uuidv4(),
    createdAt: moment().valueOf(),
    lastModified: moment().valueOf(),
    finishBy: moment(
      `${input.finishByDate.value} ${input.finishByTime.value}`
    ).valueOf(),
  });
  localStorage.setItem('todos', JSON.stringify(todos));
  listTodos();
});

todoInputFields.addEventListener('keyup', (e) =>
  e.keyCode == 13 ? todoInputButton.click() : null
);

searchField.addEventListener('input', (e) => {
  filters.searchPhrase = e.target.value.toLowerCase();
  listTodos();
});

completedCheckbox.addEventListener('change', (e) => {
  filters.onlyInProgressTodos = !e.target.checked;
  listTodos();
});

window.addEventListener('storage', (e) => {
  e === 'todos' ? (todos = e.newValue) : null;
  listTodos();
});

utils.fillSelection(input.finishByDate, 'dates');
utils.fillSelection(input.finishByTime, 'timeSlots');
listTodos();
