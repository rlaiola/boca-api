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

import { Router } from "express";

import { authenticate } from "../middleware";

import { UserType } from "../shared/definitions/UserType";

import { SiteController } from "../useCases/Site/SiteController";

const sitesRoutes = Router();

const siteController = new SiteController();

sitesRoutes.get(
  "/contest/:id_c/site",
  authenticate([
    UserType.ADMIN, // TODO Deve apenas receber os Sites para o Contest ao qual pertence
    UserType.SYSTEM, // Deve ser capaz de receber Sites de quaisquer Contests
  ]),
  siteController.listAll
);

sitesRoutes.post(
  "/contest/:id_c/site",
  authenticate([
    UserType.ADMIN, // TODO Deve ser capaz de criar Sites somente no Contest ao qual pertence
    UserType.SYSTEM, // Deve ser capaz de criar Sites para quaisquer Contests
  ]),
  siteController.create
);

sitesRoutes.get(
  "/contest/:id_c/site/:id_s",
  authenticate([
    UserType.ADMIN, // TODO Deve apenas receber um Site do Contest ao qual o admin pertence
    UserType.SYSTEM, // Deve ser capaz de receber um Site de qualquer Contest
  ]),
  siteController.getOne
);

sitesRoutes.put(
  "/contest/:id_c/site/:id_s",
  authenticate([
    UserType.ADMIN, // TODO Deve atualizar somente Sites do Contest ao qual o admin pertence
    UserType.SYSTEM, // Deve ser capaz de atualizar Sites de quaisquer Contests
  ]),
  siteController.update
);

sitesRoutes.delete(
  "/contest/:id_c/site/:id_s",
  authenticate([
    UserType.ADMIN, // TODO Deve ser capaz de deletar somente Sites do Contest ao qual o admin pertence
    UserType.SYSTEM, // Deve ser capaz de deletar Sites de quaisquer Contests
  ]),
  siteController.delete
);

export { sitesRoutes };
