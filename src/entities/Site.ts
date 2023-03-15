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

@Entity("sitetable")
class Site {
  @PrimaryColumn("int4")
  @IsInt()
  @IsPositive({ message: "contestnumber must be greater than zero" })
  @Max(2147483647)
  contestnumber!: number;

  @PrimaryColumn("int4")
  @IsInt()
  @IsPositive({ message: "sitenumber must be greater than zero" })
  @Max(2147483647)
  sitenumber!: number;

  @Column("varchar", { length: 200 })
  @IsString()
  @MinLength(0)
  @MaxLength(200)
  siteip!: string;

  @Column("varchar", { length: 50 })
  @IsString()
  @MinLength(0)
  @MaxLength(50)
  sitename!: string;

  @Column("bool")
  @IsBoolean()
  siteactive!: boolean;

  @Column("bool")
  @IsBoolean()
  sitepermitlogins!: boolean;

  @Column("int4", { nullable: true })
  @IsInt()
  @Min(0)
  @Max(2147483647)
  sitelastmileanswer: number | undefined;

  @Column("int4", { nullable: true })
  @IsInt()
  @Min(0)
  @Max(2147483647)
  sitelastmilescore: number | undefined;

  @Column("int4", { nullable: true })
  @IsInt()
  @IsPositive({ message: "siteduration must be greater than zero" })
  @Max(2147483647)
  siteduration: number | undefined;

  @Column("bool", { nullable: true })
  @IsBoolean()
  siteautoend: boolean | undefined;

  @Column("text", { nullable: true })
  @IsString()
  sitejudging: string | undefined;

  @Column("text", { nullable: true })
  @IsString()
  sitetasking: string | undefined;

  @Column("varchar", { length: 50 })
  @IsString()
  @MinLength(0)
  @MaxLength(50)
  siteglobalscore = "";

  @Column("int4")
  @IsInt()
  @Min(0)
  @Max(2147483647)
  sitescorelevel = 3;

  @Column("int4")
  @IsInt()
  @Min(0)
  @Max(2147483647)
  sitenextuser = 0;

  @Column("int4")
  @IsInt()
  @Min(0)
  @Max(2147483647)
  sitenextclar = 0;

  @Column("int4")
  @IsInt()
  @Min(0)
  @Max(2147483647)
  sitenextrun = 0;

  @Column("int4")
  @IsInt()
  @Min(0)
  @Max(2147483647)
  sitenexttask = 0;

  @Column("int4")
  @IsInt()
  @Min(0)
  @Max(2147483647)
  sitemaxtask = 8;

  @Column("varchar", { length: 20 })
  @IsString()
  @MinLength(0)
  @MaxLength(20)
  sitechiefname!: string;

  @Column("bool", { nullable: true })
  @IsBoolean()
  siteautojudge = false;

  @Column("int4")
  @IsInt()
  @Min(0)
  @Max(2147483647)
  sitemaxruntime = 600;

  @Column("int4")
  @IsInt()
  @Min(0)
  @Max(2147483647)
  sitemaxjudgewaittime = 900;

  @Column("int4", { default: "EXTRACT(EPOCH FROM now())" })
  updatetime!: number;

  constructor(
    contestnumber: number,
    sitenumber: number,
    siteip: string,
    sitename: string,
    siteactive: boolean,
    sitepermitlogins: boolean,
    sitelastmileanswer: number | undefined = undefined,
    sitelastmilescore: number | undefined = undefined,
    siteduration: number | undefined = undefined,
    siteautoend: boolean | undefined = undefined,
    sitejudging: string | undefined = undefined,
    sitetasking: string | undefined = undefined,
    siteglobalscore: string,
    sitescorelevel: number,
    sitenextuser: number,
    sitenextclar: number,
    sitenextrun: number,
    sitenexttask: number,
    sitemaxtask: number,
    sitechiefname: string,
    siteautojudge: boolean | undefined = undefined,
    sitemaxruntime: number,
    sitemaxjudgewaittime: number,
  ) {
    this.contestnumber = contestnumber;
    this.sitenumber = sitenumber;
    this.siteip = siteip;
    this.sitename = sitename;
    this.siteactive = siteactive;
    this.sitepermitlogins = sitepermitlogins;
    this.sitelastmileanswer = sitelastmileanswer;
    this.sitelastmilescore = sitelastmilescore;
    this.siteduration = siteduration;
    this.siteautoend = siteautoend;
    this.sitejudging = sitejudging;
    this.sitetasking = sitetasking;
    this.siteglobalscore = siteglobalscore;
    this.sitescorelevel = sitescorelevel;
    this.sitenextuser = sitenextuser;
    this.sitenextclar = sitenextclar;
    this.sitenextrun = sitenextrun;
    this.sitenexttask = sitenexttask;
    this.sitemaxtask = sitemaxtask;
    this.sitechiefname = sitechiefname;
    this.siteautojudge = siteautojudge ? siteautojudge : false;
    this.sitemaxruntime = sitemaxruntime;
    this.sitemaxjudgewaittime = sitemaxjudgewaittime;
  }
}

const createSiteRequiredProperties = [
  "siteip",
  "sitename",
  "siteactive",
  "sitepermitlogins",
];

