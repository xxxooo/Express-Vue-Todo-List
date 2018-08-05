<template>
<li :class="{ completed: todo.completed }">
  <template v-if="isEditing">
    <input
      v-if="isEditing"
      v-model="todo.title"
      @keyup.enter="$emit('end-editing')"
      type="text"
    >
  </template>
  <template v-else>
    <span class="todo-title">{{todo.title}}</span>
    <span v-if="!isEditing" class="tools">
      <button @click="$emit('toggle-completed', todo)">check</button>
      <button @click="$emit('edit-todo', todo)">edit</button>
      <button @click="$emit('remove-todo', todo)">remove</button>
    </span>
  </template>
</li>
</template>

<script>
export default {
  props: {
    todo: Object,
    isEditing: Boolean,
  },
};
</script>

<style lang="scss">
.todo-list {
  .completed {
    .todo-title {
      text-decoration: line-through;
      color: #68F;
    }
  }
}
</style>
