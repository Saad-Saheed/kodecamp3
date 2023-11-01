"use-strict";

function asyncWrapper(fn) {
    return async function(req, res, next){
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error);
        }
    }
}

export default asyncWrapper;