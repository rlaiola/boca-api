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

import { Column, Entity, PrimaryColumn } from "typeorm";
import {
  IsBoolean,
  IsInt,
  IsPositive,
  Min,
  Max,
  IsString,
  MinLength,
  MaxLength,
} from "class-validator";

import { IsType } from "../shared/validation/utils/IsType";

@Entity("contesttable")
class Contest {
  @PrimaryColumn("int4")
  @IsInt()
  @Min(1)
  @Max(2147483647)
  contestnumber!: number;

  @Column("varchar", { length: 100 })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  contestname!: string;

  @Column("int4")
  @IsInt()
  @Min(0)
  @Max(2147483647)
  conteststartdate!: number;

  @Column("int4")
  @IsInt()
  @IsPositive({ message: "contestduration must be greater than zero" })
  @Max(2147483647)
  contestduration!: number;

  @Column("int4", { nullable: true })
  @IsType(["number", "undefined"])
  @Min(0)
  @Max(2147483647)
  contestlastmileanswer: number | undefined;

  @Column("int4", { nullable: true })
  @IsType(["number", "undefined"])
  @Min(0)
  @Max(2147483647)
  contestlastmilescore: number | undefined;

  @Column("int4")
  @IsInt()
  @Min(0)
  @Max(2147483647)
  contestpenalty!: number;

  @Column("int4")
  @IsInt()
  @IsPositive({ message: "contestmaxfilesize must be greater than zero" })
  @Max(2147483647)
  contestmaxfilesize!: number;

  @Column("varchar", { length: 200 })
  @IsString()
  @MinLength(0)
  @MaxLength(200)
  contestmainsiteurl!: string;

  @Column("varchar", { length: 100 })
  @IsString()
  @MinLength(0)
  @MaxLength(100)
  contestunlockkey!: string;

  @Column("text")
  @IsString()
  @MinLength(0)
  contestkeys!: string;

  @Column("int4")
  @IsInt()
  @IsPositive({ message: "contestmainsite must be greater than zero" })
  @Max(2147483647)
  contestmainsite!: number;

  @Column("int4")
  @IsInt()
  @IsPositive({ message: "contestlocalsite must be greater than zero" })
  @Max(2147483647)
  contestlocalsite!: number;

  @Column("bool")
  @IsBoolean()
  contestactive!: boolean;

  @Column("int4", { default: "EXTRACT(EPOCH FROM now())" })
  updatetime!: number;

  constructor(
    contestnumber: number,
    contestname: string,
    conteststartdate: number,
    contestduration: number,
    contestlastmileanswer: number | undefined = undefined,
    contestlastmilescore: number | undefined = undefined,
    contestpenalty: number,
    contestmaxfilesize: number,
    contestmainsiteurl: string,
    contestunlockkey: string,
    contestkeys: string,
    contestmainsite: number,
    contestlocalsite: number,
    contestactive: boolean,
  ) {
    this.contestnumber = contestnumber;
    this.contestname = contestname;
    this.conteststartdate = conteststartdate;
    this.contestduration = contestduration;
    this.contestlastmileanswer = contestlastmileanswer;
    this.contestlastmilescore = contestlastmilescore;
    this.contestpenalty = contestpenalty;
    this.contestmaxfilesize = contestmaxfilesize;
    this.contestmainsiteurl = contestmainsiteurl;
    this.contestunlockkey = contestunlockkey;
    this.contestkeys = contestkeys;
    this.contestmainsite = contestmainsite;
    this.contestlocalsite = contestlocalsite;
    this.contestactive = contestactive;
  }
}

const createContestRequiredProperties = [
  "contestname",
  "conteststartdate",
  "contestduration",
  "contestpenalty",
  "contestmaxfilesize",
  "contestmainsiteurl",
  "contestunlockkey",
  "contestkeys",
  "contestmainsite",
  "contestlocalsite",
];

const updateContestRequiredProperties = [
  "contestname",
  "conteststartdate",
  "contestduration",
  "contestpenalty",
  "contestmaxfilesize",
  "contestmainsiteurl",
  "contestunlockkey",
  "contestkeys",
  "contestmainsite",
  "contestlocalsite",
];

const activateContestRequiredProperties = [
  "contestactive",
];

