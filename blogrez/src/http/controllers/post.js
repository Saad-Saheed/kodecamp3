"use strict";

import Validator from "validatorjs";
import dashify from "dashify";
import asyncWrapper from "../middlewares/async-wrapper.js";
import { database } from "../../libs/prisma.js";
import { StatusCodes } from "http-status-codes";
import ApiCustomError from "../errors/api-custom-error.js";

class PostController {
  index = asyncWrapper(async (req, res) => {
    let { tags, q, page, pageSize } = req.query;
    page = parseInt(page, 10) || 1;
    pageSize = parseInt(pageSize, 10) || 2;

    if (tags && tags.length) {
      tags = tags.split(",");
      tags = tags.map((tag) => tag.toString().trim().toLowerCase());
    }

    let query = {};

    let where = {};

    if (q) {
      // if(tags)
      //   filter.where.OR["title"] = { contains: q?.trim() };
      // else
        where.title = { contains: q?.trim() };
      query = { ...query, where};
    }

    if (tags) {
      // if(q)
      //   filter.where.OR["tags"] = { hasSome: tags ?? [] }
      // else
        where.tags = { hasSome: tags ?? [] }
      query = { ...query, where};
    }

    // pagination
    let offset = (page - 1) * pageSize;
    query.skip = offset;
    query.take = pageSize;

    // get rowCount, then get post filtering and pagination
    const [count, posts] = await Promise.all([
      database.post.count({where}),
      database.post.findMany(query)
    ]);
    

    let totalPage = Math.ceil(count / pageSize);

    let pagination = {
      currentPage: page,
      pageSize,
      totalPage,
      previousPageUrl: page > 1 ? `${req.protocol}://${req.headers.host}/api/posts?page=${(page - 1)}` :  null,
      nextPageUrl: page < totalPage ? `${req.protocol}://${req.headers.host}/api/posts?page=${(page + 1)}` :  null,
    }

    return res.status(StatusCodes.OK).json({
      status: "success",
      message: "Posts fetched successfully",
      data: posts, 
      pagination
    });
  });

  show = asyncWrapper(async (req, res) => {
    let { id } = req.params;
    id = parseInt(id, 10);

    const post = await database.post.findUnique({ where: { id: id } });
    return res.status(StatusCodes.OK).json({
      status: "success",
      message: "Post fetched successfully",
      data: post,
    });
  });

  create = asyncWrapper(async (req, res) => {
    const { id: user_id } = req.user;
    let { image, title, tags, content } = req.body;

    if (tags && tags.length) {
      tags = tags.map((tag) => tag.toString().trim().toLowerCase());
    }

    const newPost = {
      image: image?.toString().trim(),
      title: title?.toString().trim(),
      tags: tags,
      slug: dashify(title),
      content: content,
      created_at: new Date(),
      updated_at: new Date(),
      userId: parseInt(user_id, 10),
    };

    // validation rules
    const rules = {
      image: "string|max:500",
      title: "required|string|min:5|max:150",
      tags: "array",
      content: "required|string|min:12",
    };

    // validate request input
    let validation = new Validator(newPost, rules);

    if (validation.passes()) {
      const createdPost = await database.post.create({ data: newPost });
      return res.status(StatusCodes.CREATED).json({
        status: "success",
        message: "Post Created Successfully",
        data: createdPost,
      });
    } else {
      const errRes = {
        status: "failed",
        ...validation.errors,
      };
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(errRes);
    }
  });

  update = asyncWrapper(async (req, res) => {
    let { id } = req.params;
    let { id: userId } = req.user;
    let { image, title, tags, content } = req.body;

    id = parseInt(id, 10);
    userId = parseInt(userId, 10);
    if (tags && tags.length) {
      tags = tags.map((tag) => tag.toString().trim().toLowerCase());
    }

    const oldPost = {
      image: image?.toString().trim(),
      title: title?.toString().trim(),
      tags: tags,
      slug: title ? dashify(title) : undefined,
      content: content,
    };

    // validation rules
    const rules = {
      image: "string|max:500",
      title: "string|min:5|max:150",
      tags: "array",
      content: "string|min:12",
    };

    // validate request input
    let validation = new Validator(oldPost, rules);

    if (validation.passes()) {
      const updatedPost = await database.post.update({
        data: oldPost,
        where: { id, userId },
      });
      return res.status(StatusCodes.OK).json({
        status: "success",
        message: "Post Updated Successfully",
        data: updatedPost,
      });
    } else {
      const errRes = {
        status: "failed",
        ...validation.errors,
      };
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(errRes);
    }
  });

  delete = asyncWrapper(async (req, res) => {
    let { id } = req.params;
    let { id: userId } = req.user;
    id = parseInt(id, 10);
    userId = parseInt(userId, 10);

    const post = await database.post.delete({ where: { id, userId } });
    return res.status(StatusCodes.OK).json({
      status: "success",
      message: "Post deleted successfully",
      data: post ? post : null,
    });
  });
}

export default PostController;
