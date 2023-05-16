const ApplicationError = require("./ApplicationError");

class LimitTasksError extends ApplicationError {
  constructor(message) {
    super(403, message || 'Limit tasks exceeded!!!');
  }
}

module.exports = LimitTasksError;