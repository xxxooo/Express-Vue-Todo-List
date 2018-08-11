<template>
<li class="todo"
  :class="{
    completed: todo.completed,
    selected: isSelected,
    editing: isEditing,
  }"
  @click.stop
>
  <div v-if="isSelected">
    <span class="tools">
      <i v-if="isEditing" class="icon icon-editing" @click="endEdit"></i>
      <template v-else>
        <i class="icon icon-edit hover" @click="edit"></i>
        <i class="icon icon-remove hover" @click="remove"></i>
        <i class="icon icon-more"></i>
      </template>
    </span>
    <span class="todo-check" @click.stop="toggleCompleted">
      <i class="icon icon-check"></i>
    </span>
    <span class="todo-date" @click="handleSelect">{{todo.date}}</span>
    <div @dblclick.stop="edit">
      <div class="todo-title">
        <input type="text" v-model="localTodo.title" :disabled="!isEditing">
      </div>
      <div class="todo-detail">
        <textarea v-model="localTodo.detail" :disabled="!isEditing"></textarea>
      </div>
    </div>
    <div class="todo-updated-time">
      <span>{{updatedTime}} updated</span>
    </div>
  </div>
  <div v-else
    @click="handleSelect"
  >
    <span class="todo-check" @click.stop="toggleCompleted">
      <i class="icon icon-check"></i>
    </span>
    <span class="todo-date">{{todo.date}}</span>
    <span class="todo-title">{{todo.title}}</span>
  </div>
</li>
</template>

<script>
const TIME_ZONE_OFFSET = new Date().getTimezoneOffset() * 60000; // in milliseconds

export default {
  props: {
    todo: Object,
    isSelected: Boolean,
    pickerDate: String,
  },

  data() {
    return {
      localTodo: {},
      isEditing: false,
    }
  },

  watch: {
    pickerDate(val) {
      if (this.isEditing) {
        this.todo.date = val;
        this.$forceUpdate();
      }
    },

    isSelected(val) {
      if (val) {
        this.localTodo = Object.assign({}, this.todo);
      } else if (this.isEditing) {
        this.endEdit();
      }
    },
  },

  computed: {
    updatedTime() {
      if (!this.todo.updatedAt) {
        return '';
      }
      return new Date(this.todo.updatedAt).toLocaleString();
    },
  },

  methods: {
    handleSelect() {
      this.$emit('select-todo', this.todo);
    },

    toggleCompleted() {
      const partialTodo = {
        id: this.todo.id,
        completed: !this.todo.completed,
      };
      this.$store.dispatch('updateTodo', partialTodo);
    },

    edit() {
      this.isEditing = true;
      this.$emit('set-date', this.todo.date);
    },

    endEdit() {
      this.isEditing = false;
      this.$store.dispatch('updateTodo', this.localTodo);
    },

    remove() {
      this.$store.dispatch('removeTodo', this.todo);
    },

    handleError(error) {
      console.log(error);
    },
  },
};
</script>

<style lang="scss">
$color-main: #00d1b2;
$color-main-light: #d0f6f1;
$color-white: #fff;
$color-gray97: #f8f8f8;
$color-gray95: #f0f0f0;
$color-gray50: #777;
$color-gray20: #333;


.todo {
  position: relative;
  margin: 0.5em 0;
  line-height: 1.5;
  border-radius: 0.75em;

  > div {
    padding: 0.25em 0 0.25em 1em;
  }

  &:hover {
    background: $color-main-light;
  }

  &:active {
    box-shadow: 0.05em 0.08em 0.75em rgba(0, 0, 0, 0.15) inset;
  }

  &-date {
    display: inline-block;
    font-size: 0.75em;
    color: $color-gray50;
    vertical-align: text-top;
    margin: 0 0.25rem;
  }

  &-title {
    display: inline-block;
    vertical-align: top;
    max-width: calc(100% - 6.666em);
    color: $color-gray20;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &-detail {
    color: $color-gray20;
    font-size: 0.8em;
  }

  &-updated-time {
    text-align: right;
    color: $color-gray50;
    font-size: 0.5em;
  }

  &.selected {
    background: $color-gray95;

    > div {
    padding: 0.5em 1em;
  }

    .todo-date {
      height: 1.25rem;
      width: calc(100% - 3rem);
    }

    .todo-title {
      max-width: 100%;
      width: 100%;
      margin: 0.5em 0;
    }
  }

  input,
  textarea {
    padding: 0.25em 1em;
    width: calc(100% - 2.5em);
    outline: none;
    border: none;
    border-radius: 0.5em;

    &[disabled] {
      background: transparent;
      color: $color-gray20;
      resize: none;
    }
  }

  input {
    height: 1.25em;
  }

  textarea {
    height: 3em;
    min-height: 2em;
    resize: vertical;
  }
}

.completed {
  .todo-date,
  .todo-title {
    color: $color-main;
  }

  .icon-check {
    opacity: 0.8;
    background: url(/imgs/icons/check-b.svg);

    &:hover {
      opacity: 0.33;
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
    .hover {
      display: inline-block;
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
  vertical-align: text-bottom;
  opacity: 0.33;
  transition: opacity 0.5s;
  cursor: pointer;

  &:hover {
    opacity: 0.75;
  }

  &:active {
    transform: translateY(0.1em);
  }

  &-check {
    background-image: url(/imgs/icons/circle.svg);

    &:hover {
      background-image: url(/imgs/icons/check.svg);
    }
  }

  &-more {
    background-image: url(/imgs/icons/caret-left.svg);
  }

  &-edit {
    background-image: url(/imgs/icons/edit.svg);
  }

  &-editing {
    background-image: url(/imgs/icons/in-edit.svg);
  }

  &-remove {
    background-image: url(/imgs/icons/delete.svg);
  }

  &-sync {
    background-image: url(/imgs/icons/sync.svg);
  }

  &-authorize {
    background-image: url(/imgs/icons/user-circle.svg);
  }

  &-sign-out {
    background-image: url(/imgs/icons/user-slash.svg);
  }
}
</style>
