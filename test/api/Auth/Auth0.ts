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

import { HttpStatus } from "../../../src/shared/definitions/HttpStatusCodes";

const host = process.env.BOCA_API_HOST;
const port = process.env.BOCA_API_PORT;
const URL = host + ":" + port;
const pass = process.env.BOCA_PASSWORD;
const salt = process.env.BOCA_KEY;

describe("Auth testing scenarios", () => {

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

    it('Access token generated', async () => {
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
