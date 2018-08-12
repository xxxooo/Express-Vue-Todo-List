import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
/* eslint-disable import/no-unresolved */
import TodoTerm from '@/views/components/todoTerm.vue';
/* eslint-enable */

const localVue = createLocalVue();

localVue.use(Vuex);

describe('components/todoTerm.vue', () => {
  const actions = {
    updateTodo: jest.fn(),
    removeTodo: jest.fn(),
  };

  const store = new Vuex.Store({
    state: {},
    actions,
  });

  const todo = {
    title: 'test todo title',
    detail: 'todo event detail...',
    creator: 'user',
    date: '2018-08-12',
    completed: false,
    eventId: '000000',
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(TodoTerm, {
      store,
      localVue,
      propsData: {
        todo,
        isSelected: false,
        pickerDate: '2018-08-11',
      },
    });
  });

  it('todo term teaser text', () => {
    const teaserText = [todo.date, todo.title].join(' ');
    expect(wrapper.text()).toMatch(teaserText);
  });

  it('selected expand mode', () => {
    expect(wrapper.find('.tools').element).toBeUndefined();
    wrapper.setProps({ isSelected: true });
    expect(wrapper.find('.tools').element).toBeInstanceOf(HTMLSpanElement);
  });

  it('edit mode', () => {
    wrapper.setProps({ isSelected: true });
    expect(wrapper.find('input:disabled').exists()).toBe(true);
    expect(wrapper.find('input:not([disabled])').exists()).toBe(false);

    wrapper.setData({ isEditing: true });
    expect(wrapper.find('input:disabled').exists()).toBe(false);
    expect(wrapper.find('input:not([disabled])').exists()).toBe(true);
  });

  it('toggle completed', () => {
    const checkButton = wrapper.find('.todo-check');
    checkButton.trigger('click');
    expect(actions.updateTodo).toHaveBeenCalled();
  });

  it('end edit mode', () => {
    wrapper.setProps({ isSelected: true });
    wrapper.setData({ isEditing: true });
    wrapper.find('.icon-editing').trigger('click');
    expect(actions.updateTodo).toHaveBeenCalled();
  });

  it('end selected auto end edit mode', () => {
    wrapper.setProps({ isSelected: true });
    wrapper.setData({ isEditing: true });
    wrapper.setProps({ isSelected: false });
    expect(actions.updateTodo).toHaveBeenCalled();
  });

  it('remove todo', () => {
    wrapper.setProps({ isSelected: true });
    wrapper.find('.icon-remove').trigger('click');
    expect(actions.removeTodo).toHaveBeenCalled();
  });
});
