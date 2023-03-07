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

import { expect } from "chai";
import { createHash } from "crypto";
import request from "supertest";

import { initdb } from "../../utils/common";

import { HttpStatus } from "../../../src/shared/definitions/HttpStatusCodes";

describe("Auth testing scenarios", () => {
  let host;
  let port;
  let URL: string;
  let pass: string;
  let salt: string;

  // setup environment before tests
  before(async () => {
    host = process.env.BOCA_API_HOST ? process.env.BOCA_API_HOST : "localhost";
    port = process.env.BOCA_API_PORT ? process.env.BOCA_API_PORT : "3000";
    URL = host + ":" + port;
    pass = process.env.BOCA_PASSWORD ? process.env.BOCA_PASSWORD : "boca";
    salt = process.env.BOCA_KEY ? process.env.BOCA_KEY : "v512nj18986j8t9u1puqa2p9mh";

    initdb();
  });

  describe("Negative testing", () => {

    it('Missing user name and password', async () => {
      const user = "system";
      const password = pass;

      const response = await request(URL)
        .get("/api/token")
        .query({
        })
        .set("Accept", "application/json");

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it('Missing user name', async () => {
      const user = "system";
      const password = pass;

      const response = await request(URL)
        .get("/api/token")
        .query({
          password: password,
        })
        .set("Accept", "application/json");

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it('Missing password', async () => {
      const user = "system";
      const password = pass;
      
      const response = await request(URL)
        .get("/api/token")
        .query({
          name: user,
        })
        .set("Accept", "application/json");

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it('Invalid password format', async () => {
      const user = "system";
      const password = pass;

      const response = await request(URL)
        .get("/api/token")
        .query({
          name: user,
          password: password
        })
        .set("Accept", "application/json");

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it('Incorrect user name and password', async () => {
      const user = "SYSTEM";
      const password = "BOCA";

      const hashedPassword = createHash("sha256")
        .update(password)
        .digest("hex");
      const hash = createHash("sha256")
        .update(hashedPassword + salt)
        .digest("hex");

      const response = await request(URL)
        .get("/api/token")
        .query({
          name: user,
          password: hash,
        })
        .set("Accept", "application/json");

      expect(response.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it('Incorrect user name', async () => {
      const user = "SYSTEM";
      const password = pass;

      const hashedPassword = createHash("sha256")
        .update(password + "")
        .digest("hex");
      const hash = createHash("sha256")
        .update(hashedPassword + salt)
        .digest("hex");

      const response = await request(URL)
        .get("/api/token")
        .query({
          name: user,
          password: hash,
        })
        .set("Accept", "application/json");

      expect(response.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it('Incorrect password', async () => {
      const user = "system";
      const password = "BOCA";

      const hashedPassword = createHash("sha256")
        .update(password)
        .digest("hex");
      const hash = createHash("sha256")
        .update(hashedPassword + salt)
        .digest("hex");

      const response = await request(URL)
        .get("/api/token")
        .query({
          name: user,
          password: hash,
        })
        .set("Accept", "application/json");

      expect(response.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

  });

  describe("Positive testing", () => {

    it('Access token generated (user of system type)', async () => {
      const user = "system";
      const password = pass;

      const hashedPassword = createHash("sha256")
        .update(password + "")
        .digest("hex");
      const hash = createHash("sha256")
        .update(hashedPassword + salt)
        .digest("hex");

      const response = await request(URL)
        .get("/api/token")
        .query({
          name: user,
          password: hash,
        })
        .set("Accept", "application/json");

      expect(response.statusCode).to.equal(HttpStatus.SUCCESS);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.headers["expires"]).to.be.not.undefined;
      expect(response.body).to.have.own.property("accessToken");
    });

    it('Access token generated (user of admin type)', async () => {
      const user = "admin";
      const password = pass;

      const hashedPassword = createHash("sha256")
        .update(password + "")
        .digest("hex");
      const hash = createHash("sha256")
        .update(hashedPassword + salt)
        .digest("hex");

      const response = await request(URL)
        .get("/api/token")
        .query({
          name: user,
          password: hash,
        })
        .set("Accept", "application/json");

      expect(response.statusCode).to.equal(HttpStatus.SUCCESS);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.headers["expires"]).to.be.not.undefined;
      expect(response.body).to.have.own.property("accessToken");
    });

    it('Access token generated (user of team type)', async () => {
      const user = "team1";
      const password = pass;

      const hashedPassword = createHash("sha256")
        .update(password + "")
        .digest("hex");
      const hash = createHash("sha256")
        .update(hashedPassword + salt)
        .digest("hex");

      const response = await request(URL)
        .get("/api/token")
        .query({
          name: user,
          password: hash,
        })
        .set("Accept", "application/json");

      expect(response.statusCode).to.equal(HttpStatus.SUCCESS);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.headers["expires"]).to.be.not.undefined;
      expect(response.body).to.have.own.property("accessToken");
    });

    it('Access token generated (user of judge type)', async () => {
      const user = "system";
      const password = pass;

      const hashedPassword = createHash("sha256")
        .update(password + "")
        .digest("hex");
      const hash = createHash("sha256")
        .update(hashedPassword + salt)
        .digest("hex");

      const response = await request(URL)
        .get("/api/token")
        .query({
          name: user,
          password: hash,
        })
        .set("Accept", "application/json");

      expect(response.statusCode).to.equal(HttpStatus.SUCCESS);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.headers["expires"]).to.be.not.undefined;
      expect(response.body).to.have.own.property("accessToken");
    });

  });
});
