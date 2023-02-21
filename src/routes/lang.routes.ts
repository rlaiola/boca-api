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

import { LangController } from "../useCases/Lang/LangController";

const langRoutes = Router();

const langController = new LangController();

langRoutes.get(
  "/contest/:id_c/language",
  authenticate([
    UserType.ADMIN, // TODO Deve resgatar apenas Langs do Contest ao qual o admin pertence
    UserType.TEAM, // TODO Deve resgatar apenas Langs do Contest ao qual o team pertence
    UserType.JUDGE, // TODO Deve resgatar apenas Langs do Contest ao qual o judge pertence
  ]),
  langController.listAll
);

langRoutes.get(
  "/contest/:id_c/language/:id_l",
  authenticate([
    UserType.ADMIN, // TODO Deve resgatar apenas uma Lang do Contest ao qual o admin pertence
    UserType.TEAM, // TODO Deve resgatar apenas uma Lang do Contest ao qual o team pertence
    UserType.JUDGE, // TODO Deve resgatar apenas uma Lang do Contest ao qual o judge pertence
  ]),
  langController.getOne
);

langRoutes.post(
  "/contest/:id_c/language",
  authenticate([
    UserType.ADMIN, // TODO Deve criar Langs apenas no Contest ao qual o admin pertence
  ]),
  langController.create
);

langRoutes.put(
  "/contest/:id_c/language/:id_l",
  authenticate([
    UserType.ADMIN, // TODO Deve atualizar apenas Langs do Contest ao qual o admin pertence
  ]),
  langController.update
);

langRoutes.delete(
  "/contest/:id_c/language/:id_l",
  authenticate([
    UserType.ADMIN, // TODO Deve deletar apenas Langs do Contest ao qual o admin pertence
  ]),
  langController.delete
);

export { langRoutes };
