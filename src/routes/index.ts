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
import swaggerUi from "swagger-ui-express";

import { answersRoutes } from "./answers.routes";
import { contestsRoutes } from "./contests.routes";
import { healthCheckRoutes } from "./healthCheck.routes";
import { langRoutes } from "./lang.routes";
import { problemsRoutes } from "./problems.routes";
import { runsRoutes } from "./runs.routes";
import { sitesRoutes } from "./sites.routes";
import { usersRoutes } from "./users.routes";
import { authRoutes } from "./auth.routes";

import { swaggerOptions } from "../swagger";

const router = Router();

router.use("/api", answersRoutes);
router.use("/api", contestsRoutes);
router.use("/api", healthCheckRoutes);
router.use("/api", langRoutes);
router.use("/api", problemsRoutes);
router.use("/api", runsRoutes);
router.use("/api", sitesRoutes);
router.use("/api", usersRoutes);
router.use("/api", authRoutes);

router.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerOptions)
);

export { router };
