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
    <i class="icon icon-check" @click="$emit('toggle-completed', todo)"></i>
    <span class="todo-title">{{todo.title}}</span>
    <span class="tools">
      <i class="icon icon-edit hover" @click="$emit('edit-todo', todo)"></i>
      <i class="icon icon-remove hover" @click="$emit('remove-todo', todo)"></i>
      <i class="icon icon-more"></i>
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
$color-checked: #00D1B2;

.todo-list {
  li {
    position: relative;
    padding: 0.5em 1em;
    line-height: 1.5;

    input {
      padding-left: 1.5em;
      padding-right: 0.75em;
      width: calc(100% - 2.5em);
      height: 1.5em;
      outline: none;
      border: none;
      border-radius: 1em;
      background: #f0f0f0;
    }
  }

  .todo-title {
    display: inline-block;
    vertical-align: middle;
    max-width: calc(100% - 3.5em);
    margin-left: 0.5em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .completed {
    .todo-title {
      color: $color-checked;
    }

    .icon-check {
      opacity: 0.8;
      background: url(/imgs/icons/check-b.svg);

      &:hover {
        opacity: 1;
      }
    }
  }

  .tools {
    position: absolute;
    right: 0;
    top: 0;
    padding: 0.5em;

    .icon {
      &:first-child {
        margin-right: 0.5em;
      }
    }

    .icon-more {
      cursor: default;
    }

    .hover {
      display: none;
    }

    &:hover {
      background: #fff;

      .hover {
        display: inline-block;
      }
    }
  }
}

.icon {
  display: inline-block;
  width: 1.25em;
  height: 1.25em;
  background-size: auto;
  background-position: center;
  background-repeat: no-repeat;
  vertical-align: middle;
  opacity: 0.33;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    transform: translateY(1px);
  }

  &-check {
    background-image: url(/imgs/icons/check.svg);
  }

  &-more {
    background-image: url(/imgs/icons/caret-left.svg);
  }

  &-edit {
    background-image: url(/imgs/icons/edit.svg);
  }

  &-remove {
    background-image: url(/imgs/icons/delete.svg);
  }
}
</style>
