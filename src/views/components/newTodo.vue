<template>
<div class="new-todo-field">
  <input
    class="new-todo"
    autofocus autocomplete="off"
    placeholder="What needs to be done?"
    v-model="mutableTitle"
    @keyup.enter="addTodo"
    @focus="$emit('input-focus')"
  >
</div>
</template>

<script>
export default {
  props: {
    todoTitle: String,
  },

  data() {
    return {
      mutableTitle: this.todoTitle,
    };
  },

  methods: {
    addTodo() {
      const value = this.mutableTitle && this.mutableTitle.trim();
      if (!value) {
        return;
      }
      this.$emit('add-todo', this.mutableTitle);
      this.mutableTitle = '';
    },
  },
};
</script>

<style lang="scss">
.new-todo-field {
  padding: 0 1em;
  border-bottom: 1px solid #d9d9d9;

  .new-todo {
    width: 100%;
    height: 3em;
    border: none;
    outline: none;
  }
}
</style>
