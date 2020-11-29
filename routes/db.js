const _ = require('underscore');

module.exports = {
    findByUsername(username, cb) {
        let user = _.find(users, (elem) => { return elem.username === username; });
        if (!user) {
            cb(null, null);
        } else {
            cb(null, user);
        }
    }
}
