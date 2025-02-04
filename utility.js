// const {v4: uuid4} = require('uuid');
const uuid = require('uuid'); // npm
const uuid4 = uuid.v4;

module.exports.generateTodo = function(title) {
    let todo;

    if (this.isTitleValid(title)) {
        todo = {};
        todo.title = title;
        todo.id = uuid4();
    }

    return todo;
}

module.exports.isTitleValid = function(title) {
    if (title !== undefined && typeof(title) === 'string' && title.length) {
        return true;
    }

    return false;
}