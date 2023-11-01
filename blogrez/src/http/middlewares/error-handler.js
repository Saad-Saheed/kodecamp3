"use-strict";

import ApiCustomError from "../errors/api-custom-error.js";
import { StatusCodes } from "http-status-codes";


function errorHandler(error, req, res, next){
    if(error instanceof ApiCustomError){
        return res.status(error.statusCode).json({status: "failed", message: error.message});
    }else{
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: "failed", message: `Internal server error: ${error.message}`});
    }
}

export default errorHandler;