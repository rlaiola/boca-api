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

import { injectable } from "tsyringe";

import { RequestValidator } from "./RequestValidator";

const createRequiredProperties = ["problemname", "fake", "problemnumber"];

const updateFileRequiredProperties = ["probleminputfile"];

const updateRequiredProperties = ["problemname", "fake"];

@injectable()
class ProblemRequestValidator extends RequestValidator {
  hasRequiredCreateProperties(request: object): void {
    this.hasRequiredProperties(request, createRequiredProperties);
  }

  hasRequiredUpdateProperties(request: object): void {
    this.hasRequiredProperties(request, updateRequiredProperties);
  }

  hasRequiredUpdateFileProperties(request: object): void {
    this.hasRequiredProperties(request, updateFileRequiredProperties);
  }
}

export {
  ProblemRequestValidator
};
