export enum UserIdentifierType {
  ID = 'id',
  EMAIL = 'email',
}

export enum UserTypes {
  INDIVIDUAL = 'IndividualUser',
  ORGANIZATION = 'OrganizationUser',
}

export enum AuthErrors {
  INACTIVE = 'No active user found with provided credentials',
  USER_NOT_VERIFIED = 'Email address belonging to user not verified.',
  EMAIL_VERIFICATION_FAILED = 'Email verification failed, Token is invalid or expired.',
  USER_NOT_FOUND = 'The user belonging to this token does no longer exist.',
  NOT_LOGGED_IN = 'You are not logged in, Please log in to access this.',
  USER_CHANGED_PASSWORD = 'User recently changed the password',
  INVALID_CURRENT_PASSWORD = 'Your current password is wrong',
  INVALID_TOKEN = 'Token is invalid or expired.',
  TOKEN_NOT_FOUND = 'Token not found in the url',
  REFRESH_TOKEN_NOT_FOUND = 'Refresh token not found',
  INCORRECT_CREDENTIALS = 'Incorrect email or password',
  USER_NOT_PERMITTED = 'You do not have permission to perform this action.',
}
