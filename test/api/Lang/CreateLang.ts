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

import createLangAlphaPass from "../../entities/Lang/Pass/createLang1.json";
import createLangBetaPass from "../../entities/Lang/Pass/createLang2.json";
import createLangGammaPass from "../../entities/Lang/Pass/createLang3.json";

import { HttpStatus } from "../../../src/shared/definitions/HttpStatusCodes";

describe("Create contest testing scenarios", () => {
  let host;
  let port;
  let URL: string;
  let pass: string;
  let salt: string;
  let contestnumberAlpha: number;
  let contestnumberBeta: number;
  let langnumberGamma: number;

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
    langnumberGamma = 1;
  });

  describe("Negative testing", () => {

    it("Missing authentication header", async () => {
      const response = await request(URL)
        .post(`/api/contest/${contestnumberAlpha}/language`)
        .set("Accept", "application/json")
        .send(createLangAlphaPass);

      expect(response.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid access token", async () => {
      const response = await request(URL)
        .post(`/api/contest/${contestnumberAlpha}/language`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${pass}`)
        .send(createLangAlphaPass);

      expect(response.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Missing langname", async () => {
      const token = await getToken(
        pass,
        salt,
        "admin",
      );

      const contestnumber = contestnumberAlpha;
      //const langnumber = 1;
      const {
        //langname,
        langextension,
      } = createLangAlphaPass;

      const response = await request(URL)
        .post(`/api/contest/${contestnumber}/language`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //langnumber,
          //langname,
          langextension,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Missing langextension", async () => {
      const token = await getToken(
        pass,
        salt,
        "admin",
      );

      const contestnumber = contestnumberAlpha;
      //const langnumber = 1;
      const {
        langname,
        //langextension,
      } = createLangAlphaPass;

      const response = await request(URL)
        .post(`/api/contest/${contestnumber}/language`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //langnumber,
          langname,
          //langextension,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestnumber (min)", async () => {
      const token = await getToken(
        pass,
        salt,
        "admin",
      );

      const contestnumber = 0;
      //const langnumber = 1;
      const {
        langname,
        langextension,
      } = createLangAlphaPass;

      const response = await request(URL)
        .post(`/api/contest/${contestnumber}/language`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //langnumber,
          langname,
          langextension,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestnumber (max)", async () => {
      const token = await getToken(
        pass,
        salt,
        "admin",
      );

      const contestnumber = 4294967295;
      //const langnumber = 1;
      const {
        langname,
        langextension,
      } = createLangAlphaPass;

      const response = await request(URL)
        .post(`/api/contest/${contestnumber}/language`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //langnumber,
          langname,
          langextension,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid langnumber (min)", async () => {
      const token = await getToken(
        pass,
        salt,
        "admin",
      );

      const contestnumber = contestnumberAlpha;
      const langnumber = 0;
      const {
        langname,
        langextension,
      } = createLangAlphaPass;

      const response = await request(URL)
        .post(`/api/contest/${contestnumber}/language`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          langnumber,
          langname,
          langextension,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid langnumber (max)", async () => {
      const token = await getToken(
        pass,
        salt,
        "admin",
      );

      const contestnumber = contestnumberAlpha;
      const langnumber = 4294967295;
      const {
        langname,
        langextension,
      } = createLangAlphaPass;

      const response = await request(URL)
        .post(`/api/contest/${contestnumber}/language`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          langnumber,
          langname,
          langextension,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });
    
    it("Invalid langname (min)", async () => {
      const token = await getToken(
        pass,
        salt,
        "admin",
      );

      const contestnumber = contestnumberAlpha;
      //const langnumber = 1;
      const langname = "";
      const {
        //langname,
        langextension,
      } = createLangAlphaPass;

      const response = await request(URL)
        .post(`/api/contest/${contestnumber}/language`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //langnumber,
          langname,
          langextension,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid langname (max)", async () => {
      const token = await getToken(
        pass,
        salt,
        "admin",
      );

      const contestnumber = contestnumberAlpha;
      //const langnumber = 1;
      const langname = "biPvtNJy87tcISIfdwhalFTUK5eTcO5zVa59wynQCOXKQ8l8e17";
      const {
        //langname,
        langextension,
      } = createLangAlphaPass;

      const response = await request(URL)
        .post(`/api/contest/${contestnumber}/language`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //langnumber,
          langname,
          langextension,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid langextension (min)", async () => {
      const token = await getToken(
        pass,
        salt,
        "admin",
      );

      const contestnumber = contestnumberAlpha;
      //const langnumber = 1;
      const langextension = "";
      const {
        langname,
        //langextension,
      } = createLangAlphaPass;

      const response = await request(URL)
        .post(`/api/contest/${contestnumber}/language`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //langnumber,
          langname,
          langextension,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid langextension (max)", async () => {
      const token = await getToken(
        pass,
        salt,
        "admin",
      );

      const contestnumber = contestnumberAlpha;
      //const langnumber = 1;
      const langextension = "biPvtNJy87tcISIfdwhalFTUK5eTcO5zVa59wynQCOXKQ8l8e17";
      const {
        langname,
        //langextension,
      } = createLangAlphaPass;

      const response = await request(URL)
        .post(`/api/contest/${contestnumber}/language`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //langnumber,
          langname,
          langextension,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("User of system type has no permission (Alpha)", async () => {
      const token = await getToken(
        pass,
        salt,
        "system",
      );

      const contestnumber = contestnumberAlpha;
      //const langnumber = 1;
      const {
        langname,
        langextension,
      } = createLangAlphaPass;

      const response = await request(URL)
        .post(`/api/contest/${contestnumber}/language`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //langnumber,
          langname,
          langextension,
        });

      expect(response.statusCode).to.equal(HttpStatus.FORBIDDEN);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("User of team type has no permission (Alpha)", async () => {
      const token = await getToken(
        pass,
        salt,
        "team1",
      );

      const contestnumber = contestnumberAlpha;
      //const langnumber = 1;
      const {
        langname,
        langextension,
      } = createLangAlphaPass;

      const response = await request(URL)
        .post(`/api/contest/${contestnumber}/language`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //langnumber,
          langname,
          langextension,
        });

      expect(response.statusCode).to.equal(HttpStatus.FORBIDDEN);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("User of judge type has no permission (Alpha)", async () => {
      const token = await getToken(
        pass,
        salt,
        "judge1",
      );

      const contestnumber = contestnumberAlpha;
      //const langnumber = 1;
      const {
        langname,
        langextension,
      } = createLangAlphaPass;

      const response = await request(URL)
        .post(`/api/contest/${contestnumber}/language`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //langnumber,
          langname,
          langextension,
        });

      expect(response.statusCode).to.equal(HttpStatus.FORBIDDEN);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("User of system type has no permission (Beta)", async () => {
      const token = await getToken(
        pass,
        salt,
        "system",
      );

      const contestnumber = contestnumberBeta;
      //const langnumber = 1;
      const {
        langname,
        langextension,
      } = createLangBetaPass;

      const response = await request(URL)
        .post(`/api/contest/${contestnumber}/language`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //langnumber,
          langname,
          langextension,
        });

      expect(response.statusCode).to.equal(HttpStatus.FORBIDDEN);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("User of admin type has no permission (Beta)", async () => {
      const token = await getToken(
        pass,
        salt,
        "admin",
      );

      const contestnumber = contestnumberBeta;
      //const langnumber = 1;
      const {
        langname,
        langextension,
      } = createLangBetaPass;

      const response = await request(URL)
        .post(`/api/contest/${contestnumber}/language`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //langnumber,
          langname,
          langextension,
        });

      expect(response.statusCode).to.equal(HttpStatus.FORBIDDEN);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("User of team type has no permission (Beta)", async () => {
      const token = await getToken(
        pass,
        salt,
        "team1",
      );

      const contestnumber = contestnumberBeta;
      //const langnumber = 1;
      const {
        langname,
        langextension,
      } = createLangBetaPass;

      const response = await request(URL)
        .post(`/api/contest/${contestnumber}/language`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //langnumber,
          langname,
          langextension,
        });

      expect(response.statusCode).to.equal(HttpStatus.FORBIDDEN);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("User of judge type has no permission (Beta)", async () => {
      const token = await getToken(
        pass,
        salt,
        "judge1",
      );

      const contestnumber = contestnumberBeta;
      //const langnumber = 1;
      const {
        langname,
        langextension,
      } = createLangBetaPass;

      const response = await request(URL)
        .post(`/api/contest/${contestnumber}/language`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //langnumber,
          langname,
          langextension,
        });

      expect(response.statusCode).to.equal(HttpStatus.FORBIDDEN);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Language already exists", async () => {
      const token = await getToken(
        pass,
        salt,
        "admin"
      );

      const contestnumber = contestnumberAlpha;
      const langnumber = langnumberGamma;
      const {
        langname,
        langextension,
      } = createLangAlphaPass;

      const response = await request(URL)
        .post(`/api/contest/${contestnumber}/language`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          langnumber,
          langname,
          langextension,
        });

      expect(response.statusCode).to.equal(HttpStatus.ALREADY_EXISTS);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

  });

  describe("Positive testing", () => {

    it("User of admin type has permission (Alpha)", async () => {
      const token = await getToken(
        pass,
        salt,
        "admin",
      );

      const contestnumber = contestnumberAlpha;
      //const langnumber = 1;
      const {
        langname,
        langextension,
      } = createLangGammaPass;

      const response = await request(URL)
        .post(`/api/contest/${contestnumber}/language`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //langnumber,
          langname,
          langextension,
        });

      expect(response.statusCode).to.equal(HttpStatus.CREATED);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.headers["content-location"]).to
        .contain(`/api/contest/${response.body["contestnumber"]}/language/${response.body["langnumber"]}`);
      expect(response.body).to.deep.equal({
        contestnumber: contestnumberAlpha,
        langnumber: response.body["langnumber"],
        langname: langname,
        langextension: langextension,
        updatetime: response.body["updatetime"],
      });
    });
  
    it("Optional langnumber", async () => {
      const token = await getToken(
        pass,
        salt,
        "admin",
      );

      const contestnumber = contestnumberAlpha;
      const langnumber = 100;
      const {
        langname,
        langextension,
      } = createLangBetaPass;

      const response = await request(URL)
        .post(`/api/contest/${contestnumber}/language`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          langnumber,
          langname,
          langextension,
        });

      expect(response.statusCode).to.equal(HttpStatus.CREATED);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.headers["content-location"]).to
        .contain(`/api/contest/${response.body["contestnumber"]}/language/${response.body["langnumber"]}`);
      expect(response.body).to.deep.equal({
        contestnumber: contestnumberAlpha,
        langnumber: response.body["langnumber"],
        langname: langname,
        langextension: langextension,
        updatetime: response.body["updatetime"],
      });
    });

  });

});
