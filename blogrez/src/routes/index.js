'use-strict';

import { Router } from 'express';
import authRoutes from './auth/index.js';
import postRoutes from './post.js';

const routes = Router();
routes.use('/auth', authRoutes);
routes.use('/posts', postRoutes);

export default routes;
