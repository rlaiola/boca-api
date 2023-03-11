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

import { HttpStatus } from "../../../src/shared/definitions/HttpStatusCodes";

describe("Activate contest testing scenarios", () => {
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

    await initdb();

    contestnumberAlpha = 1;
    contestnumberBeta = 2;
  });

  describe("Negative testing", () => {

    it("Missing authentication header", async () => {
      const response = await request(URL)
        .patch(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .send({
            contestactive: true,
        });

      expect(response.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid access token", async () => {
      const response = await request(URL)
        .patch(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${pass}`)
        .send({
          contestactive: true,
        });

      expect(response.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
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

      const response = await request(URL)
        .patch(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          //contestactive: true,
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
        "system"
      );

      const contestnumber = 0;
      const response = await request(URL)
        .patch(`/api/contest/${contestnumber}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestactive: true,
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
        "system"
      );

      const contestnumber = 4294967295;
      const response = await request(URL)
        .patch(`/api/contest/${contestnumber}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestactive: true,
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("Invalid contestactive", async () => {
      const token = await getToken(
        pass,
        salt,
        "system"
      );

      const response = await request(URL)
        .patch(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestactive: "true",  // this is a string, not a boolean
        });

      expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.headers["content-type"]).to.contain("application/json");
      expect(response.body).to.have.own.property("error");
      expect(response.body).to.have.own.property("message");
    });

    it("User of admin type has no permission (Alpha)", async () => {
      const token = await getToken(
        pass,
        salt,
        "admin"
      );

      const response = await request(URL)
        .patch(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestactive: true,
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
        "team1"
      );

      const response = await request(URL)
        .patch(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestactive: true,
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
        "judge1"
      );

      const response = await request(URL)
        .patch(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestactive: true,
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
        "admin"
      );

      const response = await request(URL)
        .patch(`/api/contest/${contestnumberBeta}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestactive: true,
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
        "team1"
      );

      const response = await request(URL)
        .patch(`/api/contest/${contestnumberBeta}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestactive: true,
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
        "judge1"
      );

      const response = await request(URL)
        .patch(`/api/contest/${contestnumberBeta}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestactive: true,
        });

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
        .patch(`/api/contest/${contestnumberBeta + 1}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestactive: true,
        });

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
        .patch(`/api/contest/${contestnumberAlpha}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestactive: true,
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

      const response = await request(URL)
        .patch(`/api/contest/${contestnumberBeta}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          contestactive: true,
        });

      expect(response.statusCode).to.equal(HttpStatus.UPDATED);
      expect(response.headers).to.not.have.own.property("content-type");
      expect(response.body).to.be.empty;
    });

  });

});
