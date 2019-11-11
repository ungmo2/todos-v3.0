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

const getTodos = async () => {
  try {
    const res = await axios.get('/todos');
    todos = res.data;
    render();
  } catch (e) {
    console.error(e);
  }
};

const addTodo = async content => {
  try {
    const res = await axios.post('/todos', { id: generateid(), content, completed: false });
    todos = res.data;
    render();
  } catch (e) {
    console.error(e);
  }
};

const toggleCompleted = async id => {
  try {
    const completed = todos.find(todo => todo.id === +id).completed;

    const res = await axios.patch(`/todos/${id}`, { completed: !completed });
    todos = res.data;
    render();
  } catch (e) {
    console.error(e);
  }
};

const removeTodo = async id => {
  try {
    const res = await axios.delete(`/todos/${id}`);
    todos = res.data;
    render();
  } catch (e) {
    console.error(e);
  }
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
