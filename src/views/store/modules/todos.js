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
    SET_ALL_TODOS(state, payload) {
      state.all = payload.todos;
    },

    ADD_TODO(state, payload) {
      state.all.push(payload.todo);
    },

    UPDATE_TODO(state, payload) {
      const index = state.all
        .map(todo => todo.id)
        .indexOf(payload.todo.id);

      if (index !== -1) {
        state.all = state.all.map((todo, idx) => (
          (idx === index) ? payload.todo : todo
        ));
      }
    },

    DELETE_TODO(state, payload) {
      const index = state.all
        .map(todo => todo.id)
        .indexOf(payload.todo.id);

      if (index !== -1) {
        state.all.splice(index, 1);
      }
    },
  },

  actions: {
    getAllTodos({ commit }) {
      axios
        .get('/api/todos')
        .then((response) => {
          commit({
            type: 'SET_ALL_TODOS',
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
            type: 'ADD_TODO',
            todo: response.data,
          });
        })
        .catch(handleError);
    },

    getTodoDetail({ commit }, todo) {
      axios
        .get(`/api/todos/${todo.id}`)
        .then((response) => {
          commit({
            type: 'UPDATE_TODO',
            todo: response.data,
          });
        })
        .catch(handleError);
    },

    updateTodo({ dispatch }, todo) {
      axios
        .patch(`/api/todos/${todo.id}`, todo)
        .then(() => {
          dispatch('getTodoDetail', todo);
        })
        .catch(handleError);
    },

    removeTodo({ commit }, todo) {
      axios
        .delete(`/api/todos/${todo.id}`)
        .then(() => {
          commit({
            type: 'DELETE_TODO',
            todo,
          });
        })
        .catch(handleError);
    },
  },
};
