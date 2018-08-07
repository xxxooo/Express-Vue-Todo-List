<template>
<div>
  <datepicker
    v-model="dateRaw"
    :inline="true"
    format="yyyy-MMM-dd"
  ></datepicker>

  <div class="card" @click="clearSelected">
    <new-todo
      @add-todo="addTodo"
      @input-focus="clearSelected"
    ></new-todo>

    <ul class="todos">
      <todo-term
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        :is-selected="todo.id === selectedId"
        :picker-date="date"
        @set-date="setDate"
        @select-todo="selectTodo"
        @update-todo="updateTodo"
        @remove-todo="removeTodo"
      ></todo-term>
    </ul>
  </div>

  <google-calendar
    :todos="todos"
    @update-todo="updateTodo"
  ></google-calendar>
</div>
</template>

<script>
import axios from 'axios';
import Datepicker from 'vuejs-datepicker';
import NewTodo from './newTodo.vue';
import TodoTerm from './todoTerm.vue';
import GoogleCalendar from './googCalendar.vue';

const TIME_ZONE_OFFSET = new Date().getTimezoneOffset() * 60000; // in milliseconds

export default {
/* eslint-disable no-param-reassign */
  components: {
    Datepicker,
    NewTodo,
    TodoTerm,
    GoogleCalendar,
  },

  data() {
    return {
      dateRaw: new Date(new Date().toDateString()),
      todos: [],
      selectedId: null,
    };
  },

  computed: {
    date() {
      return new Date(this.dateRaw - TIME_ZONE_OFFSET)
        .toISOString()
        .substr(0, 10);
    },
  },

  methods: {
    addTodo(title) {
      axios
        .post('/api/todos', {
          title,
          detail: '',
          creator: 'user',
          date: this.date,
          completed: false,
        })
        .then((response) => {
          this.todos.push(response.data);
        })
        .catch(this.handleError);
    },

    getTodoDetail(todo) {
      axios
        .get(`/api/todos/${todo.id}`)
        .then((response) => {
          const idx = this.todos.indexOf(todo);
          this.todos[idx] = response.data;
          this.$forceUpdate();
        })
        .catch(this.handleError);
    },

    selectTodo(todo) {
      this.selectedId = (this.selectedId === todo.id) ? null : todo.id;

      if (this.selectedId && !todo.updatedAt) {
        this.getTodoDetail(todo);
      }
    },

    updateTodo(todo) {
      axios
        .patch(`/api/todos/${todo.id}`, todo)
        .then((response) => {
          this.getTodoDetail(todo);
        })
        .catch(this.handleError);
    },

    clearSelected() {
      this.selectedId = null;
    },

    setDate(dateString) {
      this.dateRaw = new Date(dateString);
    },

    removeTodo(todo) {
      const idx = this.todos.indexOf(todo);
      this.todos.splice(idx, 1);
    },

    handleError(error) {
      console.log(error);
    },
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
$color-main: #00d1b2;

.card {
  background: #fff;
  width: 50%;
  max-width: 720px;
  margin: auto;
  padding: 2em;
  border-radius: 0.75em;
  box-sizing: border-box;
  box-shadow:
    0.1em 0.2em 0.66em 0.1em rgba(0, 0, 0, 0.05),
    0 0.5em 4em 0 rgba(0, 0, 0, 0.1);
}

.todos {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

// customize datepicker
.main-wrapper {
  .vdp-datepicker__calendar {
    margin: 0 auto 1.5em;
    border: 0;
    background: transparent;
    width: 14em;
    color: #999;

    .prev,
    .next {
      opacity: 0.33;

      &:hover {
        opacity: 0.85;
      }
    }

    .cell {
      border-radius: 1em;
      width: 2em;
      height: 2em;
      line-height: 2em;
      box-sizing: border-box;

      &:hover {
        border-width: 2px;
      }

      &.day-header {
        width: 2.666em;
      }

      &.selected {
        background: $color-main;
        color: #fff;

        &:hover {
          background: $color-main;
        }
      }

      &:not(.blank):not(.disabled).day:hover {
        border-color: $color-main;
        color: #333;
      }
    }
  }
}
</style>
