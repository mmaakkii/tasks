import { Request, Response } from 'express';
import { catchAsync } from '@global/catchAsync';
import { Factory } from '@global/handlerFactory';
import { getResponseStatus } from '@global/utils';
import { Organization } from './models';
import { createOrganizationSchema } from './validators';

export const createOrganization = catchAsync(
  async (req: Request, res: Response) => {
    const { body, user } = req;
    const data = { ...body, creator: user };
    const factory = new Factory({
      model: Organization,
      data,
      schema: createOrganizationSchema,
    });
    const response = await factory.createOne();
    const statusCode = getResponseStatus(response);
    res.status(statusCode).json(response);
  }
);

export const getOrganization = catchAsync(
  async (req: Request, res: Response) => {
    const { uid } = req.params;
    const factory = new Factory({ model: Organization, uid });
    const response = await factory.getOne();
    const statusCode = getResponseStatus(response);
    res.status(statusCode).json(response);
  }
);

export const updateOrganization = catchAsync(
  async (req: Request, res: Response) => {
    const { uid } = req.params;
    const { body, user } = req;
    const data = {
      ...body,
      editor: user,
      updatedAt: Date.now(),
    };
    const factory = new Factory({ model: Organization, uid, data });
    const response = await factory.updateOne();
    const statusCode = getResponseStatus(response);
    res.status(statusCode).json(response);
  }
);

export const deleteOrganization = catchAsync(
  async (req: Request, res: Response) => {
    const { uid } = req.params;
    const { user } = req;
    const data = {
      editor: user,
      updatedAt: Date.now(),
    };
    const factory = new Factory({ model: Organization, uid, data });
    const response = await factory.deleteOne();
    const statusCode = getResponseStatus(response);
    res.status(statusCode).json(response);
  }
);
