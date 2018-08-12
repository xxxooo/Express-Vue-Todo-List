import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
/* eslint-disable import/no-unresolved */
import NewTodo from '@/views/components/newTodo.vue';
/* eslint-enable */

const localVue = createLocalVue();

localVue.use(Vuex);

describe('components/newTodo.vue', () => {
  const actions = {
    addTodo: jest.fn(),
  };

  const store = new Vuex.Store({
    state: {},
    actions,
  });

  const defaultTitle = '';
  const title = 'new event title';

  let wrapper;
  let input;

  beforeEach(() => {
    wrapper = shallowMount(NewTodo, { store, localVue });
    input = wrapper.find('input');
  });

  it('input data bind', () => {
    expect(input.element.value).toMatch(defaultTitle);
    wrapper.setData({ title });
    expect(input.element.value).toMatch(title);
  });

  it('input ENTER keyup', () => {
    // empty input value not dispatch
    input.trigger('keyup.enter');
    expect(actions.addTodo).not.toHaveBeenCalled();

    wrapper.setData({ title });
    input.trigger('keyup.enter');
    expect(actions.addTodo).toHaveBeenCalled();
    expect(input.element.value).toMatch(defaultTitle);
  });
});
