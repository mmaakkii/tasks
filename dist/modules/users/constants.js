"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthErrors = exports.UserTypes = exports.UserIdentifierType = void 0;
var UserIdentifierType;
(function (UserIdentifierType) {
    UserIdentifierType["ID"] = "id";
    UserIdentifierType["EMAIL"] = "email";
})(UserIdentifierType = exports.UserIdentifierType || (exports.UserIdentifierType = {}));
var UserTypes;
(function (UserTypes) {
    UserTypes["INDIVIDUAL"] = "IndividualUser";
    UserTypes["ORGANIZATION"] = "OrganizationUser";
})(UserTypes = exports.UserTypes || (exports.UserTypes = {}));
var AuthErrors;
(function (AuthErrors) {
    AuthErrors["INACTIVE"] = "No active user found with provided credentials";
    AuthErrors["USER_NOT_VERIFIED"] = "Email address belonging to user not verified.";
    AuthErrors["EMAIL_VERIFICATION_FAILED"] = "Email verification failed, Token is invalid or expired.";
    AuthErrors["USER_NOT_FOUND"] = "The user belonging to this token does no longer exist.";
    AuthErrors["NOT_LOGGED_IN"] = "You are not logged in, Please log in to access this.";
    AuthErrors["USER_CHANGED_PASSWORD"] = "User recently changed the password";
    AuthErrors["INVALID_CURRENT_PASSWORD"] = "Your current password is wrong";
    AuthErrors["INVALID_TOKEN"] = "Token is invalid or expired.";
    AuthErrors["TOKEN_NOT_FOUND"] = "Token not found in the url";
    AuthErrors["REFRESH_TOKEN_NOT_FOUND"] = "Refresh token not found";
    AuthErrors["INCORRECT_CREDENTIALS"] = "Incorrect email or password";
    AuthErrors["USER_NOT_PERMITTED"] = "You do not have permission to perform this action.";
})(AuthErrors = exports.AuthErrors || (exports.AuthErrors = {}));
