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
  axios.get('/todos')
    .then(res => todos = res.data)
    .then(render)
    .catch(err => console.error(err));
};

const addTodo = content => {
  axios.post('/todos', { id: generateid(), content, completed: false })
    .then(res => todos = res.data)
    .then(render)
    .catch(err => console.error(err));
};

const toggleCompleted = id => {
  const completed = todos.find(todo => todo.id === +id).completed;

  axios.patch(`/todos/${id}`, { completed: !completed })
    .then(res => todos = res.data)
    .then(render)
    .catch(err => console.error(err));
};

const removeTodo = id => {
  axios.delete(`/todos/${id}`)
    .then(res => todos = res.data)
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

