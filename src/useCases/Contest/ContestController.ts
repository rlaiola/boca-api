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
import { UserType } from "../../shared/definitions/UserType";
import { AuthPayload } from "../../shared/definitions/AuthPayload";

import { ContestRequestValidator } from "../../shared/validation/requests/ContestRequestValidator";

import IdValidator from "../../shared/validation/utils/IdValidator";

import { ApiError } from "../../errors/ApiError";

import { CreateContestsUseCase } from "./CreateContestUseCase";
import { DeleteContestsUseCase } from "./DeleteContestUseCase";
import { GetContestsUseCase } from "./GetContestUseCase";
import { ListContestsUseCase } from "./ListContestsUseCase";
import { UpdateContestUseCase } from "./UpdateContestUseCase";

class ContestController {
  async listAll(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    const listContestsUseCase = container.resolve(ListContestsUseCase);

    // current user
    const userPayload: AuthPayload = request.body.authtoken;

    try {
      const all = await listContestsUseCase.execute({ currUser: userPayload });
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
    const getContestsUseCase = container.resolve(GetContestsUseCase);
    const idValidator = container.resolve(IdValidator);

    const { id_c } = request.params;
    const contestnumber = Number(id_c);

    // current user
    const userPayload: AuthPayload = request.body.authtoken;

    try {
      idValidator.isContestId(contestnumber);

      // check whether it's the fake contest or the user is not of system type
      // and the contest is not the one the user is currently registered in
      if (contestnumber === 0 || (userPayload.usertype !== UserType.SYSTEM && 
                                  userPayload.contestnumber != contestnumber)) {
        throw ApiError.forbidden(
          "Authenticated user is unauthorized to use this endpoint"
        );
      }

      // otherwise, retrieve contest
      const contest = await getContestsUseCase.execute({ contestnumber });

      return response
        .status(HttpStatus.SUCCESS)
        .json(contest);
    } catch (error) {
      next(error);
    }
  }

  async create(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    const createContestsUseCase = container.resolve(CreateContestsUseCase);
    const contestRequestValidator = container.resolve(ContestRequestValidator);

    const {
      contestnumber,
      contestname,
      conteststartdate,
      contestduration,
      contestlastmileanswer,
      contestlastmilescore,
      contestpenalty,
      contestmaxfilesize,
      contestmainsiteurl,
      contestunlockkey,
      contestkeys,
      contestmainsite,
      contestlocalsite,
      contestactive,
    } = request.body;

    try {
      contestRequestValidator.hasRequiredCreateProperties(request.body);

      const contest = await createContestsUseCase.execute({
        contestnumber,
        contestname,
        conteststartdate,
        contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        contestpenalty,
        contestmaxfilesize,
        contestmainsiteurl,
        contestunlockkey,
        contestkeys,
        contestmainsite,
        contestlocalsite,
        contestactive,
      });

      // add content-location http header to indicate how to access the new contest
      return response
        .setHeader('Content-Location', `/api/contest/${contest.contestnumber}`)
        .status(HttpStatus.CREATED)
        .json(contest);
    } catch (error) {console.log(error);
      next(error);
    }
  }

  async update(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    const updateContestUseCase = container.resolve(UpdateContestUseCase);
    const idValidator = container.resolve(IdValidator);
    
    const { id_c } = request.params;
    const contestnumber = Number(id_c);

    // current user
    const userPayload: AuthPayload = request.body.authtoken;

    let {
      contestname,
      conteststartdate,
      contestduration,
      contestlastmileanswer,
      contestlastmilescore,
      contestpenalty,
      contestmaxfilesize,
      contestlocalsite,
      contestactive,
    } = request.body;

    const {
      contestmainsiteurl,
      contestunlockkey,
      contestkeys,
      contestmainsite,
    } = request.body;

    try {
      idValidator.isContestId(contestnumber);

      // check whether it's the fake contest or the user is of admin type
      // and the contest is not the one the user is currently registered in
      if (contestnumber === 0 || (userPayload.usertype == UserType.ADMIN && 
                                  userPayload.contestnumber != contestnumber)) {
        throw ApiError.forbidden(
          "Authenticated user is unauthorized to use this endpoint"
        );
      }

      // user of admin type can only edit a few properties
      if (userPayload.usertype == UserType.ADMIN) {
        contestname = undefined;
        conteststartdate = undefined;
        contestduration = undefined;
        contestlastmileanswer = undefined;
        contestlastmilescore = undefined;
        contestpenalty = undefined;
        contestmaxfilesize = undefined;
        //contestmainsiteurl
        //contestunlockkey
        //contestkeys
        //contestmainsite
        contestlocalsite = undefined;
        contestactive = undefined;
      }

      await updateContestUseCase.execute({
        contestnumber,
        contestname,
        conteststartdate,
        contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        contestpenalty,
        contestmaxfilesize,
        contestmainsiteurl,
        contestunlockkey,
        contestkeys,
        contestmainsite,
        contestlocalsite,
        contestactive,
      });

      return response
        .status(HttpStatus.UPDATED)
        .json();
    } catch (error) {
      next(error);
    }
  }

  async delete(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    const deleteContestsUseCase = container.resolve(DeleteContestsUseCase);
    const idValidator = container.resolve(IdValidator);

    const { id_c } = request.params;
    const contestnumber = Number(id_c);

    try {
      idValidator.isContestId(contestnumber);

      // Not even users of system type can delete the fake contest
      if (contestnumber === 0) {
        throw ApiError.forbidden(
          "Authenticated user is unauthorized to use this endpoint"
        );
      }

      await deleteContestsUseCase.execute({ contestnumber: contestnumber });

      return response
        .status(HttpStatus.DELETED)
        .json();
    } catch (error) {
      next(error);
    }
  }
}

export { ContestController };
