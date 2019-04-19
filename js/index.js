function _extends() {_extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};return _extends.apply(this, arguments);} // Reducers
const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false };

    case 'TOGGLE_TODO':
      return state.id !== action.id ?
      state : { ...state, completed: !state.completed };
    default:
      return state;}

};
const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, todo(undefined, action)];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    default:
      return state;}

};
const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;}

};
const todoApp = Redux.combineReducers({
  todos,
  visibilityFilter });


// Action creators
let nextTodoId = 0;
const addTodo = text => {
  return {
    type: 'ADD_TODO',
    id: nextTodoId++,
    text };

};
const toggleTodo = id => {
  return {
    type: 'TOGGLE_TODO',
    id };

};
const setVisibilityFilter = filter => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter };

};

// Components
const { Component } = React;
const { Provider, connect } = ReactRedux;

const Link = ({ active, children, onClick }) => {
  const clickLink = e => {
    e.preventDefault();
    onClick();
  };
  const dummyLink = e => {
    e.preventDefault();
  };
  return (
    React.createElement("li", null,
    React.createElement("a", {
      href: "#",
      className: active ? "selected" : "",
      onClick: active ? dummyLink : clickLink },

    children)));



};

// FilterLink container component
const FilterLink = connect(
(state, ownProps) => ({ // mapStateToProps
  active: ownProps.filter === state.visibilityFilter }),

(dispatch, ownProps) => ({ // mapDispatchToProps
  onClick: () => {
    dispatch(setVisibilityFilter(ownProps.filter));
  } }))(

Link);

const Footer = () =>
React.createElement("footer", { className: "footer" },
React.createElement("ul", { className: "filters" },
React.createElement(FilterLink, { filter: "SHOW_ALL" }, "All"),
React.createElement(FilterLink, { filter: "SHOW_ACTIVE" }, "Active"),
React.createElement(FilterLink, { filter: "SHOW_COMPLETED" }, "Completed")));




const Todo = ({ onClick, completed, text }) =>
React.createElement("li", { className: completed ? 'completed' : '' },
React.createElement("div", { className: "view" },
React.createElement("input", {
  onClick: onClick,
  className: "toggle",
  type: "checkbox",
  checked: completed }),
React.createElement("label", null, text)));




const TodoList = ({ todos, onTodoClick }) =>
React.createElement("section", { className: "main" },
React.createElement("input", { className: "toggle-all", type: "checkbox" }),
React.createElement("ul", { className: "todo-list" },

todos.map((todo) =>
React.createElement(Todo, _extends({
  key: todo.id,
  onClick: () => onTodoClick(todo.id) },
todo)))));






let AddTodo = ({ dispatch }) => {
  const keyUpHandler = evt => {
    const ENTER = 13;
    if (evt.which === ENTER && input.value) {
      // hit enter, create new item if field isn't empty
      dispatch(addTodo(input.value));
      input.value = '';
    }
  };
  let input;
  return (
    React.createElement("header", { className: "header" },
    React.createElement("h1", null, "todos"),
    React.createElement("input", {
      autofocus: true,
      className: "new-todo",
      placeholder: "What needs to be done?",
      ref: node => {input = node;},
      onKeyDown: keyUpHandler })));



};
AddTodo = connect()(AddTodo);

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed);
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed);}

};
const VisibleTodoList = connect(
// mapStateToProps
state => ({
  todos: getVisibleTodos(state.todos, state.visibilityFilter) }),

// mapDispatchToProps
dispatch => ({
  onTodoClick: id => {dispatch(toggleTodo(id));} }))(

TodoList);

const TodoApp = () =>
React.createElement("section", { className: "todoapp" },
React.createElement(AddTodo, null),
React.createElement(VisibleTodoList, null),
React.createElement(Footer, null));



const renderApp = () => {
  const rootNode = document.getElementById('root');
  ReactDOM.render(
  React.createElement(Provider, { store: Redux.createStore(todoApp) },
  React.createElement(TodoApp, null)),

  rootNode);

};

renderApp();