<template>
<div class="card">
  <new-todo
    :todo-title="newTodoTitle"
    @add-todo="addTodo"
    @input-focus="endEditing"
  ></new-todo>

  <ul class="todo-list">
    <todo-term
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      :isEditing="todo.id === editingId"
      @toggle-completed="toggleCompleted"
      @edit-todo="editTodo"
      @end-editing="endEditing"
      @remove-todo="removeTodo"
    ></todo-term>
  </ul>
</div>
</template>

<script>
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
      todo.completed = !todo.completed;
    },

    addTodo(title) {
      this.todos.push({
        id: Date.now(),
        title,
        completed: false,
      });
    },

    editTodo(todo) {
      this.editingId = todo.id;
    },

    endEditing() {
      this.editingId = null;
    },

    removeTodo(todo) {
      const idx = this.todos.indexOf(todo);
      this.todos.splice(idx, 1);
    },
  },
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
