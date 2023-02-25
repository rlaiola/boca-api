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

enum HttpStatus {
  SUCCESS = 200,
  CREATED = 201,
  UPDATED = 204,
  DELETED = 204,
  NOT_FOUND = 404,
  BAD_REQUEST = 400,
  INTERNAL_ERROR = 500,
  ALREADY_EXISTS = 409,
  INCONSISTENCY = 409,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
}

export { HttpStatus };
