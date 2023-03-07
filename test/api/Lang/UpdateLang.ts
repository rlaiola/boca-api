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

import updateLangAlphaPass from "../../entities/Lang/Pass/updateLang1.json";
import updateLangBetaPass from "../../entities/Lang/Pass/updateLang2.json";
import updateLangGammaPass from "../../entities/Lang/Pass/updateLang3.json";

import { HttpStatus } from "../../../src/shared/definitions/HttpStatusCodes";

describe("Update contest testing scenarios", () => {
  let host;
  let port;
  let URL: string;
  let pass: string;
  let salt: string;
  let contestnumberAlpha: number;
  let contestnumberBeta: number;
  let langnumberGamma: number;
  let langnumberRho: number;

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
    langnumberGamma = 3;
    langnumberRho = 5;
  });

  describe("Negative testing", () => {

    it("Missing authentication header", async () => {
      const response = await request(URL)
        .put(`/api/contest/${contestnumberAlpha}/language/${langnumberGamma}`)
        .set("Accept", "application/json")
        .send(updateLangAlphaPass);

      expect(response.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid access token", async () => {
      const response = await request(URL)
        .put(`/api/contest/${contestnumberAlpha}/language/${langnumberGamma}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${pass}`)
        .send(updateLangAlphaPass);

      expect(response.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
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
      const langnumber = langnumberGamma;
      const {
        langname,
        langextension,
      } = updateLangAlphaPass;

      const response = await request(URL)
        .put(`/api/contest/${contestnumber}/language/${langnumber}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
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
      const langnumber = langnumberGamma;
      const {
        langname,
        langextension,
      } = updateLangAlphaPass;

      const response = await request(URL)
        .put(`/api/contest/${contestnumber}/language/${langnumber}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
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
      } = updateLangAlphaPass;

      const response = await request(URL)
        .put(`/api/contest/${contestnumber}/language/${langnumber}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
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
      } = updateLangAlphaPass;

      const response = await request(URL)
        .put(`/api/contest/${contestnumber}/language/${langnumber}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
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
      const langnumber = langnumberGamma;
      const langname = "";
      const {
        //langname,
        langextension,
      } = updateLangAlphaPass;

      const response = await request(URL)
        .put(`/api/contest/${contestnumber}/language/${langnumber}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
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
      const langnumber = langnumberGamma;
      const langname = "biPvtNJy87tcISIfdwhalFTUK5eTcO5zVa59wynQCOXKQ8l8e17";
      const {
        //langname,
        langextension,
      } = updateLangAlphaPass;

      const response = await request(URL)
        .put(`/api/contest/${contestnumber}/language/${langnumber}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
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
      const langnumber = langnumberGamma;
      const langextension = "";
      const {
        langname,
        //langextension,
      } = updateLangAlphaPass;

      const response = await request(URL)
        .put(`/api/contest/${contestnumber}/language/${langnumber}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
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
      const langnumber = langnumberGamma;
      const langextension = "biPvtNJy87tcISIfdwhalFTUK5eTcO5zVa59wynQCOXKQ8l8e17";
      const {
        langname,
        //langextension,
      } = updateLangAlphaPass;

      const response = await request(URL)
        .put(`/api/contest/${contestnumber}/language/${langnumber}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
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
      const langnumber = langnumberGamma;
      const {
        langname,
        langextension,
      } = updateLangAlphaPass;

      const response = await request(URL)
        .put(`/api/contest/${contestnumber}/language/${langnumber}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
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
      const langnumber = langnumberGamma;
      const {
        langname,
        langextension,
      } = updateLangAlphaPass;

      const response = await request(URL)
        .put(`/api/contest/${contestnumber}/language/${langnumber}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
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
      const langnumber = langnumberGamma;
      const {
        langname,
        langextension,
      } = updateLangAlphaPass;

      const response = await request(URL)
        .put(`/api/contest/${contestnumber}/language/${langnumber}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
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
      const langnumber = langnumberGamma;
      const {
        langname,
        langextension,
      } = updateLangBetaPass;

      const response = await request(URL)
        .put(`/api/contest/${contestnumber}/language/${langnumber}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
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
      const langnumber = langnumberGamma;
      const {
        langname,
        langextension,
      } = updateLangBetaPass;

      const response = await request(URL)
        .put(`/api/contest/${contestnumber}/language/${langnumber}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
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
      const langnumber = langnumberGamma;
      const {
        langname,
        langextension,
      } = updateLangBetaPass;

      const response = await request(URL)
        .put(`/api/contest/${contestnumber}/language/${langnumber}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
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
      const langnumber = langnumberGamma;
      const {
        langname,
        langextension,
      } = updateLangBetaPass;

      const response = await request(URL)
        .put(`/api/contest/${contestnumber}/language/${langnumber}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          langname,
          langextension,
        });

      expect(response.statusCode).to.equal(HttpStatus.FORBIDDEN);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Language not found", async () => {
      const token = await getToken(
        pass,
        salt,
        "admin"
      );

      const contestnumber = contestnumberAlpha;
      const langnumber = langnumberRho;
      const {
        langname,
        langextension,
      } = updateLangAlphaPass;

      const response = await request(URL)
        .put(`/api/contest/${contestnumber}/language/${langnumber + 1}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          langname,
          langextension,
        });

      expect(response.statusCode).to.equal(HttpStatus.NOT_FOUND);
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
      const langnumber = langnumberRho;
      const {
        langname,
        langextension,
      } = updateLangGammaPass;

      const response = await request(URL)
        .put(`/api/contest/${contestnumber}/language/${langnumber}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          langname,
          langextension,
        });

      expect(response.statusCode).to.equal(HttpStatus.UPDATED);
      expect(response.headers).to.not.have.own.property("content-type");
      expect(response.body).to.be.empty;
    });

  });

});
