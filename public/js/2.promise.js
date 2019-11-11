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

const ajax = (() => {
  const req = (method, url, payload) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open(method, url);
      xhr.setRequestHeader('content-type', 'application/json');
      xhr.send(JSON.stringify(payload));

      xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) return;
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.response));
        } else {
          reject(new Error(xhr.status));
        }
      };
    });
  };

  return {
    get(url) {
      return req('GET', url);
    },
    post(url, payload) {
      return req('POST', url, payload);
    },
    patch(url, payload) {
      return req('PATCH', url, payload);
    },
    delete(url) {
      return req('DELETE', url);
    }
  }
})();

const generateid = () => {
  return todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 1;
};

const getTodos = () => {
  ajax.get('/todos')
    .then(_todos => todos = _todos)
    .then(render)
    .catch(err => console.error(err));
};

const addTodo = content => {
  ajax.post('/todos', { id: generateid(), content, completed: false })
    .then(_todos => todos = _todos)
    .then(render)
    .catch(err => console.error(err));
};

const toggleCompleted = id => {
  const completed = todos.find(todo => todo.id === +id).completed;
  ajax.patch(`/todos/${id}`, { completed: !completed })
    .then(_todos => todos = _todos)
    .then(render)
    .catch(err => console.error(err));
};

const removeTodo = id => {
  ajax.delete(`/todos/${id}`)
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

