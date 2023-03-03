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

import { ContestController } from "../useCases/Contest/ContestController";

const contestsRoutes = Router();

const contestController = new ContestController();

/**
 * @swagger
 * tags:
 *   - name: Contest
 *     description: Endpoints to manage coding competitions
 * /api/contest:
 *   get:
 *     tags: ["Contest"]
 *     summary: List all contests
 *     description: Returns all contests that the user has access to.
 *     operationId: getContests
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 'Success: Contests found'
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contest'
 *       401:
 *         description: 'Unauthorized: Authentication header is missing or the supplied API access token is invalid'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
contestsRoutes.get(
  "/contest",
  authenticate([
    UserType.SYSTEM,  // get all contests
    UserType.ADMIN,   // get a single contest that the user has access to
    UserType.JUDGE,   // get a single contest that the user has access to
    UserType.TEAM,    // get a single contest that the user has access to
  ]),
  contestController.listAll
);

/**
 * @swagger
 * /api/contest/{id_c}:
 *   get:
 *     tags: ["Contest"]
 *     summary: Find a contest by ID
 *     description: |
 *       Returns a single contest based on ID (*contestnumber*) but only if the user has access to it.
 *     operationId: getContestById
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_c
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: ID (*contestnumber*) of the contest to fetch
 *     responses:
 *       200:
 *         description: 'Success: Contest found'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contest'
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
 *       404:
 *         description: 'Not Found: The contest specified in the request does not exist'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
contestsRoutes.get(
  "/contest/:id_c",
  authenticate([
    UserType.SYSTEM, // get contest if it exists
    UserType.ADMIN,  // get contest if the user has access to it
    UserType.JUDGE,  // get contest if the user has access to it
    UserType.TEAM,   // get contest if the user has access to it
  ]),
  contestController.getOne
);

/**
 * @swagger
 * /api/contest:
 *   post:
 *     tags: ["Contest"]
 *     summary: Add a new contest
 *     description: | 
 *       The user of _system_ type only has permission for this operation. All
 *       properties are required, with the exception of *contestnumber*,
 *       *contestlastmileanswer*, and *contestlastmilescore*. If supplied, 
 *       *contestnumber* will be used only if the value has not already been
 *       assigned to another contest.
 *     operationId: createContest
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: New contest
 *       required: true
 *       content:
 *         'application/json':
 *           schema:
 *             $ref: '#/components/schemas/CreateContest'
 *           examples:
 *             contest:
 *               summary: An example of contest
 *               value:
 *                 contestname: "Contest Alpha"
 *                 conteststartdate: 0
 *                 contestduration: 11264340
 *                 contestlastmileanswer: 11263440
 *                 contestlastmilescore: 11260740
 *                 contestpenalty: 1200
 *                 contestmaxfilesize: 100000
 *                 contestmainsiteurl: "http://a.b"
 *                 contestunlockkey: "[d3g22q]"
 *                 contestkeys: "[d3g22q]"
 *                 contestmainsite: 1
 *                 contestlocalsite: 1
 *                 contestactive: false
 *     responses:
 *       201:
 *         description: 'Success: Contest created'
 *         headers:
 *           Content-Location:
 *             type: string
 *             description: direct URL to access the new contest in the future
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contest'
 *       400:
 *         description: 'Bad Request: Missing required contest property or the supplied is invalid'
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
 *       409:
 *         description: 'Conflict: The contest specified in the request already exists'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
contestsRoutes.post(
  "/contest",
  authenticate([
    UserType.SYSTEM, // the user of system type only has permission for this operation
  ]),
  contestController.create
);

/**
 * @swagger
 * /api/contest/{id_c}:
 *   put:
 *     tags: ["Contest"]
 *     summary: Update a contest by ID
 *     description: |
 *       Updates a contest based on ID (*contestnumber*). The users of _system_ and of _admin_ type 
 *       (the one associated with the given contest) have permission for this operation. The latter
 *       is allowed to update only the following properties: *contestmainsiteurl*, *contestunlockkey*, 
 *       *contestkeys* and *contestmainsite*.
 *     operationId: updateContestById
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_c
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: ID (*contestnumber*) of the contest to update
 *     requestBody:
 *       description: Contest properties to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateContest'
 *           examples:
 *             contest:
 *               summary: An example of contest
 *               value:
 *                 contestname: "Contest Beta"
 *                 conteststartdate: 0
 *                 contestduration: 3600
 *                 contestlastmileanswer: 3585
 *                 contestlastmilescore: 3560
 *                 contestpenalty: 12000
 *                 contestmaxfilesize: 1000
 *                 contestmainsiteurl: ""
 *                 contestunlockkey: ""
 *                 contestkeys: ""
 *                 contestmainsite: 2
 *                 contestlocalsite: 5
 *                 contestactive: false
 *     responses:
 *       204:
 *         description: 'Success: Contest updated'
 *       400:
 *         description: 'Bad Request: Missing required contest property or the supplied is invalid'
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
 *         description: 'Not Found: The contest specified in the request does not exist'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
contestsRoutes.put(
  "/contest/:id_c",
  authenticate([
    UserType.SYSTEM, // update contest if it exists
    UserType.ADMIN,  // udpate contest if the user has access to it
  ]),
  contestController.update
);

/**
 * @swagger
 * /api/contest/{id_c}:
 *   delete:
 *     tags: ["Contest"]
 *     summary: Delete a contest by ID
 *     description: | 
 *       Deletes a contest based on ID (*contestnumber*). The user of _system_ type only has permission
 *       for this operation and it cannot be undone.
 *     operationId: deleteContestById
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_c
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: ID (*contestnumber*) of the contest to delete
 *     responses:
 *       204:
 *         description: 'Success: Contest deleted'
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
 *       404:
 *         description: 'Not Found: The contest specified in the request does not exist'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
contestsRoutes.delete(
  "/contest/:id_c",
  authenticate([
    UserType.SYSTEM, // the user of system type only has permission for this operation
  ]),
  contestController.delete
);

export { contestsRoutes };
