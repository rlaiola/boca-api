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

import ContestValidator from "../../shared/validation/entities/ContestValidator";

import { SiteRequestValidator } from "../../shared/validation/requests/SiteRequestValidator";

import IdValidator from "../../shared/validation/utils/IdValidator";

import { ApiError } from "../../errors/ApiError";

import { CreateSiteUseCase } from "./CreateSiteUseCase";
import { DeleteSiteUseCase } from "./DeleteSiteUseCase";
import { GetSiteUseCase } from "./GetSiteUseCase";
import { ListSitesUseCase } from "./ListSitesUseCase";
import { UpdateSiteUseCase } from "./UpdateSiteUseCase";

class SiteController {
  async listAll(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    const listSitesUseCase = container.resolve(ListSitesUseCase);
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
          (userPayload.usertype != UserType.SYSTEM &&
          userPayload.contestnumber != contestnumber)) {
        throw ApiError.forbidden(
          "Authenticated user is unauthorized to use this endpoint"
        );
      }

      const all = await listSitesUseCase.execute({
        contestnumber,
        currUser: userPayload,
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
    const getSiteUseCase = container.resolve(GetSiteUseCase);
    const idValidator = container.resolve(IdValidator);

    const { id_s } = request.params;
    const { id_c } = request.params;
    const sitenumber = Number(id_s);
    const contestnumber = Number(id_c);

    // current user
    const userPayload: AuthPayload = request.body.authtoken;

    try {
      idValidator.isContestId(contestnumber);
      idValidator.isSiteId(sitenumber);

      // check whether it's the fake contest or the contest/site is not the
      // one the user is currently registered in
      if (contestnumber === 0 || 
          (userPayload.usertype != UserType.SYSTEM &&
           userPayload.contestnumber != contestnumber) ||
          (userPayload.usertype != UserType.SYSTEM &&
           userPayload.usertype != UserType.ADMIN &&
           userPayload.usersitenumber != sitenumber)) {
        throw ApiError.forbidden(
          "Authenticated user is unauthorized to use this endpoint"
        );
      }
  
      const site = await getSiteUseCase.execute({
        contestnumber,
        sitenumber,
      });

      return response
        .status(HttpStatus.SUCCESS)
        .json(site);
    } catch (error) {
      next(error);
    }
  }

  async create(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    const createSiteUseCase = container.resolve(CreateSiteUseCase);
    const idValidator = container.resolve(IdValidator);
    const siteRequestValidator = container.resolve(SiteRequestValidator);

    const { id_c } = request.params;
    const contestnumber = Number(id_c);

    const {
      sitenumber,
      siteip,
      sitename,
      siteactive,
      sitepermitlogins,
      sitelastmileanswer,
      sitelastmilescore,
      siteduration,
      siteautoend,
      sitejudging,
      sitetasking,
      siteglobalscore,
      sitescorelevel,
      sitenextuser,
      sitenextclar,
      sitenextrun,
      sitenexttask,
      sitemaxtask,
      sitechiefname,
      siteautojudge,
      sitemaxruntime,
      sitemaxjudgewaittime,
    } = request.body;

    try {
      idValidator.isContestId(contestnumber);
      siteRequestValidator.hasRequiredCreateProperties(request.body);

      const site = await createSiteUseCase.execute({
        contestnumber,
        sitenumber,
        siteip,
        sitename,
        siteactive,
        sitepermitlogins,
        sitelastmileanswer,
        sitelastmilescore,
        siteduration,
        siteautoend,
        sitejudging,
        sitetasking,
        siteglobalscore,
        sitescorelevel,
        sitenextuser,
        sitenextclar,
        sitenextrun,
        sitenexttask,
        sitemaxtask,
        sitechiefname,
        siteautojudge,
        sitemaxruntime,
        sitemaxjudgewaittime,
      });

      return response.status(HttpStatus.CREATED).json(site);
    } catch (error) {
      next(error);
    }
  }

  async update(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    const updateSiteUseCase = container.resolve(UpdateSiteUseCase);
    const idValidator = container.resolve(IdValidator);
    const siteRequestValidator = container.resolve(SiteRequestValidator);

    const { id_s } = request.params;
    const { id_c } = request.params;
    const sitenumber = Number(id_s);
    const contestnumber = Number(id_c);

    const {
      siteip,
      sitename,
      siteactive,
      sitepermitlogins,
      sitelastmileanswer,
      sitelastmilescore,
      siteduration,
      siteautoend,
      sitejudging,
      sitetasking,
      siteglobalscore,
      sitescorelevel,
      sitenextuser,
      sitenextclar,
      sitenextrun,
      sitenexttask,
      sitemaxtask,
      sitechiefname,
      siteautojudge,
      sitemaxruntime,
      sitemaxjudgewaittime,
    } = request.body;

    try {
      idValidator.isContestId(contestnumber);
      idValidator.isSiteId(sitenumber);
      siteRequestValidator.hasRequiredUpdateProperties(request.body);

      const updatedSite = await updateSiteUseCase.execute({
        contestnumber: contestnumber,
        sitenumber: sitenumber,
        siteip,
        sitename,
        siteactive,
        sitepermitlogins,
        sitelastmileanswer,
        sitelastmilescore,
        siteduration,
        siteautoend,
        sitejudging,
        sitetasking,
        siteglobalscore,
        sitescorelevel,
        sitenextuser,
        sitenextclar,
        sitenextrun,
        sitenexttask,
        sitemaxtask,
        sitechiefname,
        siteautojudge,
        sitemaxruntime,
        sitemaxjudgewaittime,
      });

      return response.status(HttpStatus.UPDATED).json(updatedSite);
    } catch (error) {
      next(error);
    }
  }

  async delete(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    const deleteSiteUseCase = container.resolve(DeleteSiteUseCase);
    const idValidator = container.resolve(IdValidator);
    const contestValidator = container.resolve(ContestValidator);

    const { id_c } = request.params;
    const { id_s } = request.params;
    const contestnumber = Number(id_c);
    const sitenumber = Number(id_s);

    // current user
    const userPayload: AuthPayload = request.body.authtoken;

    try {
      idValidator.isContestId(contestnumber);
      idValidator.isSiteId(sitenumber);

      // check whether it's the fake contest or the contest/site is not the one
      // the user is currently registered in or user of admin type is not
      // associated with the contest main site or the site to delete is the
      // same the user is currently registered in
      const c = await contestValidator.exists(contestnumber);
      if (contestnumber === 0 ||
          (userPayload.usertype != UserType.SYSTEM && 
           userPayload.contestnumber != contestnumber) ||
          (userPayload.usertype == UserType.ADMIN &&
           userPayload.usersitenumber != c.contestmainsite) ||
          (userPayload.usertype == UserType.ADMIN &&
           userPayload.usersitenumber == sitenumber) ) {
        throw ApiError.forbidden(
          "Authenticated user is unauthorized to use this endpoint"
        );
      }

      await deleteSiteUseCase.execute({
        sitenumber,
        contestnumber
      });

      return response
        .status(HttpStatus.DELETED)
        .json();
    } catch (error) {
      next(error);
    }
  }
}

export {
  SiteController
};
