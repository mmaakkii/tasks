/* eslint-disable */

import { Request, Response, NextFunction, response } from 'express';

import { catchAsync } from './catchAsync';
// import { AppError } from './appError'

// import { ITag, ITask, IComment } from '../modules/tasks/types/Tasks.types'

const createOne = (Model: any) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'created',
      data: {
        data: doc,
      },
    });
  });

interface IFactory {
  model: any;
  data?: any;
  uid?: string;
  schema?: any;
}

export class Factory implements IFactory {
  public model: any;
  public data?: any;
  public schema?: any;
  public uid?: string;
  public responseObj: Record<string, any>;

  constructor({ model, data = null, uid = null, schema = null }) {
    this.model = model;
    this.data = data;
    this.schema = schema;
    this.uid = uid;
    this.responseObj = { success: false, errors: {}, data: null };
  }

  serverError(error: any, errorType: string) {
    this.responseObj.errors[errorType] = error.message;
    this.responseObj.data = undefined;
    return this.responseObj;
  }

  success(doc: any) {
    this.responseObj.data = doc;
    this.responseObj.success = true;
    this.responseObj.errors = undefined;
    return this.responseObj;
  }

  doesNotExists() {
    this.responseObj.data = undefined;
    this.responseObj.success = false;
    this.responseObj.errors.NotFound = 'Requested resource does not exists.';
    return this.responseObj;
  }

  async performCreate() {
    try {
      const newDoc = await this.model.create(this.data);
      this.responseObj.data = newDoc;
      this.responseObj.success = true;
      this.responseObj.errors = undefined;
      return this.responseObj;
    } catch (err) {
      return this.serverError(err, 'createError');
    }
  }

  async createOne() {
    try {
      if (this.schema) {
        const isValid = this.schema.validate(this.data);
        if (isValid.error) {
          this.responseObj.errors = unescape(isValid.error.message);
          this.responseObj.data = undefined;
          return this.responseObj;
        }
      }
      const response = await this.performCreate();
      return response;
    } catch (err) {
      return this.serverError(err, 'unknown');
    }
  }

  async getOne() {
    try {
      const doc = await this.model.findOne({ uid: this.uid, isDeleted: false });
      if (doc) {
        this.responseObj.data = doc;
        this.responseObj.success = true;
        this.responseObj.errors = undefined;
        return this.responseObj;
      } else {
        return this.doesNotExists();
      }
    } catch (err) {
      return this.serverError(err, 'unknown');
    }
  }

  async updateOne() {
    try {
      const filter = { uid: this.uid };
      const doc = await this.model.findOneAndUpdate(filter, this.data, {
        new: true,
      });
      if (doc) {
        // doc.save()
        return this.success(doc);
      }
      return this.doesNotExists();
    } catch (err) {
      return this.serverError(err, 'unknown');
    }
  }

  async deleteOne() {
    try {
      const filter = { uid: this.uid, isDeleted: false };
      const update = { isDeleted: true, ...this.data };
      const doc = await this.model.findOneAndUpdate(filter, update);
      if (doc) {
        return this.success(undefined);
      }
      return this.doesNotExists();
    } catch (err) {
      return this.serverError(err, 'unknown');
    }
  }
}

export default {
  createOne,
};
