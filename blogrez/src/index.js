"use-strict";

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import 'express-async-errors';
import routes from './routes/index.js';
import errorHandler from './http/middlewares/error-handler.js';
import notFound from './http/middlewares/not-found.js';

dotenv.config();

const APP_URL = process.env.APP_URL;
const PORT = process.env.PORT;
const app = express();

// pass body to json
app.use(express.json());
// allow cross origin resource
app.use(cors({
    origin: "*",
    optionsSuccessStatus: "200"
}));

// home route
app.use('/', express.static("public"));

// api routes
app.use('/api', routes);
// error handler
app.use(errorHandler);
// not found
app.use(notFound);

app.listen(PORT, ()=>{
    console.log(`Server running on ${APP_URL}`);
});

export default app;