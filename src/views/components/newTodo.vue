<template>
<div class="new-todo-field">
  <input
    class="new-todo"
    autofocus autocomplete="off"
    placeholder="What needs to be done?"
    v-model="title"
    @keyup.enter="addTodo"
    @focus="$emit('input-focus')"
  >
</div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';

export default {
  data() {
    return {
      title: '',
    };
  },

  methods: {
    addTodo() {
      const value = this.title && this.title.trim();
      if (!value) {
        return;
      }
      this.$emit('add-todo', value);
      this.title = '';
    },
  },
};
</script>

<style lang="scss">
.new-todo-field {
  padding: 0 1em;
  border-bottom: 0.08em solid #d9d9d9;
  margin-bottom: 0.5em;

  .new-todo {
    width: 100%;
    height: 3em;
    border: none;
    outline: none;
    background: transparent;
  }
}
</style>
