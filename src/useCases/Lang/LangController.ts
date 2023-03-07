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

import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";

import { HttpStatus } from "../../shared/definitions/HttpStatusCodes";
import { AuthPayload } from "../../shared/definitions/AuthPayload";

import { LangRequestValidator } from "../../shared/validation/requests/LangRequestValidator";

import IdValidator from "../../shared/validation/utils/IdValidator";

import { ApiError } from "../../errors/ApiError";

import { CreateLangUseCase } from "./CreateLangUseCase";
import { DeleteLangUseCase } from "./DeleteLangUseCase";
import { GetLangUseCase } from "./GetLangUseCase";
import { ListLangUseCase } from "./ListLangUseCase";
import { UpdateLangUseCase } from "./UpdateLangUseCase";

class LangController {
  async listAll(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    const listLangUseCase = container.resolve(ListLangUseCase);
    const idValidator = container.resolve(IdValidator);

    const { id_c } = request.params;
    const contestnumber = Number(id_c);

    // current user
    const userPayload: AuthPayload = request.body.authtoken;

    try {
      idValidator.isContestId(contestnumber);

      // check whether it's the fake contest or the contest is not the one
      // the user is currently registered in
      if (contestnumber === 0 ||
          userPayload.contestnumber != contestnumber) {
        throw ApiError.forbidden(
          "Authenticated user is unauthorized to use this endpoint"
        );
      }

      const all = await listLangUseCase.execute({ 
        contestnumber 
      });
      return response
        .status(HttpStatus.SUCCESS)
        .json(all);
    } catch (error) {
      next(error);
    }
  }

  async getOne(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    const getLangUseCase = container.resolve(GetLangUseCase);
    const idValidator = container.resolve(IdValidator);

    const { id_c } = request.params;
    const { id_l } = request.params;
    const contestnumber = Number(id_c);
    const langnumber = Number(id_l);

    // current user
    const userPayload: AuthPayload = request.body.authtoken;

    try {
      idValidator.isContestId(contestnumber);
      idValidator.isLangId(langnumber);

      // check whether it's the fake contest or the contest is not the one
      // the user is currently registered in
      if (contestnumber === 0 ||
          userPayload.contestnumber != contestnumber) {
        throw ApiError.forbidden(
          "Authenticated user is unauthorized to use this endpoint"
        );
      }

      // otherwise, retrieve language
      const lang = await getLangUseCase.execute({
        contestnumber,
        langnumber,
      });

      return response
        .status(HttpStatus.SUCCESS)
        .json(lang);
    } catch (error) {
      next(error);
    }
  }

  async create(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    const createLangUseCase = container.resolve(CreateLangUseCase);
    const idValidator = container.resolve(IdValidator);
    const langRequestValidator = container.resolve(LangRequestValidator);

    const { id_c } = request.params;
    const contestnumber = Number(id_c);

    // current user
    const userPayload: AuthPayload = request.body.authtoken;

    const {
      langnumber,
      langname, 
      langextension
    } = request.body;

    try {
      idValidator.isContestId(contestnumber);
      langRequestValidator.hasRequiredCreateProperties(request.body);

      // check whether it's the fake contest or the contest is not the one
      // the user is currently registered in
      if (contestnumber === 0 ||
          userPayload.contestnumber != contestnumber) {
        throw ApiError.forbidden(
          "Authenticated user is unauthorized to use this endpoint"
        );
      }

      const lang = await createLangUseCase.execute({
        contestnumber,
        langnumber,
        langname,
        langextension,
      });

      return response
        .setHeader('Content-Location', 
          `/api/contest/${lang.contestnumber}/language/${lang.langnumber}`)
        .status(HttpStatus.CREATED)
        .json(lang);
    } catch (error) {
      next(error);
    }
  }

  async update(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    const updateLangUseCase = container.resolve(UpdateLangUseCase);
    const idValidator = container.resolve(IdValidator);

    const { id_c } = request.params;
    const { id_l } = request.params;
    const contestnumber = Number(id_c);
    const langnumber = Number(id_l);

    // current user
    const userPayload: AuthPayload = request.body.authtoken;

    const { 
      langname, 
      langextension 
    } = request.body;

    try {
      idValidator.isContestId(contestnumber);
      idValidator.isLangId(langnumber);

      // check whether it's the fake contest or the contest is not the one
      // the user is currently registered in
      if (contestnumber === 0 ||
        userPayload.contestnumber != contestnumber) {
        throw ApiError.forbidden(
          "Authenticated user is unauthorized to use this endpoint"
        );
      }
  
      const updatedLang = await updateLangUseCase.execute({
        contestnumber,
        langnumber,
        langname,
        langextension,
      });

      return response
        .status(HttpStatus.UPDATED)
        .json(updatedLang);
    } catch (error) {
      next(error);
    }
  }

  async delete(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    const deleteLangUseCase = container.resolve(DeleteLangUseCase);
    const idValidator = container.resolve(IdValidator);

    const { id_c } = request.params;
    const { id_l } = request.params;
    const contestnumber = Number(id_c);
    const langnumber = Number(id_l);

    // current user
    const userPayload: AuthPayload = request.body.authtoken;

    try {
      idValidator.isContestId(contestnumber);
      idValidator.isLangId(langnumber);

      // check whether it's the fake contest or the contest is not the one
      // the user is currently registered in
      if (contestnumber === 0 ||
        userPayload.contestnumber != contestnumber) {
        throw ApiError.forbidden(
          "Authenticated user is unauthorized to use this endpoint"
        );
      }
      
      await deleteLangUseCase.execute({
        contestnumber,
        langnumber
      });

      return response
        .status(HttpStatus.DELETED)
        .json();
    } catch (error) {
      next(error);
    }
  }
}

export { LangController };