const updateSiteRequiredProperties = [
  "siteip",
  "sitename",
  "siteactive",
  "sitepermitlogins",
];

const sitePKBaseSchema = {
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

const sitePKSchema = {
  type: "object",
  properties: {
    sitenumber: {
      type: "number",
      description: "Number (id) of the site",
      minimum: 1,
      maximum: 2147483647,
    },
  },
};

const siteRequestSchema = {
  type: "object",
  properties: {
    sitename: {
      type: "string",
      description: "Name of the site",
      minLength: 0,
      maxLength: 50,
    },
    siteip: {
      type: "string",
      description: "Site URL (e.g., 127.0.0.1/boca)",
      minLength: 0,
      maxLength: 200,
    },
    sitestartdate: {
      type: "number",
      description: "Start date (Unix timestamp) of the contest at this site",
      minimum: 0,
      maximum: 2147483647,
    },
    siteduration: {
      type: "number",
      description: "Duration (in seconds) of the contest at this site",
      minimum: 1,
      maximum: 2147483647,
    },
    sitelastmileanswer: {
      type: "number",
      description: "Elapsed time (in seconds) from contest start date to stop \
        comunicating teams whether their runs were accepted or not",
      minimum: 0,
      maximum: 2147483647,
    },
    sitelastmilescore: {
      type: "number",
      description: "Elapsed time (in seconds) from contest start date to stop \
        updating scoreboard (keep the winner secret)",
      minimum: 0,
      maximum: 2147483647,
    },
    sitejudging: {
      type: "string",
      description: "For a multi-site contest, it defines a list of \
        comma-separated site numbers that will have their runs/clars judged \
        in this site. For a single-site contest, just set the own site number",
      minLength: 0,
    },
    sitetasking: {
      type: "string",
      description: "For multi-site contests, it defines a list of \
        comma-separated site numbers that will have their tasks treated in \
        this site. Either in a single or in a multi-site, usually each \
        site handles its own tasks. So, in general it should be set with \
        the number of the local site",
      minLength: 0,
    },
    siteglobalscore: {
      type: "string",
      description: "For multi-site contests, it allows specifying a list of \
        comma-separated site numbers that should be included in the \
        scoreboard. Not needed for single-site contests",
      minLength: 0,
      maxLength: 50,
    },
    sitescorelevel: {
      type: "number",
      description: "Detail level of information on the scoreboard. No details \
      (0) - Maximum detail (4). 2 is a good choice, although, for single \
      contests, 3 and 4 are also ok and more informative. A negative number \
      means the same as its absolute value counterpart, but keeps the problem \
      names hidden (useful when the same problem set is used in sites with \
      very distinct start times)",
      minimum: -4,
      maximum: 4,
    },
    sitechiefname: {
      type: "string",
      description: "User name of the chief judge (if any). She has some \
        additional tasks such as fixing submission answers that are not in \
        agreement among different judges",
      minLength: 0,
      maxLength: 20,
    },
    siteautojudge: {
      type: "boolean",
      description: "Enable autojudge (without human interaction)",
    },
    siteactive: {
      type: "boolean",
      description: "Indicates whether or not the site is active",
    },
    siteautoend: {
      type: "boolean",
      description: "Indicates whether of not it should end automatically at \
        the defined time (usually yes)",
    },
    sitenextuser: {
      type: "number",
      description: "",
      minimum: 0,
      maximum: 2147483647,
    },
    sitenextclar: {
      type: "number",
      description: "Number of clars",
      minimum: 0,
      maximum: 2147483647,
    },
    sitenextrun: {
      type: "number",
      description: "Number of runs",
      minimum: 0,
      maximum: 2147483647,
    },
    sitenexttask: {
      type: "number",
      description: "Number of tasks",
      minimum: 0,
      maximum: 2147483647,
    },
    sitepermitlogins: {
      type: "boolean",
      description: "Enables or not logins of users belonging to the site",
    },
    // sitemaxtask: {
    //   type: "number",
    //   description: "",
    //   minimum: 0,
    //   maximum: 2147483647,
    // },
    // sitemaxruntime: {
    //   type: "number",
    //   description: "",
    //   minimum: 0,
    //   maximum: 2147483647,
    // },
    // sitemaxjudgewaittime: {
    //   type: "number",
    //   description: "",
    //   minimum: 0,
    //   maximum: 2147483647,
    // },
  },
};

const siteResponseSchema = {
  ...sitePKBaseSchema,
  ...sitePKSchema,
  ...siteRequestSchema,
  properties: {
    ...sitePKBaseSchema.properties,
    ...sitePKSchema.properties,
    ...siteRequestSchema.properties,
    updatetime: {
      type: "number",
      description: "Unix timestamp of site last update",
      minimum: 1,
    },
  },
};

const createSiteSchema = {
  ...sitePKSchema,
  ...siteRequestSchema,
  properties: {
    ...sitePKSchema.properties,
    ...siteRequestSchema.properties,
  },
  required: createSiteRequiredProperties,
};

const updateSiteSchema = {
  ...siteRequestSchema,
  //required: updateSiteRequiredProperties,
};

export {
  Site,
  createSiteRequiredProperties,
  updateSiteRequiredProperties,
  siteResponseSchema,
  createSiteSchema,
  updateSiteSchema,
};
