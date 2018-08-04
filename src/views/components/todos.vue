<template>
<div class="vue-wrapper">
  <input
    class="new-todo"
    autofocus autocomplete="off"
    placeholder="What needs to be done?"
    v-model="newTodo"
    @keyup.enter="addTodo"
  >

  <div>
    <ul class="todo-list">
      <li v-for="todo in todos"
        :key="todo.id"
        :class="{ completed: todo.completed }"
      >
        <span class="todo-field">
          <input
            v-if="todo.id === editingId"
            v-model="todo.title"
            @keyup.enter="updateEdit"
            type="text"
          >
          <span v-else>{{todo.title}}</span>
        </span>
        <span class="tools">
          <button @click="toggleCompleted(todo)">check</button>
          <button @click="editTodo(todo)">edit</button>
          <button @click="removeTodo(todo)">remove</button>
        </span>
      </li>
    </ul>
  </div>
</div>
</template>

<script>

export default {
/* eslint-disable no-param-reassign */
// app initial state
  data() {
    return {
      todos: [],
      newTodo: '',
      editingId: null,
    };
  },

  // methods that implement data logic.
  // note there's no DOM manipulation here at all.
  methods: {
    toggleCompleted(todo) {
      todo.completed = !todo.completed;
    },

    addTodo() {
      const value = this.newTodo && this.newTodo.trim();
      if (!value) {
        return;
      }
      this.todos.push({
        id: Date.now(),
        title: value,
        completed: false,
      });
      this.newTodo = '';
    },

    editTodo(todo) {
      this.editingId = todo.id;
    },

    updateEdit() {
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
.vue-wrapper {
  .todo-list {
    .completed {
      .todo-field {
        text-decoration: line-through;
        color: #68F;
      }

      input {
        text-decoration: line-through;
      }
    }
  }
}
</style>
