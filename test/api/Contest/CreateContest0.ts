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

  describe("Positive testing", () => {

    it("Contest created", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      //const contestnumber = 1;
      const {
        contestname,
        conteststartdate,
        contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        contestlocalsite,
        contestpenalty,
        contestmaxfilesize,
        contestactive,
        contestmainsite,
        contestkeys,
        contestunlockkey,
        contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestnumber,
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          contestactive,
          contestmainsite,
          contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.CREATED);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("contestnumber");
    });

    it("Optional contestnumber", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      const contestnumber = 100;
      const {
        contestname,
        conteststartdate,
        contestduration,
        //contestlastmileanswer,
        //contestlastmilescore,
        contestlocalsite,
        contestpenalty,
        contestmaxfilesize,
        contestactive,
        contestmainsite,
        contestkeys,
        contestunlockkey,
        contestmainsiteurl,
      } = createContestBetaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestnumber,
          contestname,
          conteststartdate,
          contestduration,
          //contestlastmileanswer,
          //contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          contestactive,
          contestmainsite,
          contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.CREATED);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("contestnumber");
    });

    it("Optional contestlastmileanswer", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      //const contestnumber = 1;
      const {
        contestname,
        conteststartdate,
        contestduration,
        //contestlastmileanswer,
        contestlastmilescore,
        contestlocalsite,
        contestpenalty,
        contestmaxfilesize,
        contestactive,
        contestmainsite,
        contestkeys,
        contestunlockkey,
        contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestnumber,
          contestname,
          conteststartdate,
          contestduration,
          //contestlastmileanswer,
          contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          contestactive,
          contestmainsite,
          contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.CREATED);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("contestnumber");
    });

    it("Optional contestlastmilescore", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      //const contestnumber = 1;
      const {
        contestname,
        conteststartdate,
        contestduration,
        contestlastmileanswer,
        //contestlastmilescore,
        contestlocalsite,
        contestpenalty,
        contestmaxfilesize,
        contestactive,
        contestmainsite,
        contestkeys,
        contestunlockkey,
        contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestnumber,
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          //contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          contestactive,
          contestmainsite,
          contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.CREATED);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("contestnumber");
    });

  });

  describe("Negative testing", () => {

    it("Missing authentication header", async () => {
      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .send(createContestAlphaPass);

      expect(response.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid access token", async () => {
      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${pass}`)
        .send(createContestAlphaPass);

      expect(response.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Missing contestname", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      //const contestnumber = 1;
      const {
        //contestname,
        conteststartdate,
        contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        contestlocalsite,
        contestpenalty,
        contestmaxfilesize,
        contestactive,
        contestmainsite,
        contestkeys,
        contestunlockkey,
        contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestnumber,
          //contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          contestactive,
          contestmainsite,
          contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Missing conteststartdate", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      //const contestnumber = 1;
      const {
        contestname,
        //conteststartdate,
        contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        contestlocalsite,
        contestpenalty,
        contestmaxfilesize,
        contestactive,
        contestmainsite,
        contestkeys,
        contestunlockkey,
        contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestnumber,
          contestname,
          //conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          contestactive,
          contestmainsite,
          contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Missing contestduration", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      //const contestnumber = 1;
      const {
        contestname,
        conteststartdate,
        //contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        contestlocalsite,
        contestpenalty,
        contestmaxfilesize,
        contestactive,
        contestmainsite,
        contestkeys,
        contestunlockkey,
        contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestnumber,
          contestname,
          conteststartdate,
          //contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          contestactive,
          contestmainsite,
          contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Missing contestlocalsite", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      //const contestnumber = 1;
      const {
        contestname,
        conteststartdate,
        contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        //contestlocalsite,
        contestpenalty,
        contestmaxfilesize,
        contestactive,
        contestmainsite,
        contestkeys,
        contestunlockkey,
        contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestnumber,
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          //contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          contestactive,
          contestmainsite,
          contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Missing contestpenalty", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      //const contestnumber = 1;
      const {
        contestname,
        conteststartdate,
        contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        contestlocalsite,
        //contestpenalty,
        contestmaxfilesize,
        contestactive,
        contestmainsite,
        contestkeys,
        contestunlockkey,
        contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestnumber,
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestlocalsite,
          //contestpenalty,
          contestmaxfilesize,
          contestactive,
          contestmainsite,
          contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Missing contestmaxfilesize", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      //const contestnumber = 1;
      const {
        contestname,
        conteststartdate,
        contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        contestlocalsite,
        contestpenalty,
        //contestmaxfilesize,
        contestactive,
        contestmainsite,
        contestkeys,
        contestunlockkey,
        contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestnumber,
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          //contestmaxfilesize,
          contestactive,
          contestmainsite,
          contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Missing contestactive", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      //const contestnumber = 1;
      const {
        contestname,
        conteststartdate,
        contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        contestlocalsite,
        contestpenalty,
        contestmaxfilesize,
        //contestactive,
        contestmainsite,
        contestkeys,
        contestunlockkey,
        contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestnumber,
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          //contestactive,
          contestmainsite,
          contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Missing contestmainsite", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      //const contestnumber = 1;
      const {
        contestname,
        conteststartdate,
        contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        contestlocalsite,
        contestpenalty,
        contestmaxfilesize,
        contestactive,
        //contestmainsite,
        contestkeys,
        contestunlockkey,
        contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestnumber,
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          contestactive,
          //contestmainsite,
          contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Missing contestkeys", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      //const contestnumber = 1;
      const {
        contestname,
        conteststartdate,
        contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        contestlocalsite,
        contestpenalty,
        contestmaxfilesize,
        contestactive,
        contestmainsite,
        //contestkeys,
        contestunlockkey,
        contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestnumber,
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          contestactive,
          contestmainsite,
          //contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Missing contestunlockkey", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      //const contestnumber = 1;
      const {
        contestname,
        conteststartdate,
        contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        contestlocalsite,
        contestpenalty,
        contestmaxfilesize,
        contestactive,
        contestmainsite,
        contestkeys,
        //contestunlockkey,
        contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestnumber,
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          contestactive,
          contestmainsite,
          contestkeys,
          //contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Missing contestmainsiteurl", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      //const contestnumber = 1;
      const {
        contestname,
        conteststartdate,
        contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        contestlocalsite,
        contestpenalty,
        contestmaxfilesize,
        contestactive,
        contestmainsite,
        contestkeys,
        contestunlockkey,
        //contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestnumber,
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          contestactive,
          contestmainsite,
          contestkeys,
          contestunlockkey,
          //contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestnumber (min)", async () => {
      const token = await getToken(
        pass + "",
        salt + "",
        "system"
      );

      const contestnumber = 0;
      const {
        contestname,
        conteststartdate,
        contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        contestlocalsite,
        contestpenalty,
        contestmaxfilesize,
        contestactive,
        contestmainsite,
        contestkeys,
        contestunlockkey,
        contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestnumber,
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          contestactive,
          contestmainsite,
          contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestnumber (max)", async () => {
      const token = await getToken(
        pass + "",
        salt + "",
        "system"
      );

      const contestnumber = 4294967295;
      const {
        contestname,
        conteststartdate,
        contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        contestlocalsite,
        contestpenalty,
        contestmaxfilesize,
        contestactive,
        contestmainsite,
        contestkeys,
        contestunlockkey,
        contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestnumber,
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          contestactive,
          contestmainsite,
          contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestname (min)", async () => {
      const token = await getToken(
        pass + "",
        salt + "",
        "system"
      );

      //const contestnumber = 1;
      const contestname = "";
      const {
        //contestname,
        conteststartdate,
        contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        contestlocalsite,
        contestpenalty,
        contestmaxfilesize,
        contestactive,
        contestmainsite,
        contestkeys,
        contestunlockkey,
        contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestnumber,
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          contestactive,
          contestmainsite,
          contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestname (max)", async () => {
      const token = await getToken(
        pass + "",
        salt + "",
        "system"
      );

      //const contestnumber = 1;
      const contestname = "X4jqD59RuVBVGZEoOlLiZTD5tVykKCFnRVPKNmDKtUsisVJC8sQJ2GujUQpFQ4jekITYpkM9STUKlo7G5CnQjMKsqTTr0Rg0Ge99i";
      const {
        //contestname,
        conteststartdate,
        contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        contestlocalsite,
        contestpenalty,
        contestmaxfilesize,
        contestactive,
        contestmainsite,
        contestkeys,
        contestunlockkey,
        contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestnumber,
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          contestactive,
          contestmainsite,
          contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid conteststartdate (min)", async () => {
      const token = await getToken(
        pass + "",
        salt + "",
        "system"
      );

      //const contestnumber = 1;
      const conteststartdate = -1;
      const {
        contestname,
        //conteststartdate,
        contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        contestlocalsite,
        contestpenalty,
        contestmaxfilesize,
        contestactive,
        contestmainsite,
        contestkeys,
        contestunlockkey,
        contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestnumber,
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          contestactive,
          contestmainsite,
          contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid conteststartdate (max)", async () => {
      const token = await getToken(
        pass + "",
        salt + "",
        "system"
      );

      //const contestnumber = 1;
      const conteststartdate = 4294967295;
      const {
        contestname,
        //conteststartdate,
        contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        contestlocalsite,
        contestpenalty,
        contestmaxfilesize,
        contestactive,
        contestmainsite,
        contestkeys,
        contestunlockkey,
        contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestnumber,
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          contestactive,
          contestmainsite,
          contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestduration (min)", async () => {
      const token = await getToken(
        pass + "",
        salt + "",
        "system"
      );

      //const contestnumber = 1;
      const contestduration = 0;
      const {
        contestname,
        conteststartdate,
        //contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        contestlocalsite,
        contestpenalty,
        contestmaxfilesize,
        contestactive,
        contestmainsite,
        contestkeys,
        contestunlockkey,
        contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestnumber,
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          contestactive,
          contestmainsite,
          contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestduration (max)", async () => {
      const token = await getToken(
        pass + "",
        salt + "",
        "system"
      );

      //const contestnumber = 1;
      const contestduration = 4294967295;
      const {
        contestname,
        conteststartdate,
        //contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        contestlocalsite,
        contestpenalty,
        contestmaxfilesize,
        contestactive,
        contestmainsite,
        contestkeys,
        contestunlockkey,
        contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestnumber,
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          contestactive,
          contestmainsite,
          contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestlastmileanswer (min)", async () => {
      const token = await getToken(
        pass + "",
        salt + "",
        "system"
      );

      //const contestnumber = 1;
      const contestlastmileanswer = -1;
      const {
        contestname,
        conteststartdate,
        contestduration,
        //contestlastmileanswer,
        contestlastmilescore,
        contestlocalsite,
        contestpenalty,
        contestmaxfilesize,
        contestactive,
        contestmainsite,
        contestkeys,
        contestunlockkey,
        contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestnumber,
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          contestactive,
          contestmainsite,
          contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestlastmileanswer (max)", async () => {
      const token = await getToken(
        pass + "",
        salt + "",
        "system"
      );

      //const contestnumber = 1;
      const contestlastmileanswer = 4294967295;
      const {
        contestname,
        conteststartdate,
        contestduration,
        //contestlastmileanswer,
        contestlastmilescore,
        contestlocalsite,
        contestpenalty,
        contestmaxfilesize,
        contestactive,
        contestmainsite,
        contestkeys,
        contestunlockkey,
        contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestnumber,
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          contestactive,
          contestmainsite,
          contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestlastmilescore (min)", async () => {
      const token = await getToken(
        pass + "",
        salt + "",
        "system"
      );

      //const contestnumber = 1;
      const contestlastmilescore = -1;
      const {
        contestname,
        conteststartdate,
        contestduration,
        contestlastmileanswer,
        //contestlastmilescore,
        contestlocalsite,
        contestpenalty,
        contestmaxfilesize,
        contestactive,
        contestmainsite,
        contestkeys,
        contestunlockkey,
        contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestnumber,
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          contestactive,
          contestmainsite,
          contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestlastmilescore (max)", async () => {
      const token = await getToken(
        pass + "",
        salt + "",
        "system"
      );

      //const contestnumber = 1;
      const contestlastmilescore = 4294967295;
      const {
        contestname,
        conteststartdate,
        contestduration,
        contestlastmileanswer,
        //contestlastmilescore,
        contestlocalsite,
        contestpenalty,
        contestmaxfilesize,
        contestactive,
        contestmainsite,
        contestkeys,
        contestunlockkey,
        contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestnumber,
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          contestactive,
          contestmainsite,
          contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestlocalsite (min)", async () => {
      const token = await getToken(
        pass + "",
        salt + "",
        "system"
      );

      //const contestnumber = 1;
      const contestlocalsite = 0;
      const {
        contestname,
        conteststartdate,
        contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        //contestlocalsite,
        contestpenalty,
        contestmaxfilesize,
        contestactive,
        contestmainsite,
        contestkeys,
        contestunlockkey,
        contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestnumber,
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          contestactive,
          contestmainsite,
          contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestlocalsite (max)", async () => {
      const token = await getToken(
        pass + "",
        salt + "",
        "system"
      );

      //const contestnumber = 1;
      const contestlocalsite = 4294967295;
      const {
        contestname,
        conteststartdate,
        contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        //contestlocalsite,
        contestpenalty,
        contestmaxfilesize,
        contestactive,
        contestmainsite,
        contestkeys,
        contestunlockkey,
        contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestnumber,
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          contestactive,
          contestmainsite,
          contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestpenalty (min)", async () => {
      const token = await getToken(
        pass + "",
        salt + "",
        "system"
      );

      //const contestnumber = 1;
      const contestpenalty = -1;
      const {
        contestname,
        conteststartdate,
        contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        contestlocalsite,
        //contestpenalty,
        contestmaxfilesize,
        contestactive,
        contestmainsite,
        contestkeys,
        contestunlockkey,
        contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestnumber,
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          contestactive,
          contestmainsite,
          contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestpenalty (max)", async () => {
      const token = await getToken(
        pass + "",
        salt + "",
        "system"
      );

      //const contestnumber = 1;
      const contestpenalty = 4294967295;
      const {
        contestname,
        conteststartdate,
        contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        contestlocalsite,
        //contestpenalty,
        contestmaxfilesize,
        contestactive,
        contestmainsite,
        contestkeys,
        contestunlockkey,
        contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestnumber,
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          contestactive,
          contestmainsite,
          contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestmaxfilesize (min)", async () => {
      const token = await getToken(
        pass + "",
        salt + "",
        "system"
      );

      //const contestnumber = 1;
      const contestmaxfilesize = 0;
      const {
        contestname,
        conteststartdate,
        contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        contestlocalsite,
        contestpenalty,
        //contestmaxfilesize,
        contestactive,
        contestmainsite,
        contestkeys,
        contestunlockkey,
        contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestnumber,
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          contestactive,
          contestmainsite,
          contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestmaxfilesize (max)", async () => {
      const token = await getToken(
        pass + "",
        salt + "",
        "system"
      );

      //const contestnumber = 1;
      const contestmaxfilesize = 4294967295;
      const {
        contestname,
        conteststartdate,
        contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        contestlocalsite,
        contestpenalty,
        //contestmaxfilesize,
        contestactive,
        contestmainsite,
        contestkeys,
        contestunlockkey,
        contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestnumber,
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          contestactive,
          contestmainsite,
          contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestmainsite (min)", async () => {
      const token = await getToken(
        pass + "",
        salt + "",
        "system"
      );

      //const contestnumber = 1;
      const contestmainsite = 0;
      const {
        contestname,
        conteststartdate,
        contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        contestlocalsite,
        contestpenalty,
        contestmaxfilesize,
        contestactive,
        //contestmainsite,
        contestkeys,
        contestunlockkey,
        contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestnumber,
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          contestactive,
          contestmainsite,
          contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestmainsite (max)", async () => {
      const token = await getToken(
        pass + "",
        salt + "",
        "system"
      );

      //const contestnumber = 1;
      const contestmainsite = 4294967295;
      const {
        contestname,
        conteststartdate,
        contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        contestlocalsite,
        contestpenalty,
        contestmaxfilesize,
        contestactive,
        //contestmainsite,
        contestkeys,
        contestunlockkey,
        contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestnumber,
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          contestactive,
          contestmainsite,
          contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestunlockkey (max)", async () => {
      const token = await getToken(
        pass + "",
        salt + "",
        "system"
      );

      //const contestnumber = 1;
      const contestunlockkey = "sJ1BuyGEKMFKJ8O4eJ87gNnVmPbRFGZUYHXaIkoSiLyhpFAM00jrm41A1usy7T1h3sAEhadZeMJSEZNptzKBH8OUDT7PbpQSMIknA";
      const {
        contestname,
        conteststartdate,
        contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        contestlocalsite,
        contestpenalty,
        contestmaxfilesize,
        contestactive,
        contestmainsite,
        contestkeys,
        //contestunlockkey,
        contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestnumber,
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          contestactive,
          contestmainsite,
          contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestmainsiteurl (max)", async () => {
      const token = await getToken(
        pass + "",
        salt + "",
        "system"
      );

      //const contestnumber = 1;
      const contestmainsiteurl = "VZ7133oXEAQ8Er5D5DQ4JtmPX4vzbSQdJjMT1uN0zFWzTOLo5RkKbVjiofFoLUuzI1KipAYQarKF2l0j1B31shN4ANdmf2X1mfIJC0yMUhdk2Uy42J9XmvxO53Te19X6vuSUO3f2StBV45yasf8NtrO523cgQfi3L2YR6R0gbru9MZHCdDyYIY2WeAYSpQRVE9FUEWQ4K";
      const {
        contestname,
        conteststartdate,
        contestduration,
        contestlastmileanswer,
        contestlastmilescore,
        contestlocalsite,
        contestpenalty,
        contestmaxfilesize,
        contestactive,
        contestmainsite,
        contestkeys,
        contestunlockkey,
        //contestmainsiteurl,
      } = createContestAlphaPass;

      const response = await request(URL)
        .post("/api/contest")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestnumber,
          contestname,
          conteststartdate,
          contestduration,
          contestlastmileanswer,
          contestlastmilescore,
          contestlocalsite,
          contestpenalty,
          contestmaxfilesize,
          contestactive,
          contestmainsite,
          contestkeys,
          contestunlockkey,
          contestmainsiteurl,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

  });

});
