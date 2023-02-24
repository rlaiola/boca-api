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

import "reflect-metadata";

import { container } from "tsyringe";
import { NextFunction, Request, Response } from "express";

import { GenerateTokenUseCase } from "./GenerateTokenUseCase";

import { HttpStatus } from "../../shared/definitions/HttpStatusCodes";

class AuthController {
  async getToken(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    const generateTokenUseCase = container.resolve(GenerateTokenUseCase);

    const name = request.query.name as string;
    const password = request.query.password as string;

    try {
      const token = await generateTokenUseCase.execute({
        name,
        saltedPassword: password,
      });

      // add expires http header with expiration date in the response
      const expiresIn = process.env.TOKEN_EXPIRES_IN_SECONDS + "s";
      const expireDate = new Date(Date.now() + 
                                   parseInt(expiresIn) * 1000);
      return response.setHeader('Expires', expireDate.toUTCString())
                     .status(HttpStatus.SUCCESS)
                     .json({ accessToken: token });
    } catch (error) {
      next(error);
    }
  }
}

export { AuthController };
