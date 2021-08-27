"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Organization = void 0;
const mongoose_1 = require("mongoose");
const Models_1 = require("@global/Models");
const utils_1 = require("@global/utils");
const OrganizationSchema = new mongoose_1.Schema(Object.assign(Object.assign({}, Models_1.BaseModelSchema.obj), { uid: {
        type: String,
        auto: true,
        unique: true,
        default: () => {
            return utils_1.getModelUID('org');
        },
    }, name: {
        type: String,
        required: [true, 'An organization must have a name.'],
    }, description: String, isActive: {
        type: Boolean,
        default: true,
    }, joinedDate: {
        type: Date,
        default: Date.now(),
    }, isSetupComplete: {
        type: Boolean,
        default: false,
    } }), {
    timestamps: true,
});
exports.Organization = mongoose_1.model('Organization', OrganizationSchema);
