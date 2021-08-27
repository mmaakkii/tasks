"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskList = exports.Task = exports.Tag = exports.Comment = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const Models_1 = require("../../global/Models");
const utils_1 = require("../../global/utils");
const constants_1 = require("./constants");
const CommentSchema = utils_1.extend(Models_1.BaseModelSchema, {
    uid: {
        type: String,
        auto: true,
        unique: true,
        default: () => {
            return utils_1.getModelUID('comment');
        },
    },
    text: String,
    media: Array,
});
const TagSchema = utils_1.extend(Models_1.BaseModelSchema, {
    uid: {
        type: String,
        auto: true,
        unique: true,
        default: () => {
            return utils_1.getModelUID('tag');
        },
    },
    name: {
        type: String,
        required: [true, 'A tag must have a name'],
        unique: [true, 'A tag with that name already exists'],
        trim: true,
    },
});
const TaskSchema = new mongoose_1.Schema(Object.assign(Object.assign({}, Models_1.BaseModelSchema.obj), { uid: {
        type: String,
        auto: true,
        unique: true,
        default: () => {
            return utils_1.getModelUID('task');
        },
    }, title: {
        type: String,
        required: [true, 'A task must have a title'],
    }, description: String, currentStatus: String, assignee: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    }, media: Array, dueDate: Date, comments: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Comment',
        },
    ], tags: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Tag',
        },
    ], linkedTasks: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Task',
        },
    ], subTasks: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Task',
        },
    ], collaborators: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ], taskList: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'TaskList',
    } }), {
    timestamps: true,
});
TaskSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const taskListDoc = yield exports.TaskList.findById(this.taskList._id);
        this.currentStatus = taskListDoc === null || taskListDoc === void 0 ? void 0 : taskListDoc.title;
        next();
    });
});
const TaskListSchema = new mongoose_1.Schema(Object.assign(Object.assign({}, Models_1.BaseModelSchema.obj), { uid: {
        type: String,
        auto: true,
        unique: true,
        default: () => {
            return utils_1.getModelUID('task_list');
        },
    }, title: {
        type: String,
        required: true,
    }, owner: {
        type: String,
        required: true,
    }, ownerType: {
        type: String,
        enum: [constants_1.TaskListOwnerTypes.INDIVIDUAL, constants_1.TaskListOwnerTypes.ORGANIZATION],
        required: true,
    }, showOnBoard: {
        type: Boolean,
        default: true,
    } }));
exports.Comment = mongoose_1.default.model('Comment', CommentSchema);
exports.Tag = mongoose_1.default.model('Tag', TagSchema);
exports.Task = mongoose_1.default.model('Task', TaskSchema);
exports.TaskList = mongoose_1.default.model('TaskList', TaskListSchema);
// https://stackoverflow.com/questions/34985846/mongoose-document-references-with-a-one-to-many-relationship
