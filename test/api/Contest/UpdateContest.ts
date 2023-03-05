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
import { describe } from "mocha";
import request from "supertest";

import { initdb, getToken } from "../../utils/common";

import updateContestAlphaPass from "../../entities/Contest/Pass/updateContestAlpha.json";
import updateContestBetaPass from "../../entities/Contest/Pass/updateContestBeta.json";

import { HttpStatus } from "../../../src/shared/definitions/HttpStatusCodes";

describe("Update contest testing scenarios", () => {
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
        .put(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .send(updateContestAlphaPass);

      expect(response.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid access token", async () => {
      const response = await request(URL)
        .put(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${pass}`)
        .send(updateContestAlphaPass);

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
        .put(`/api/contest/${contestnumber}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(updateContestAlphaPass);

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
        .put(`/api/contest/${contestnumber}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(updateContestAlphaPass);

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestname (min)", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      const contestname = "";
      const response = await request(URL)
        .put(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestname,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestname (max)", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      const contestname = "X4jqD59RuVBVGZEoOlLiZTD5tVykKCFnRVPKNmDKtUsisVJC8sQJ2GujUQpFQ4jekITYpkM9STUKlo7G5CnQjMKsqTTr0Rg0Ge99i";
      const response = await request(URL)
        .put(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestname,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid conteststartdate (min)", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      const conteststartdate = -1;
      const response = await request(URL)
        .put(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          conteststartdate,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid conteststartdate (max)", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      const conteststartdate = 4294967295;
      const response = await request(URL)
        .put(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          conteststartdate,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestduration (min)", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      const contestduration = 0;
      const response = await request(URL)
        .put(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestduration,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestduration (max)", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      const contestduration = 4294967295;
      const response = await request(URL)
        .put(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestduration,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestlastmileanswer (min)", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      const contestlastmileanswer = -1;
      const response = await request(URL)
        .put(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestlastmileanswer,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestlastmileanswer (max)", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      const contestlastmileanswer = 4294967295;
      const response = await request(URL)
        .put(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestlastmileanswer,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestlastmilescore (min)", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      const contestlastmilescore = -1;
      const response = await request(URL)
        .put(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestlastmilescore,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestlastmilescore (max)", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      const contestlastmilescore = 4294967295;
      const response = await request(URL)
        .put(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestlastmilescore,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestpenalty (min)", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      const contestpenalty = -1;
      const response = await request(URL)
        .put(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestpenalty,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestpenalty (max)", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      const contestpenalty = 4294967295;
      const response = await request(URL)
        .put(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestpenalty,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestmaxfilesize (min)", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      const contestmaxfilesize = 0;
      const response = await request(URL)
        .put(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestmaxfilesize,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestmaxfilesize (max)", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      const contestmaxfilesize = 4294967295;
      const response = await request(URL)
        .put(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestmaxfilesize,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestmainsiteurl (max)", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      const contestmainsiteurl = "VZ7133oXEAQ8Er5D5DQ4JtmPX4vzbSQdJjMT1uN0zFWzTOLo5RkKbVjiofFoLUuzI1KipAYQarKF2l0j1B31shN4ANdmf2X1mfIJC0yMUhdk2Uy42J9XmvxO53Te19X6vuSUO3f2StBV45yasf8NtrO523cgQfi3L2YR6R0gbru9MZHCdDyYIY2WeAYSpQRVE9FUEWQ4K";
      const response = await request(URL)
        .put(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestunlockkey (max)", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      const contestunlockkey = "sJ1BuyGEKMFKJ8O4eJ87gNnVmPbRFGZUYHXaIkoSiLyhpFAM00jrm41A1usy7T1h3sAEhadZeMJSEZNptzKBH8OUDT7PbpQSMIknA";
      const response = await request(URL)
        .put(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestunlockkey,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestmainsite (min)", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      const contestmainsite = 0;
      const response = await request(URL)
        .put(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestmainsite,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestmainsite (max)", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      const contestmainsite = 4294967295;
      const response = await request(URL)
        .put(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestmainsite,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestlocalsite (min)", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      const contestlocalsite = 0;
      const response = await request(URL)
        .put(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestlocalsite,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestlocalsite (max)", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      const contestlocalsite = 4294967295;
      const response = await request(URL)
        .put(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestlocalsite,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("User of team type has no permission (Alpha)", async () => {
      const token = await getToken(
        pass,
        salt,
        "team1"
      );

      const response = await request(URL)
        .put(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(updateContestAlphaPass);

      expect(response.statusCode).to.equal(HttpStatus.FORBIDDEN);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("User of judge type has no permission (Alpha)", async () => {
      const token = await getToken(
        pass,
        salt,
        "judge1"
      );

      const response = await request(URL)
        .put(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(updateContestAlphaPass);

      expect(response.statusCode).to.equal(HttpStatus.FORBIDDEN);
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
        .put(`/api/contest/${contestnumberBeta}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(updateContestBetaPass);

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
        .put(`/api/contest/${contestnumberBeta}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(updateContestBetaPass);

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
        .put(`/api/contest/${contestnumberBeta}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(updateContestBetaPass);

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
        .put(`/api/contest/${contestnumberBeta + 1}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(updateContestAlphaPass);

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

      const {
        contestname,
        conteststartdate,
        contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        contestpenalty,
        contestmaxfilesize,
        contestmainsiteurl,
        contestunlockkey,
        contestkeys,
        contestmainsite,
        contestlocalsite,
        contestactive,
      } = updateContestBetaPass;

      const response = await request(URL)
        .put(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestpenalty,
          contestmaxfilesize,
          contestmainsiteurl,
          contestunlockkey,
          contestkeys,
          contestmainsite,
          contestlocalsite,
          contestactive,
        });

      expect(response.statusCode).to.equal(HttpStatus.UPDATED);
      expect(response.headers).to.not.have.own.property("content-type");
      expect(response.body).to.be.empty;
    });

    it("User of admin type has permission (Alpha)", async () => {
      const token = await getToken(
        pass,
        salt,
        "admin"
      );

      const {
        contestname,
        conteststartdate,
        contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        contestpenalty,
        contestmaxfilesize,
        contestmainsiteurl,
        contestunlockkey,
        contestkeys,
        contestmainsite,
        contestlocalsite,
        contestactive,
      } = updateContestBetaPass;

      const response = await request(URL)
        .put(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestpenalty,
          contestmaxfilesize,
          contestmainsiteurl,
          contestunlockkey,
          contestkeys,
          contestmainsite,
          contestlocalsite,
          contestactive,
        });

      expect(response.statusCode).to.equal(HttpStatus.UPDATED);
      expect(response.headers).to.not.have.own.property("content-type");
      expect(response.body).to.be.empty;
    });

    it("User of system type has permission (Beta)", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      const {
        contestname,
        conteststartdate,
        contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        contestpenalty,
        contestmaxfilesize,
        contestmainsiteurl,
        contestunlockkey,
        contestkeys,
        contestmainsite,
        contestlocalsite,
        contestactive,
      } = updateContestAlphaPass;

      const response = await request(URL)
        .put(`/api/contest/${contestnumberBeta}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestpenalty,
          contestmaxfilesize,
          contestmainsiteurl,
          contestunlockkey,
          contestkeys,
          contestmainsite,
          contestlocalsite,
          contestactive,
        });

      expect(response.statusCode).to.equal(HttpStatus.UPDATED);
      expect(response.headers).to.not.have.own.property("content-type");
      expect(response.body).to.be.empty;
    });

  });

});
