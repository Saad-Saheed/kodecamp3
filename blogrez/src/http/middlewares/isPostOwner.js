'use strict';

import { StatusCodes } from 'http-status-codes';
import ApiCustomError from '../errors/api-custom-error.js';
import { database } from '../../libs/prisma.js';

async function isPostOwner(req, res, next) {
    try {
        let { id: post_id } = req.params;
        let { id: userId } = req.user;

        post_id = parseInt(post_id, 10);
        userId = parseInt(userId, 10);

        const post = await database.post.findUnique({
            where: { id: post_id },
            select: { userId: true },
        });

        if (!post)
            throw new ApiCustomError(
                `Post doesn't exist.`,
                StatusCodes.UNAUTHORIZED,
            );

        if (userId == post.userId) next();
        else
            throw new ApiCustomError(
                `Access Denied, You can only modify you post.`,
                StatusCodes.UNAUTHORIZED,
            );
    } catch (error) {
        throw new ApiCustomError(
            `Access Denied, ${error.message}`,
            StatusCodes.UNAUTHORIZED,
        );
    }
}

export default isPostOwner;
