'use strict'


module.exports = (options = {}) => {
    const {
    } = options
    return async function (ctx, next) {
        // Check if the request has the required header
        if (ctx.request.header("Authorization")) {
            userToken = req.header("Authorization").replace("Bearer ", "");
        }
    }
  }
  