import { Router } from 'express';
import PostController from '../http/controllers/post.js';
import authenticated from '../http/middlewares/authenticated.js';
import isPostOwner from '../http/middlewares/isPostOwner.js';

const postController = new PostController();

const postRoutes = Router();

postRoutes.get('/', postController.index);
postRoutes.get('/:id', postController.show);
postRoutes.post('/', [authenticated], postController.create);
postRoutes.patch('/:id', [authenticated, isPostOwner], postController.update);
postRoutes.delete('/:id', [authenticated, isPostOwner], postController.delete);

export default postRoutes;
