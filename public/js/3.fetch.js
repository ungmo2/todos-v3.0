let todos = [];

// DOMs
const $todos = document.querySelector('.todos');
const $input = document.querySelector('.input-todo');

const render = () => {
  let html = '';

  todos.forEach(({ id, content, completed }) => {
    html += `
      <li id="${id}" class="todo-item">
        <input class="checkbox" type="checkbox" id="ck-${id}" ${completed ? 'checked' : ''}>
        <label for="ck-${id}">${content}</label>
        <button class="remove-todo">X</button>
      </li>`;
  });

  $todos.innerHTML = html;
};

const generateid = () => {
  return todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 1;
};

const getTodos = () => {
  fetch('/todos')
  .then(res => res.json())
  .then(_todos => todos = _todos)
  .then(render)
  .catch(err => console.error(err));
};

const addTodo = content => {
  fetch('/todos', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ id: generateid(), content, completed: false })
  })
  .then(res => res.json())
  .then(_todos => todos = _todos)
  .then(render)
  .catch(err => console.error(err));
};

const toggleCompleted = id => {
  const completed = todos.find(todo => todo.id === +id).completed;

  fetch(`/todos/${id}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ completed: !completed })
  })
  .then(res => res.json())
  .then(_todos => todos = _todos)
  .then(render)
  .catch(err => console.error(err));
};

const removeTodo = id => {
  fetch(`/todos/${id}`, {
    method: 'DELETE',
    headers: { 'content-type': 'application/json' }
  })
  .then(res => res.json())
  .then(_todos => todos = _todos)
  .then(render)
  .catch(err => console.error(err));
};

// Events
window.onload = getTodos;

$input.onkeyup = ({ target, keyCode }) => {
  const content = target.value.trim();

  if (!content || keyCode !== 13) return;

  target.value = '';
  addTodo(content);
};

$todos.onchange = ({ target }) => {
  toggleCompleted(target.parentNode.id);
};

$todos.onclick = ({ target }) => {
  if (!target.classList.contains('remove-todo')) return;
  removeTodo(target.parentNode.id);
};

