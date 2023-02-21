//========================================================================
// Copyright Universidade Federal do Espirito Santo (Ufes)
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// 
// This program is released under license GNU GPL v3+ license.
//
//========================================================================

import { HttpStatus } from "../shared/definitions/HttpStatusCodes";

class ApiError extends Error {
  status: number;
  message: string;

  constructor(name: string, status: number, message: string) {
    super();
    Object.setPrototypeOf(this, ApiError.prototype);
    this.status = status;
    this.message = message;
    this.name = name;
  }

  static badRequest(message: string): ApiError {
    return new ApiError("BadRequestError", HttpStatus.BAD_REQUEST, message);
  }

  static internal(message: string): ApiError {
    return new ApiError("InternalError", HttpStatus.INTERNAL_ERROR, message);
  }

  static notFound(message: string): ApiError {
    return new ApiError("NotFoundError", HttpStatus.NOT_FOUND, message);
  }

  static alreadyExists(message: string): ApiError {
    return new ApiError("AlreadyExistsError", HttpStatus.ALREADY_EXISTS, message);
  }

  static inconsistency(message: string): ApiError {
    return new ApiError("InconsistencyError", HttpStatus.INCONSISTENCY, message);
  }

  static unauthorized(message: string): ApiError {
    return new ApiError("Unauthorized", HttpStatus.UNAUTHORIZED, message);
  }

  static forbidden(message: string): ApiError {
    return new ApiError("Forbidden", HttpStatus.FORBIDDEN, message);
  }
}

const errorSchema = {
  type: "object",
  properties: {
    error: {
      type: "string",
      description: "Error type",
    },
    message: {
      type: "string",
      description: "Error message",
    },
  },
};

export { ApiError, errorSchema };
