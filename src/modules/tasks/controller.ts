import { Response, Request, NextFunction } from 'express';

import { Tag, Task, Comment, TaskList } from './models';

import { Factory } from '@global/handlerFactory';
import { catchAsync } from '@global/catchAsync';
import { createTaskListSchema, createTaskSchema } from './validators';
import { getResponseStatus } from '@global/utils';
import { TaskListOwnerTypes } from './constants';

/* Task List Controllers */

export const createTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { body, user } = req;
    body.creator = user;
    const factory = new Factory({
      model: Task,
      data: body,
      schema: createTaskSchema,
    });
    const response = await factory.createOne();
    const statusCode = getResponseStatus(response, true);
    res.status(statusCode).json(response);
  }
);

export const getTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { uid } = req.params;
    const factory = new Factory({ model: Task, uid });
    const response = await factory.getOne();
    const statusCode = getResponseStatus(response);
    res.status(statusCode).json(response);
  }
);

export const updateTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { uid } = req.params;
    const { body, user } = req;
    const data = {
      ...body,
      editor: user,
      updatedAt: Date.now(),
    };
    const factory = new Factory({ model: Task, uid, data });
    const response = await factory.updateOne();
    const task = await Task.findOne({ uid });
    task.save();
    const statusCode = getResponseStatus(response);
    res.status(statusCode).json(response);
  }
);

export const deleteTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { uid } = req.params;
    const { user } = req;
    const data = {
      editor: user,
      updatedAt: Date.now(),
    };
    const factory = new Factory({ model: Task, uid, data });
    const response = await factory.deleteOne();
    const statusCode = getResponseStatus(response);
    res.status(statusCode).json(response);
  }
);

/* Task List Controllers */

export const createTaskList = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { body, user } = req;
    const data = { ...body, creator: user };
    if (user.organization) {
      data.owner = user.organization.id;
      data.ownerType = TaskListOwnerTypes.ORGANIZATION;
    } else {
      data.owner = user.id;
      data.ownerType = TaskListOwnerTypes.INDIVIDUAL;
    }
    const factory = new Factory({
      model: TaskList,
      data,
      schema: createTaskListSchema,
    });
    const response = await factory.createOne();
    const statusCode = getResponseStatus(response, true);
    res.status(statusCode).json(response);
  }
);

export const getTaskList = catchAsync(async (req: Request, res: Response) => {
  const { uid } = req.params;
  const factory = new Factory({ model: TaskList, uid });
  const response = await factory.getOne();
  const statusCode = getResponseStatus(response);
  res.status(statusCode).json(response);
});

export const updateTaskList = catchAsync(
  async (req: Request, res: Response) => {
    const { uid } = req.params;
    const { body, user } = req;
    const data = {
      ...body,
      editor: user,
      updatedAt: Date.now(),
    };
    const factory = new Factory({ model: TaskList, uid, data });
    const response = await factory.updateOne();
    const statusCode = getResponseStatus(response);
    res.status(statusCode).json(response);
  }
);

export const deleteTaskList = catchAsync(
  async (req: Request, res: Response) => {
    const { uid } = req.params;
    const { user } = req;
    const data = {
      editor: user,
      updatedAt: Date.now(),
    };
    const factory = new Factory({ model: TaskList, uid, data });
    const response = await factory.deleteOne();
    const statusCode = getResponseStatus(response);
    res.status(statusCode).json(response);
  }
);
