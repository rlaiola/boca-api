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

import { inject, injectable } from "tsyringe";
import { createHash } from "crypto";
import jwt from "jsonwebtoken";
import * as fs from "fs";

import { ApiError } from "../../errors/ApiError";

import { IUsersRepository } from "../../repositories/IUsersRepository";
import { IContestsRepository } from "../../repositories/IContestsRepository";
import { ISitesRepository } from "../../repositories/ISitesRepository";

import { AuthPayload } from "../../shared/definitions/AuthPayload";
import { UserType } from "../../shared/definitions/UserType";

interface IRequest {
  name: string;
  saltedPassword: string;
}

@injectable()
class GenerateTokenUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("ContestsRepository")
    private contestsRepository: IContestsRepository,
    @inject("SitesRepository")
    private sitesRepository: ISitesRepository
  ) {}

  async execute({ name, saltedPassword }: IRequest): Promise<string> {
    // missing name or password query parameter in request
    if (name === undefined || saltedPassword === undefined) {
      console.log("Missing user name or password parameter");
      throw ApiError.badRequest("Missing user name or password parameter");
    }

    // check password hash SHA256 format
    const regexExp = /^[a-f0-9]{64}$/;
    if (regexExp.test(saltedPassword) != true) {
      console.log("Invalid password format");
      throw ApiError.badRequest("Invalid password format");
    }

    // salt must be the same used to create password hash
    const salt = process.env.PASSWORD_SALT;
    let contest, site, user;

    // try to login in fake contest first
    contest = await this.contestsRepository.getById(0);
    if (contest !== undefined) {
      console.log("Fake contest found");

      // look for local site
      site = await this.sitesRepository.getById(
        contest.contestnumber,
        contest.contestlocalsite
      );
      if (site !== undefined) {
        console.log("Local site of fake contest found");

        // look for user with name
        user = await this.usersRepository.findByName(
          contest.contestnumber,
          site.sitenumber,
          name
        );
        if (user !== undefined) {
          console.log(`'${name}' user in local site of fake contest found: but is of system type?`);

          if (user.usertype === UserType.SYSTEM) {
            console.log(`'${name}' user of system type found in local site of fake contest`);

            const hashedPassword = user.userpassword != undefined ? user.userpassword : "";
            const saltedHash = createHash("sha256")
                                 .update(hashedPassword + salt)
                                 .digest("hex");

            if (saltedHash === saltedPassword) {
              console.log(`'${name}' user of system type authenticated in local site of fake contest`);
            }
            else {
              console.log(`'${name}' user of system type could not authenticate in local site of fake contest: incorrect password`);

              // try to login as no system type user if undefined
              user = undefined;
            }
          }
          // try to login as no system type user if undefined
          else {
            console.log(`'name' user of system type not found in local site of fake contest`);

            user  = undefined;
          }
        }
        else {
          console.log(`'${name}' user not found in local site of fake contest`);
        }
      }
      else {
        console.log("Local site of fake contest not found");
      }
    }
    else {
      console.log("Fake contest not found");
    }

    // try to login as no system type user if user still undefined
    if (user === undefined) {
      contest = await this.contestsRepository.getActive();

      if (contest !== undefined) {
        console.log(`Active contest (${contest.contestnumber}) found`);

        // look for local site
        site = await this.sitesRepository.getById(
          contest.contestnumber,
          contest.contestlocalsite
        );
        if (site !== undefined) {
          console.log(`Local site (${contest.contestlocalsite}) of active contest (${contest.contestnumber}) found`);

          // look for user with name
          user = await this.usersRepository.findByName(
            contest.contestnumber,
            site.sitenumber,
            name
          );
          if (user !== undefined) {
            console.log(`'${name}' user found in local site (${site.sitenumber}) of active contest (${contest.contestnumber})`);

            // the hash of team type users start with a "!"
            const hashedPassword = user.usertype === UserType.TEAM ||
                                   user.usertype === UserType.JUDGE ?
                                     user.userpassword?.replace("!", "") : 
                                     user.userpassword;
            const saltedHash = createHash("sha256")
                                 .update( (hashedPassword !== undefined ? 
                                             hashedPassword : "") + salt )
                                 .digest("hex");

            if (saltedHash == saltedPassword) {
              console.log(`'${name}' user authenticated in local site (${site.sitenumber}) of active contest (${contest.contestnumber})`);
            }
            else {
              console.log(`'${name}' user could not authenticate in local site (${site.sitenumber}) of active contest (${contest.contestnumber}): incorrect password`);

              // try to login as no system type user if undefined
              user = undefined;
            }
          }
          else {
            console.log(`'${name}' user not found in local site (${site.sitenumber}) of active contest (${contest.contestnumber})`);
          }
        }
        else {
          console.log("Local site of active contest not found");
        }
      }
      else {
        console.log("Active contest not found");
      }
    }

    // throw exception if user could not be authenticated 
    if (contest === undefined ||
        site === undefined ||
        user === undefined ) {
      throw ApiError.unauthorized("Incorrect username or password");
    }

    const userInfo: AuthPayload = {
      contestnumber: contest.contestnumber,
      usersitenumber: site.sitenumber,
      usernumber: user.usernumber,
      username: user.username,
      usertype: user.usertype,
    };

    // rsa key
    const privateKeyPath = "./secrets/private.key";
    const privateKey = fs.readFileSync(privateKeyPath, "utf8");
    // token expiration time
    const expiresIn = process.env.TOKEN_EXPIRES_IN_SECONDS + "s";
    // generate jwt token
    const token = jwt.sign(userInfo, privateKey, {
      issuer: "BOCA API",
      audience: "boca-api",
      expiresIn: expiresIn,
      algorithm: "RS256",
    });

    return token;
  }
}

export { GenerateTokenUseCase };
