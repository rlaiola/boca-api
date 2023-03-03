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
import createContestBetaPass from "../../entities/Contest/Pass/createContestBeta.json";

import { HttpStatus } from "../../../src/shared/definitions/HttpStatusCodes";

describe("Get contest testing scenarios", () => {
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

    const token = await getToken(
      pass,
      salt,
      "system"
    );

    // get all contests
    let response = await request(URL)
      .get("/api/contest")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).to.equal(HttpStatus.SUCCESS);
    expect(response.headers["content-type"]).to.contain("application/json");
    expect(response.body).to.be.an("array");

    // and delete them 
    const all = response.body;
    const n = all.length;
    for (let i = 0; i < n; i++) {
      const k = all[i].contestnumber;
      const resp = await request(URL)
        .delete(`/api/contest/${k}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send();

        expect(resp.statusCode).to.equal(HttpStatus.DELETED);
        expect(resp.headers).to.not.have.own.property("content-type");
        expect(resp.body).to.be.empty;
    }

    // create alpha contest
    response = await request(URL)
      .post("/api/contest")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(createContestAlphaPass);

    expect(response.statusCode).to.equal(HttpStatus.CREATED);
    expect(response.headers["content-type"]).to.contain("application/json");
    expect(response.headers["content-location"]).to
      .contain(`/api/contest/${response.body["contestnumber"]}`);
    expect(response.body).to.have.own.property("contestnumber");

    // save alpha's contestnumber
    contestnumberAlpha = parseInt(response.body["contestnumber"]);
    
    // create beta contest
    response = await request(URL)
      .post("/api/contest")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(createContestBetaPass);
    
    expect(response.statusCode).to.equal(HttpStatus.CREATED);
    expect(response.headers["content-type"]).to.contain("application/json");
    expect(response.headers["content-location"]).to
      .contain(`/api/contest/${response.body["contestnumber"]}`);
    expect(response.body).to.have.own.property("contestnumber");

    // save beta's contestnumber
    contestnumberBeta = parseInt(response.body["contestnumber"]);
  });

  describe("Negative testing", () => {

    it("Missing authentication header", async () => {
      const response = await request(URL)
        .get(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json");

      expect(response.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid access token", async () => {
      const response = await request(URL)
        .get(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${pass}`);

      expect(response.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestnumber (min)", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      const contestnumber = 0;
      const response = await request(URL)
        .get(`/api/contest/${contestnumber}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestnumber (max)", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      const contestnumber = 4294967295;
      const response = await request(URL)
        .get(`/api/contest/${contestnumber}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("User of admin type has no permission (Beta)", async () => {
      const token = await getToken(
        pass,
        salt,
        "admin"
      );

      const response = await request(URL)
        .get(`/api/contest/${contestnumberBeta}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).to.equal(HttpStatus.FORBIDDEN);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });
  
    it("User of team type has no permission (Beta)", async () => {
      const token = await getToken(
        pass,
        salt,
        "team1"
      );

      const response = await request(URL)
        .get(`/api/contest/${contestnumberBeta}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).to.equal(HttpStatus.FORBIDDEN);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });
  
    it("User of judge type has no permission (Beta)", async () => {
      const token = await getToken(
        pass,
        salt,
        "judge1"
      );

      const response = await request(URL)
        .get(`/api/contest/${contestnumberBeta}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).to.equal(HttpStatus.FORBIDDEN);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Contest not found", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      const response = await request(URL)
        .get(`/api/contest/${contestnumberBeta + 1}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

  });

  describe("Positive testing", () => {

    it("User of system type has permission (Alpha)", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      const response = await request(URL)
        .get(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).to.equal(HttpStatus.SUCCESS);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.own.property("contestnumber");
      expect(response.body.contestnumber).to.deep.equal(contestnumberAlpha);
      expect(response.body.contestname).to.deep.equal(createContestAlphaPass.contestname);
    });

    it("User of admin type has permission (Alpha)", async () => {
      const token = await getToken(
        pass,
        salt,
        "admin"
      );

      const response = await request(URL)
        .get(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send();

      expect(response.statusCode).to.equal(HttpStatus.SUCCESS);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.own.property("contestnumber");
      expect(response.body.contestnumber).to.deep.equal(contestnumberAlpha);
      expect(response.body.contestname).to.deep.equal(createContestAlphaPass.contestname);
    });

    it("User of team type has permission (Alpha)", async () => {
      const token = await getToken(
        pass,
        salt,
        "team"
      );

      const response = await request(URL)
        .get(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send();

      expect(response.statusCode).to.equal(HttpStatus.SUCCESS);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.own.property("contestnumber");
      expect(response.body.contestnumber).to.deep.equal(contestnumberAlpha);
      expect(response.body.contestname).to.deep.equal(createContestAlphaPass.contestname);
    });

    it("User of judge type has permission (Alpha)", async () => {
      const token = await getToken(
        pass,
        salt,
        "judge"
      );

      const response = await request(URL)
        .get(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send();

        expect(response.statusCode).to.equal(HttpStatus.SUCCESS);
        expect(response.headers["content-type"]).to.contain("application/json");
        expect(response.body).to.be.an("object");
        expect(response.body).to.have.own.property("contestnumber");
        expect(response.body.contestnumber).to.deep.equal(contestnumberAlpha);
        expect(response.body.contestname).to.deep.equal(createContestAlphaPass.contestname);
    });

    it("User of system type has permission (Beta)", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      const response = await request(URL)
        .get(`/api/contest/${contestnumberBeta}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).to.equal(HttpStatus.SUCCESS);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.own.property("contestnumber");
      expect(response.body.contestnumber).to.deep.equal(contestnumberBeta);
      expect(response.body.contestname).to.deep.equal(createContestBetaPass.contestname);
    });

  });

});
