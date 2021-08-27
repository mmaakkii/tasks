import { model, Schema, HookNextFunction } from 'mongoose';
import { BaseModelSchema } from '@global/Models';
import { getModelUID } from '@global/utils';
import {
  IOrganizationDocument,
  IOrganizationModel,
} from './types/Organization.types';

const OrganizationSchema = new Schema<
  IOrganizationDocument,
  IOrganizationModel
>(
  {
    ...BaseModelSchema.obj,
    uid: {
      type: String,
      auto: true,
      unique: true,
      default: () => {
        return getModelUID('org');
      },
    },
    name: {
      type: String,
      required: [true, 'An organization must have a name.'],
    },
    description: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    joinedDate: {
      type: Date,
      default: Date.now(),
    },
    isSetupComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Organization = model<IOrganizationDocument, IOrganizationModel>(
  'Organization',
  OrganizationSchema
);
