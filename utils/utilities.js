const _ = require('lodash');

const updateTaskRequestWhiteList = (req) => {
    return Object.keys(_.pick(req, ['title', 'description', 'deadline']));
}

module.exports = {
    updateTaskRequestWhiteList
}