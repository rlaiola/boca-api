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

import { AuthController } from "../useCases/Auth/AuthController";

const authRoutes = Router();

const authController = new AuthController();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Endpoint to authenticate users
 * /api/token:
 *   get:
 *     tags: ["Auth"]
 *     summary: Request API access token
 *     description: | 
 *       In order to query the API, with the exception of this endpoint, it is
 *       necessary to provide a temporary access token (Bearer) in the header
 *       as `Authorization: Bearer [accessToken]`. Omitting it or supplying an
 *       invalid token results in an error 401 Unauthorized. To obtain the
 *       access token authenticate with the credentials of a registered user
 *       (IMPORTANT: the password must be hashed as shown in the Shell script
 *       solution below). In the example, given the values of a `BOCA_KEY`
 *       (provided by the application) and `PASSWORD` environment variables the
 *       code snippet should output 
 *       `9f8ed9332001d26eda0829d55e6424874861238bcb2b6adb141c2598c5776754`.
 *       ### Shell (Bash etc) HMAC SHA256
 *       Using openssl. Credits to [Joe Kampschmidt](https://www.jokecamp.com/blog/examples-of-creating-base64-hashes-using-hmac-sha256-in-different-languages#shell)
 *       ```bash
 *       BOCA_KEY="v512nj18986j8t9u1puqa2p9mh"
 *       USERNAME="system"
 *       PASSWORD="boca"
 *       HASHEDPASSWORD=$(echo -n "$PASSWORD" | openssl dgst -sha256 -hmac)
 *       HASH=$(echo -n "$HASHEDPASSWORD$BOCA_KEY" | openssl dgst -sha256 -hmac)
 *       
 *       echo $HASH
 *       ```
 *       Click on the **Try it out** button, fill in the request parameters
 *       with the user name and hashed password (output of the code above), and
 *       then **Execute**. To use the access token with endpoints, click on the
 *       **Authorize** button above and fill in the **Value** field with it
 *       (copy and paste the value of the `accessToken` response property
 *       without quotes). Keep in mind that the generated access token has an
 *       expiration date and, whenever it expires, the step of requesting a new
 *       one must be repeated.
 *     parameters:
 *       - name: name
 *         in: query
 *         schema:
 *           type: string
 *         required: true
 *         description: The user name for authentication
 *       - name: password
 *         in: query
 *         schema:
 *           type: string
 *         required: true
 *         description: The password hash based on HMAC SHA256 signatures
 *     responses:
 *       200:
 *         description: 'Success: API access token returned'
 *         headers:
 *           Expires:
 *             type: string
 *             format: date-time
 *             description: date in UTC when token expires
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       400:
 *         description: 'Bad Request: Missing user name/password or the supplied are invalid'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: 'Unauthorized: The supplied user name/password are incorrect'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
authRoutes.get("/token", authController.getToken);

export { authRoutes };
