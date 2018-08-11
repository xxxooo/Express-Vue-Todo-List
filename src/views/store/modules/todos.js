import axios from 'axios';

function handleError(error) {
  console.log(error);
}

export default {
  state: {
    all: [],
  },

  getters: {},

  mutations: {
    //
  },

  actions: {
    setAllTodos({ commit }) {
      axios
        .get('/api/todos')
        .then((response) => {
          commit({
            type: 'setAllTodos',
            todos: response.data,
          });
        })
        .catch(handleError);
    },

    addTodo({ commit }, todo) {
      axios
        .post('/api/todos', todo)
        .then((response) => {
          commit({
            type: 'addTodo',
            todo: response.data,
          });
        })
        .catch(handleError);
    },

    getTodoDetail({ commit }, todo) {
      axios
        .get(`/api/todos/${todo.id}`)
        .then((response) => {
          // const idx = this.todos.indexOf(todo);
          // this.todos[idx] = response.data;

          commit({
            type: 'getTodoDetail',
            todo: response.data,
          });
          // this.$forceUpdate();
        })
        .catch(handleError);
    },

    updateTodo({ commit }, todo) {
      axios
        .patch(`/api/todos/${todo.id}`, todo)
        .then((response) => {
          // this.getTodoDetail(todo);
        })
        .catch(handleError);
    },
  },
};
