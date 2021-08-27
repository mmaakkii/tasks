"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseModelSchema = void 0;
const mongoose_1 = require("mongoose");
exports.BaseModelSchema = new mongoose_1.Schema({
    creator: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, ''],
    },
    editor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});
// https://stackoverflow.com/a/45378088
