let todos = [];

// DOMs
const $todos = document.querySelector('.todos');
const $input = document.querySelector('.input-todo');

const render = data => {
  todos = data;

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
  const req = (method, url, cb, payload) => {
    const xhr = new XMLHttpRequest();

    xhr.open(method, url);
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.send(JSON.stringify(payload));

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== XMLHttpRequest.DONE) return;
      if (xhr.status === 200) {
        cb(JSON.parse(xhr.response));
      } else {
        console.error('Error', xhr.status, xhr.statusText);
      }
    };
  };
  return {
    get(url, cb) {
      req('GET', url, cb);
    },
    post(url, payload, cb) {
      req('POST', url, cb, payload);
    },
    patch(url, payload, cb) {
      req('PATCH', url, cb, payload);
    },
    delete(url, cb) {
      req('DELETE', url, cb);
    }
  }
})();

const getTodos = () => {
  ajax.get('/todos', render);
};

const addTodo = content => {
  ajax.post('/todos', { id: 100, content, completed: false }, render)
};

const toggleCompleted = id => {
  const completed = todos.find(todo => todo.id === +id).completed;
  ajax.patch(`/todos/${id}`, { completed: !completed }, render);
};

const removeTodo = id => {
  ajax.delete(`/todos/${id}`, render);
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

