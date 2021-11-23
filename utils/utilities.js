const _ = require('lodash');

const updateTaskRequestWhiteList = (req) => {
    return Object.keys(_.pick(req, ['name', 'description', 'deadline']));
}

module.exports = {
    updateTaskRequestWhiteList
}