const contestPKSchema = {
  type: "object",
  properties: {
    contestnumber: {
      type: "number",
      description: "Number (id) of the contest",
      minimum: 1,
      maximum: 2147483647,
    },
  },
};

const contestRequestSchema = {
  type: "object",
  properties: {
    contestname: {
      type: "string",
      description: "Name of the contest",
      minLength: 1,
      maxLength: 100,
    },
    conteststartdate: {
      type: "number",
      description: "Start date of the contest (Unix timestamp)",
      minimum: 0,
      maximum: 2147483647,
    },
    contestduration: {
      type: "number",
      description: "Duration of the contest (in seconds)",
      minimum: 1,
      maximum: 2147483647,
    },
    contestlastmileanswer: {
      type: "number",
      description: "Elapsed time (in seconds) from the start date of the \
        contest to stop communicating teams whether their runs were \
        accepted or not",
      minimum: 0,
      maximum: 2147483647,
    },
    contestlastmilescore: {
      type: "number",
      description: "Elapsed time (in seconds) from the start date of the \
        contest to stop updating scoreboard (and keep the winner secret)",
      minimum: 0,
      maximum: 2147483647,
    },
    contestpenalty: {
      type: "number",
      description: "Number of seconds a team is penalized for each time it \
        submits a run that is not accepted (considered only if the team \
        receives an YES for the corresponding problem, as done in ACM-ICPC \
        like contests)",
      minimum: 0,
      maximum: 2147483647,
    },
    contestmaxfilesize: {
      type: "number",
      description: "Max file size (in Kb) allowed for teams (for security \
        reasons)",
      minimum: 1,
      maximum: 2147483647,
    },
    contestmainsiteurl: {
      type: "string",
      description: "Main site URL (e.g., 127.0.0.1/boca)",
      minLength: 0,
      maxLength: 200,
    },
    contestunlockkey: {
      type: "string",
      description: "Unlock password (only use it within a secure network)",
      minLength: 0,
      maxLength: 100,
    },
    contestkeys: {
      type: "string",
      description: "Keys (only use it within a secure network)",
      minLength: 0,
    },
    contestmainsite: {
      type: "number",
      description: "Number (id) of the contest main site (usually 1). IF \
        RUNNING MULTIPLE SITES, BE SURE TO USE THE CORRECT NUMBER HERE \
        ASSIGNED BY WHOEVER IS COORDINATING THE MULTI-SITE CONTEST!!",
      minimum: 1,
      maximum: 2147483647,
    },
    contestlocalsite: {
      type: "number",
      description: "Number (id) of the contest local site. IF RUNNING \
        MULTIPLE SITES, BE SURE TO USE THE CORRECT NUMBER HERE ASSIGNED BY \
        WHOEVER IS COORDINATING THE MULTI-SITE CONTEST!!",
      minimum: 1,
      maximum: 2147483647,
    },
  },
};

const activateRequestContestSchema = {
  type: "object",
  properties: {
    contestactive: {
      type: "boolean",
      description: "Indicates whether or not the contest is active (only one \
        contest can be active at a time)",
    },
  },
};

const contestResponseSchema = {
  ...contestPKSchema,
  ...contestRequestSchema,
  ...activateRequestContestSchema,
  properties: {
    ...contestPKSchema.properties,
    ...contestRequestSchema.properties,
    ...activateRequestContestSchema.properties,
    updatetime: {
      type: "number",
      description: "Time of the contest last update (Unix timestamp)",
      minimum: 1,
    },
  },
};

const createContestSchema = {
  ...contestPKSchema,
  ...contestRequestSchema,
  properties: {
    ...contestPKSchema.properties,
    ...contestRequestSchema.properties,
  },
  required: createContestRequiredProperties,
};

const updateContestSchema = {
  ...contestRequestSchema,
  //required: updateContestRequiredProperties,
};

const activateContestSchema = {
  ...activateRequestContestSchema,
  required: activateContestRequiredProperties,
};

export {
  Contest,
  createContestRequiredProperties,
  updateContestRequiredProperties,
  activateContestRequiredProperties,
  contestResponseSchema,
  createContestSchema,
  updateContestSchema,
  activateContestSchema,
};
