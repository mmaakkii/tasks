import { Document, Model } from 'mongoose';

import { IBaseModel } from '@global/types/Models.types';

export interface IOrganization extends IBaseModel {
  name: string;
  description: string;
  isActive: boolean;
  joinedDate: Date;
  isSetupComplete: boolean;
}

export interface IOrganizationDocument extends IOrganization, Document {
  getUsers: () => Array<Record<string, any>>;
}

export interface IOrganizationModel extends Model<IOrganizationDocument> {
  activityStatus: string;
}
