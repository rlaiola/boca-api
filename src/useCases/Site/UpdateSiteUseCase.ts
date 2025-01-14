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

import { container, inject, injectable } from "tsyringe";

import { Site } from "../../entities/Site";

import { ISitesRepository } from "../../repositories/ISitesRepository";

import ContestValidator from "../../shared/validation/entities/ContestValidator";
import SiteValidator from "../../shared/validation/entities/SiteValidator";

interface IRequest {
  contestnumber: number;
  sitenumber: number;
  siteip: string;
  sitename: string;
  siteactive: boolean;
  sitepermitlogins: boolean;
  sitelastmileanswer?: number;
  sitelastmilescore?: number;
  siteduration?: number;
  siteautoend?: boolean;
  sitejudging?: string;
  sitetasking?: string;
  siteglobalscore: string;
  sitescorelevel: number;
  sitenextuser: number;
  sitenextclar: number;
  sitenextrun: number;
  sitenexttask: number;
  sitemaxtask: number;
  sitechiefname: string;
  siteautojudge: boolean;
  sitemaxruntime: number;
  sitemaxjudgewaittime: number;
}

@injectable()
class UpdateSiteUseCase {
  private contestValidator: ContestValidator;
  private siteValidator: SiteValidator;

  constructor(
    @inject("SitesRepository")
    private sitesRepository: ISitesRepository
  ) {
    this.contestValidator = container.resolve(ContestValidator);
    this.siteValidator = container.resolve(SiteValidator);
  }

  async execute({
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
  }: IRequest): Promise<Site> {
    const existingContest = await this.contestValidator.exists(contestnumber);
    await this.siteValidator.exists(contestnumber, sitenumber);

    siteautoend = siteautoend !== undefined ? siteautoend : true;
    siteduration =
      siteduration !== undefined
        ? siteduration
        : existingContest.contestduration;

    sitejudging =
      sitejudging !== undefined ? sitejudging : sitenumber.toString();

    sitetasking =
      sitetasking !== undefined ? sitetasking : sitenumber.toString();

    sitelastmileanswer =
      sitelastmileanswer !== undefined
        ? sitelastmileanswer
        : existingContest.contestlastmileanswer
        ? existingContest.contestlastmileanswer
        : existingContest.contestduration;

    sitelastmilescore =
      sitelastmilescore !== undefined
        ? sitelastmilescore
        : existingContest.contestlastmilescore
        ? existingContest.contestlastmilescore
        : existingContest.contestduration;

    const site = new Site();
    site.contestnumber = contestnumber;
    site.sitenumber = sitenumber;
    site.siteip = siteip;
    site.sitename = sitename;
    site.siteactive = siteactive;
    site.sitepermitlogins = sitepermitlogins;
    site.sitelastmileanswer = sitelastmileanswer;
    site.sitelastmilescore = sitelastmilescore;
    site.siteduration = siteduration;
    site.siteautoend = siteautoend;
    site.sitejudging = sitejudging;
    site.sitetasking = sitetasking;
    site.siteglobalscore = siteglobalscore;
    site.sitescorelevel = sitescorelevel;
    site.sitenextuser = sitenextuser;
    site.sitenextclar = sitenextclar;
    site.sitenextrun = sitenextrun;
    site.sitenexttask = sitenexttask;
    site.sitemaxtask = sitemaxtask;
    site.sitechiefname = sitechiefname;
    site.siteautojudge = siteautojudge;
    site.sitemaxruntime = sitemaxruntime;
    site.sitemaxjudgewaittime = sitemaxjudgewaittime;

    await this.siteValidator.isValid(site);

    return await this.sitesRepository.update({ ...site });
  }
}

export { UpdateSiteUseCase };
