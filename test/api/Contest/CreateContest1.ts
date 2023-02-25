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
import request from "supertest";

import { getToken } from "../../utils/common";

import createContestAlphaPass from "../../entities/Contest/Pass/createContestAlpha.json";

import { HttpStatus } from "../../../src/shared/definitions/HttpStatusCodes";

describe("Create contest testing scenarios", () => {
  let host;
  let port;
  let URL: string;
  let pass: string;
  let salt: string;

  it('Setup', async () => {
    host = process.env.BOCA_API_HOST ? process.env.BOCA_API_HOST : "localhost";
    port = process.env.BOCA_API_PORT ? process.env.BOCA_API_PORT : "3000";
    URL = host + ":" + port;
    pass = process.env.BOCA_PASSWORD ? process.env.BOCA_PASSWORD : "boca";
    salt = process.env.BOCA_KEY ? process.env.BOCA_KEY : "v512nj18986j8t9u1puqa2p9mh";
  });

  describe("Negative testing", () => {

    it("Admin has no permission", async () => {
      const token = await getToken(
        pass + "",
        salt + "",
        "admin"
      );
console.log("token = " + token);
      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(createContestAlphaPass);

      expect(response.statusCode).to.equal(HttpStatus.FORBIDDEN);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Team has no permission", async () => {
      const token = await getToken(
        pass + "",
        salt + "",
        "team1"
      );

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(createContestAlphaPass);

      expect(response.statusCode).to.equal(HttpStatus.FORBIDDEN);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Judge has no permission", async () => {
      const token = await getToken(
        pass + "",
        salt + "",
        "judge1"
      );

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(createContestAlphaPass);

      expect(response.statusCode).to.equal(HttpStatus.FORBIDDEN);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

  });

});
