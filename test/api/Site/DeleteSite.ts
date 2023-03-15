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

import { HttpStatus } from "../../../src/shared/definitions/HttpStatusCodes";

describe("Delete site testing scenarios", () => {
    let host;
    let port;
    let URL: string;
    let pass: string;
    let salt: string;
    let contestnumberAlpha: number;
    let contestnumberBeta: number;
    let sitenumberMainAlpha: number;
    let sitenumberLocalAlpha: number;
    let sitenumberAnotherAlpha: number;
    let sitenumberMainBeta: number;
    let sitenumberLocalBeta: number;

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
      sitenumberMainAlpha = 1;
      sitenumberLocalAlpha = 1;
      sitenumberAnotherAlpha = 2;
      sitenumberMainBeta = 2;
      sitenumberLocalBeta = 5;
    });

    describe("Negative testing", () => {

      it("Missing authentication header", async () => {
        const response = await request(URL)
          .delete(`/api/contest/${contestnumberAlpha}/site/${sitenumberMainAlpha}`)
          .set("Accept", "application/json");
  
        expect(response.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
        expect(response.headers["content-type"]).to.contain("application/json");
        expect(response.body).to.have.own.property("error");
        expect(response.body).to.have.own.property("message");
      });

      it("Invalid access token", async () => {
        const response = await request(URL)
          .delete(`/api/contest/${contestnumberAlpha}/site/${sitenumberMainAlpha}`)
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
          .delete(`/api/contest/${contestnumber}/site/${sitenumberMainAlpha}`)
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
          .delete(`/api/contest/${contestnumber}/site/${sitenumberMainAlpha}`)
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${token}`);
  
        expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
        expect(response.headers["content-type"]).to.contain("application/json");
        expect(response.body).to.have.own.property("error");
        expect(response.body).to.have.own.property("message");
      });

      it("Invalid sitenumber (min)", async () => {
        const token = await getToken(
          pass,
          salt,
          "system"
        );
  
        const sitenumber = 0;
        const response = await request(URL)
          .delete(`/api/contest/${contestnumberAlpha}/site/${sitenumber}`)
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${token}`);
  
        expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
        expect(response.headers["content-type"]).to.contain("application/json");
        expect(response.body).to.have.own.property("error");
        expect(response.body).to.have.own.property("message");
      });

      it("Invalid sitenumber (max)", async () => {
        const token = await getToken(
          pass,
          salt,
          "system"
        );
  
        const sitenumber = 4294967295;
        const response = await request(URL)
          .delete(`/api/contest/${contestnumberAlpha}/site/${sitenumber}`)
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${token}`);
  
        expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST);
        expect(response.headers["content-type"]).to.contain("application/json");
        expect(response.body).to.have.own.property("error");
        expect(response.body).to.have.own.property("message");
      });

      it("User of admin type has no permission (main site Alpha)", async () => {
        const token = await getToken(
          pass,
          salt,
          "admin"
        );
  
        const response = await request(URL)
          .delete(`/api/contest/${contestnumberAlpha}/site/${sitenumberMainAlpha}`)
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).to.equal(HttpStatus.FORBIDDEN);
        expect(response.headers["content-type"]).to.contain("application/json");
        expect(response.body).to.have.own.property("error");
        expect(response.body).to.have.own.property("message");
      });

      it("User of team type has no permission (main site Alpha)", async () => {
        const token = await getToken(
          pass,
          salt,
          "team1"
        );
  
        const response = await request(URL)
          .delete(`/api/contest/${contestnumberAlpha}/site/${sitenumberMainAlpha}`)
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${token}`);
  
        expect(response.statusCode).to.equal(HttpStatus.FORBIDDEN);
        expect(response.headers["content-type"]).to.contain("application/json");
        expect(response.body).to.have.own.property("error");
        expect(response.body).to.have.own.property("message");
      });

      it("User of judge type has no permission (main site Alpha)", async () => {
        const token = await getToken(
          pass,
          salt,
          "judge1"
        );
  
        const response = await request(URL)
          .delete(`/api/contest/${contestnumberAlpha}/site/${sitenumberMainAlpha}`)
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).to.equal(HttpStatus.FORBIDDEN);
        expect(response.headers["content-type"]).to.contain("application/json");
        expect(response.body).to.have.own.property("error");
        expect(response.body).to.have.own.property("message");
      });

      it("User of admin type has no permission (local site Alpha)", async () => {
        const token = await getToken(
          pass,
          salt,
          "admin"
        );

        const response = await request(URL)
          .delete(`/api/contest/${contestnumberAlpha}/site/${sitenumberLocalAlpha}`)
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).to.equal(HttpStatus.FORBIDDEN);
        expect(response.headers["content-type"]).to.contain("application/json");
        expect(response.body).to.have.own.property("error");
        expect(response.body).to.have.own.property("message");
      });

      it("User of team type has no permission (local site Alpha)", async () => {
        const token = await getToken(
          pass,
          salt,
          "team1"
        );

        const response = await request(URL)
          .delete(`/api/contest/${contestnumberAlpha}/site/${sitenumberLocalAlpha}`)
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${token}`);
  
        expect(response.statusCode).to.equal(HttpStatus.FORBIDDEN);
        expect(response.headers["content-type"]).to.contain("application/json");
        expect(response.body).to.have.own.property("error");
        expect(response.body).to.have.own.property("message");
      });

      it("User of judge type has no permission (local site Alpha)", async () => {
        const token = await getToken(
          pass,
          salt,
          "judge1"
        );
  
        const response = await request(URL)
          .delete(`/api/contest/${contestnumberAlpha}/site/${sitenumberLocalAlpha}`)
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${token}`);
  
        expect(response.statusCode).to.equal(HttpStatus.FORBIDDEN);
        expect(response.headers["content-type"]).to.contain("application/json");
        expect(response.body).to.have.own.property("error");
        expect(response.body).to.have.own.property("message");
      });

      it("User of admin type has no permission (main site Beta)", async () => {
        const token = await getToken(
          pass,
          salt,
          "admin"
        );
  
        const response = await request(URL)
          .delete(`/api/contest/${contestnumberBeta}/site/${sitenumberMainBeta}`)
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${token}`);
  
        expect(response.statusCode).to.equal(HttpStatus.FORBIDDEN);
        expect(response.headers["content-type"]).to.contain("application/json");
        expect(response.body).to.have.own.property("error");
        expect(response.body).to.have.own.property("message");
      });

      it("User of team type has no permission (main site Beta)", async () => {
        const token = await getToken(
          pass,
          salt,
          "team1"
        );
  
        const response = await request(URL)
          .delete(`/api/contest/${contestnumberBeta}/site/${sitenumberMainBeta}`)
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${token}`);
  
        expect(response.statusCode).to.equal(HttpStatus.FORBIDDEN);
        expect(response.headers["content-type"]).to.contain("application/json");
        expect(response.body).to.have.own.property("error");
        expect(response.body).to.have.own.property("message");
      });

      it("User of judge type has no permission (main site Beta)", async () => {
        const token = await getToken(
          pass,
          salt,
          "judge1"
        );
  
        const response = await request(URL)
          .delete(`/api/contest/${contestnumberBeta}/site/${sitenumberMainBeta}`)
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${token}`);
  
        expect(response.statusCode).to.equal(HttpStatus.FORBIDDEN);
        expect(response.headers["content-type"]).to.contain("application/json");
        expect(response.body).to.have.own.property("error");
        expect(response.body).to.have.own.property("message");
      });

      it("User of admin type has no permission (local site Beta)", async () => {
        const token = await getToken(
          pass,
          salt,
          "admin"
        );
  
        const response = await request(URL)
          .delete(`/api/contest/${contestnumberBeta}/site/${sitenumberLocalBeta}`)
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${token}`);
  
        expect(response.statusCode).to.equal(HttpStatus.FORBIDDEN);
        expect(response.headers["content-type"]).to.contain("application/json");
        expect(response.body).to.have.own.property("error");
        expect(response.body).to.have.own.property("message");
      });

      it("User of team type has no permission (local site Beta)", async () => {
        const token = await getToken(
          pass,
          salt,
          "team1"
        );
  
        const response = await request(URL)
          .delete(`/api/contest/${contestnumberBeta}/site/${sitenumberLocalBeta}`)
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${token}`);
  
        expect(response.statusCode).to.equal(HttpStatus.FORBIDDEN);
        expect(response.headers["content-type"]).to.contain("application/json");
        expect(response.body).to.have.own.property("error");
        expect(response.body).to.have.own.property("message");
      });

      it("User of judge type has no permission (local site Beta)", async () => {
        const token = await getToken(
          pass,
          salt,
          "judge1"
        );
  
        const response = await request(URL)
          .delete(`/api/contest/${contestnumberBeta}/site/${sitenumberLocalBeta}`)
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${token}`);
  
        expect(response.statusCode).to.equal(HttpStatus.FORBIDDEN);
        expect(response.headers["content-type"]).to.contain("application/json");
        expect(response.body).to.have.own.property("error");
        expect(response.body).to.have.own.property("message");
      });

      it("site not found", async () => {
        const token = await getToken(
          pass,
          salt,
          "system"
        );
  
        const response = await request(URL)
          .delete(`/api/contest/${contestnumberAlpha}/site/${sitenumberLocalAlpha + 10}`)
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${token}`);
  
        expect(response.statusCode).to.equal(HttpStatus.NOT_FOUND);
        expect(response.headers["content-type"]).to.contain("application/json");
        expect(response.body).to.have.own.property("error");
        expect(response.body).to.have.own.property("message");
      });

    });
  
    describe("Positive testing", () => {

      it("User of admin type has permission (not main or local site Alpha)", async () => {
        const token = await getToken(
          pass,
          salt,
          "admin"
        );

        const response = await request(URL)
          .delete(`/api/contest/${contestnumberAlpha}/site/${sitenumberAnotherAlpha}`)
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${token}`)
          .send();

        expect(response.statusCode).to.equal(HttpStatus.DELETED);
        expect(response.headers).to.not.have.own.property("content-type");
        expect(response.body).to.be.empty;
      });

      it("User of system type has permission (main and local site Alpha)", async () => {
        const token = await getToken(
          pass,
          salt,
          "system"
        );
  
        const response = await request(URL)
          .delete(`/api/contest/${contestnumberAlpha}/site/${sitenumberMainAlpha}`)
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${token}`)
          .send();
  
        expect(response.statusCode).to.equal(HttpStatus.DELETED);
        expect(response.headers).to.not.have.own.property("content-type");
        expect(response.body).to.be.empty;
      });

      it("User of system type has permission (main site Beta)", async () => {
        const token = await getToken(
          pass,
          salt,
          "system"
        );
  
        const response = await request(URL)
          .delete(`/api/contest/${contestnumberBeta}/site/${sitenumberMainBeta}`)
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${token}`)
          .send();
  
        expect(response.statusCode).to.equal(HttpStatus.DELETED);
        expect(response.headers).to.not.have.own.property("content-type");
        expect(response.body).to.be.empty;
      });

      it("User of system type has permission (local site Beta)", async () => {
        const token = await getToken(
          pass,
          salt,
          "system"
        );
  
        const response = await request(URL)
          .delete(`/api/contest/${contestnumberBeta}/site/${sitenumberLocalBeta}`)
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${token}`)
          .send();
  
        expect(response.statusCode).to.equal(HttpStatus.DELETED);
        expect(response.headers).to.not.have.own.property("content-type");
        expect(response.body).to.be.empty;
      });

    });
  
  });
  