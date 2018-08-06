<template>
<div class="card">
  <new-todo
    :todo-title="newTodoTitle"
    @add-todo="addTodo"
    @input-focus="updateTodo"
  ></new-todo>

  <ul class="todo-list">
    <todo-term
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      :isEditing="todo.id === editingId"
      @toggle-completed="toggleCompleted"
      @edit-todo="editTodo"
      @end-editing="updateTodo"
      @remove-todo="removeTodo"
    ></todo-term>
  </ul>
</div>
</template>

<script>
import axios from 'axios';
import NewTodo from './newTodo.vue';
import TodoTerm from './todoTerm.vue';

export default {
/* eslint-disable no-param-reassign */
  components: {
    NewTodo,
    TodoTerm,
  },

  // app initial state
  data() {
    return {
      todos: [],
      newTodoTitle: '',
      editingId: null,
    };
  },

  // methods that implement data logic.
  methods: {
    toggleCompleted(todo) {
      // update todo if is editing
      if (this.editingId) this.updateTodo();

      axios
        .put(`/api/todos/${todo.id}`, {
          completed: !todo.completed,
        })
        .then((response) => {
          todo.completed = !todo.completed;
        })
        .catch(this.handleError);
    },

    addTodo(title) {
      axios
        .post('/api/todos', {
          title,
          completed: false,
          creator: navigator.userAgent,
        })
        .then((response) => {
          this.todos.push(response.data);
        })
        .catch(this.handleError);
    },

    editTodo(todo) {
      this.editingId = todo.id;
    },

    updateTodo() {
      if (this.editingId) {
        const todo = this.todos.find(n => n.id === this.editingId);
        todo.title = todo.title.trim();

        axios
          .put(`/api/todos/${todo.id}`, {
            title: todo.title,
            completed: todo.completed,
            creator: navigator.userAgent,
          })
          .then((response) => {
            this.editingId = null;
          })
          .catch(this.handleError);
      }
    },

    removeTodo(todo) {
      const idx = this.todos.indexOf(todo);
      this.todos.splice(idx, 1);
    },

    handleError(error) {
      console.log(error);
    }
  },

  mounted() {
    axios
      .get('/api/todos')
      .then(response => {
        this.todos = response.data;
      })
      .catch(this.handleError);
  }
};
</script>

<style lang="scss">
.card {
  background: #fff;
  width: 48%;
  max-width: 720px;
  margin: auto;
  padding: 2em;
  box-shadow:
    2px 3px 9px 2px rgba(0, 0, 0, 0.05),
    0 8px 48px 0 rgba(0, 0, 0, 0.1);
}

.todo-list {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
</style>
