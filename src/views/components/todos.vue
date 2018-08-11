<template>
<div>
  <datepicker
    v-model="dateRaw"
    :inline="true"
    format="yyyy-MMM-dd"
  ></datepicker>

  <div class="card" @click="clearSelected">
    <new-todo
      :picker-date="date"
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
      ></todo-term>
    </ul>
  </div>

  <google-calendar
    :todos="todos"
  ></google-calendar>
</div>
</template>

<script>
import { mapState } from 'vuex'
import Datepicker from 'vuejs-datepicker';
import NewTodo from './newTodo.vue';
import TodoTerm from './todoTerm.vue';
import GoogleCalendar from './googCalendar.vue';

const TIME_ZONE_OFFSET = new Date().getTimezoneOffset() * 60000; // in milliseconds

export default {
  components: {
    Datepicker,
    NewTodo,
    TodoTerm,
    GoogleCalendar,
  },

  data() {
    return {
      dateRaw: new Date(new Date().toDateString()),
      selectedId: null,
    };
  },

  computed: {
    ...mapState({
      todos: state => state.todos.all,
    }),

    date() {
      return new Date(this.dateRaw - TIME_ZONE_OFFSET)
        .toISOString()
        .substr(0, 10);
    },
  },

  methods: {
    getTodoDetail(todo) {
      this.$store.dispatch('getTodoDetail', todo);
    },

    selectTodo(todo) {
      this.selectedId = (this.selectedId === todo.id) ? null : todo.id;
      this.setDate(todo.date);

      if (this.selectedId && !todo.updatedAt) {
        this.getTodoDetail(todo);
      }
    },

    updateTodo(todo) {
      this.$store.dispatch('updateTodo', todo);
    },

    clearSelected() {
      this.selectedId = null;
    },

    setDate(dateString) {
      this.dateRaw = new Date(dateString);
    },

    removeTodo(todo) {
      this.$store.dispatch('removeTodo', todo);
    },
  },

  mounted() {
    this.$store.dispatch('getAllTodos');
  }
};
</script>

<style lang="scss">
$color-main: #00d1b2;

.card {
  background: #fff;
  width: 50%;
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
