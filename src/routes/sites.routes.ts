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

/**
 * @swagger
 * tags:
 *   - name: Site
 *     description: Endpoints to manage locations in which contests take place
 *     externalDocs:
 *       description: Find out more
 *       url: "https://www.ime.usp.br/~cassio/boca/boca/doc/ADMIN.txt"
 * /api/contest/{id_c}/site:
 *   get:
 *     tags: ["Site"]
 *     summary: List all sites of a contest by ID
 *     description: | 
 *       Returns all sites that the user has access to given the ID
 *       (*contestnumber*) of the contest. A user of _system_ type only has
 *       permission to see all sites of any contest. A user of _admin_
 *       type associated with the referred contest (in fact, belonging to the
 *       contest local site) has permission to get all sites of that
 *       contest, while other users just the one (local) site they belong to.
 *     operationId: getSites
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_c
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: ID (*contestnumber*) of the contest
 *     responses:
 *       200:
 *         description: 'Success: Sites found'
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Site'
 *       400:
 *         description: 'Bad Request: The supplied *contestnumber* is invalid'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: 'Unauthorized: Authentication header is missing or the supplied API access token is invalid'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: 'Forbidden: The user associated with the API access token has no permission for the requested operation'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
sitesRoutes.get(
  "/contest/:id_c/site",
  authenticate([
    UserType.SYSTEM, // get all sites of any contest
    UserType.ADMIN,  // get all sites if the user has access to the contest
    UserType.JUDGE,  // get a single site that the user has access to
    UserType.TEAM,   // get a single site that the user has access to
  ]),
  siteController.listAll
);

/**
 * @swagger
 * /api/contest/{id_c}/site/{id_s}:
 *   get:
 *     tags: ["Site"]
 *     summary: Find a site within a contest by ID
 *     description: |
 *       Returns a single site from a contest (*contestnumber*) based on ID
 *       (*langnumber*). A user of _system_ type only has permission to get
 *       any site of any contest. A user of _admin_ type associated with the
 *       referred contest (in fact, belonging to the contest local site) has
 *       permission to get any site of that contest, while other users of the
 *       just contest the one (local) site they belong to.
 *     operationId: getSiteById
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_c
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: ID (*contestnumber*) of the contest
 *       - name: id_s
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: ID (*sitenumber*) of the site
 *     responses:
 *       200:
 *         description: 'Success: Site found'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Site'
 *       400:
 *         description: 'Bad Request: The supplied *contestnumber* or *sitenumber* is invalid'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: 'Unauthorized: Authentication header is missing or the supplied API access token is invalid'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: 'Forbidden: The user associated with the API access token has no permission for the requested operation'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: 'Not Found: The site specified in the request does not exist'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
sitesRoutes.get(
  "/contest/:id_c/site/:id_s",
  authenticate([
    UserType.SYSTEM, // get any site of any contest
    UserType.ADMIN,  // get any site if the user has access to the contest
    UserType.JUDGE,  // get site if the user belongs to it
    UserType.TEAM,   // get site if the user belongs to it
  ]),
  siteController.getOne
);

sitesRoutes.post(
  "/contest/:id_c/site",
  authenticate([
    UserType.ADMIN,  // the user of admin type has permission for this operation
    UserType.SYSTEM, // the user of system type has permission for this operation
  ]),
  siteController.create
);

sitesRoutes.put(
  "/contest/:id_c/site/:id_s",
  authenticate([
    UserType.ADMIN, // TODO Deve atualizar somente Sites do Contest ao qual o admin pertence
    UserType.SYSTEM, // Deve ser capaz de atualizar Sites de quaisquer Contests
  ]),
  siteController.update
);

/**
 * @swagger
 * /api/contest/{id_c}/site/{id_s}:
 *   delete:
 *     tags: ["Site"]
 *     summary: Delete a site from a contest by ID
 *     description: | 
 *       Deletes a site from a contest (*contestnumber*) based on ID
 *       (*sitenumber*). Users of _system_ and of _admin_ types (this one 
 *       associated with the given contest) have permission for this operation
 *       and it cannot be undone. The latter is allowed to delete a site only
 *       if belonging to the contest main site and the referred site is not
 *       the very same in which she is registered in.
 *     operationId: deleteSiteById
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_c
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: ID (*contestnumber*) of the contest
 *       - name: id_s
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: ID (*sitenumber*) of the site to delete
 *     responses:
 *       204:
 *         description: 'Success: Site deleted'
 *       400:
 *         description: 'Bad Request: The supplied *contestnumber* or *sitenumber* is invalid'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: 'Unauthorized: Authentication header is missing or the supplied API access token is invalid'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: 'Forbidden: The user associated with the API access token has no permission for the requested operation'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: 'Not Found: The site specified in the request does not exist'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
sitesRoutes.delete(
  "/contest/:id_c/site/:id_s",
  authenticate([
    UserType.SYSTEM, // delete site if it exists
    UserType.ADMIN,  // delete site if the user belongs to the main site
  ]),
  siteController.delete
);

export {
  sitesRoutes
};
