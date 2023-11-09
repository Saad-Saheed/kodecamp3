'use-strict';

import { StatusCodes } from 'http-status-codes';

function notFound(req, res) {
    return res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: 'failed', message: `Route ${req.url} does not exist` });
}

export default notFound;
