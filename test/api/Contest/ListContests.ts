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

import { initdb, getToken } from "../../utils/common";

import createContestAlphaPass from "../../entities/Contest/Pass/createContestAlpha.json";
import createContestBetaPass from "../../entities/Contest/Pass/createContestBeta.json";

import { Contest } from "../../../src/entities/Contest";

import { HttpStatus } from "../../../src/shared/definitions/HttpStatusCodes";

describe("List contests testing scenarios", () => {
  let host;
  let port;
  let URL: string;
  let pass: string;
  let salt: string;
  let contestnumberAlpha: number;
  let contestnumberBeta: number;

  // setup environment before tests
  before(async () => {
    host = process.env.BOCA_API_HOST ? process.env.BOCA_API_HOST : "localhost";
    port = process.env.BOCA_API_PORT ? process.env.BOCA_API_PORT : "3000";
    URL = host + ":" + port;
    pass = process.env.BOCA_PASSWORD ? process.env.BOCA_PASSWORD : "boca";
    salt = process.env.BOCA_KEY ? process.env.BOCA_KEY : "v512nj18986j8t9u1puqa2p9mh";

    initdb();

    contestnumberAlpha = 1;
    contestnumberBeta = 2;
  });

  describe("Negative testing", () => {

    it("Missing authentication header", async () => {
      const response = await request(URL)
        .get("/api/contest")
        .set("Accept", "application/json");

      expect(response.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid access token", async () => {
      const response = await request(URL)
        .get("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${pass}`);

      expect(response.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

  });

  describe("Positive testing", () => {

    it("User of system type has permission", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      const response = await request(URL)
        .get("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).to.equal(HttpStatus.SUCCESS);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.be.an("array");
      // user can see 2 contests: alpha and beta
      expect(response.body).to.have.lengthOf(2);
      
      const contestAlpha = response.body.find((contest: Contest) =>
        contest.contestname.includes(createContestAlphaPass.contestname)
      );

      const contestBeta = response.body.find((contest: Contest) =>
        contest.contestname.includes(createContestBetaPass.contestname)
      );

      expect(contestAlpha).to.be.an("object");
      expect(contestAlpha).to.have.own.property("contestnumber");
      expect(contestAlpha.contestnumber).to.deep.equal(contestnumberAlpha);
      expect(contestBeta).to.be.an("object");
      expect(contestBeta).to.have.own.property("contestnumber");
      expect(contestBeta.contestnumber).to.deep.equal(contestnumberBeta);
    });

    it("User of admin type has permission", async () => {
      const token = await getToken(
        pass,
        salt,
        "admin"
      );

      const response = await request(URL)
        .get("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).to.equal(HttpStatus.SUCCESS);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.be.an("array");
      // user can see 1 contest: alpha
      expect(response.body).to.have.lengthOf(1);
      
      const contestAlpha = response.body.find((contest: Contest) =>
        contest.contestname.includes(createContestAlphaPass.contestname)
      );

      const contestBeta = response.body.find((contest: Contest) =>
        contest.contestname.includes(createContestBetaPass.contestname)
      );

      expect(contestAlpha).to.be.an("object");
      expect(contestAlpha).to.have.own.property("contestnumber");
      expect(contestAlpha.contestnumber).to.deep.equal(contestnumberAlpha);
      expect(contestBeta).to.be.undefined;
    });

    it("User of team type has permission", async () => {
      const token = await getToken(
        pass,
        salt,
        "team1"
      );

      const response = await request(URL)
        .get("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).to.equal(HttpStatus.SUCCESS);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.be.an("array");
      // user can see 1 contest: alpha
      expect(response.body).to.have.lengthOf(1);
      
      const contestAlpha = response.body.find((contest: Contest) =>
        contest.contestname.includes(createContestAlphaPass.contestname)
      );

      const contestBeta = response.body.find((contest: Contest) =>
        contest.contestname.includes(createContestBetaPass.contestname)
      );

      expect(contestAlpha).to.be.an("object");
      expect(contestAlpha).to.have.own.property("contestnumber");
      expect(contestAlpha.contestnumber).to.deep.equal(contestnumberAlpha);
      expect(contestBeta).to.be.undefined;
    });

    it("User of judge type has permission", async () => {
      const token = await getToken(
        pass,
        salt,
        "judge1"
      );

      const response = await request(URL)
        .get("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).to.equal(HttpStatus.SUCCESS);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.be.an("array");
      // user can see 1 contest: alpha
      expect(response.body).to.have.lengthOf(1);
      
      const contestAlpha = response.body.find((contest: Contest) =>
        contest.contestname.includes(createContestAlphaPass.contestname)
      );

      const contestBeta = response.body.find((contest: Contest) =>
        contest.contestname.includes(createContestBetaPass.contestname)
      );

      expect(contestAlpha).to.be.an("object");
      expect(contestAlpha).to.have.own.property("contestnumber");
      expect(contestAlpha.contestnumber).to.deep.equal(contestnumberAlpha);
      expect(contestBeta).to.be.undefined;
    });

  });

});