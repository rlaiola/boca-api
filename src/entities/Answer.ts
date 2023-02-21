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
  IsPositive,
  IsInt,
  IsString,
  MaxLength,
  MinLength,
  IsBoolean,
  Min,
} from "class-validator";

@Entity("answertable")
class Answer {
  @PrimaryColumn("int4")
  @IsPositive({ message: "contestnumber must be greater than zero" })
  @IsInt()
  contestnumber!: number;

  @PrimaryColumn("int4")
  @Min(0)
  @IsInt()
  answernumber!: number;

  @Column("varchar", { length: 50 })
  @MaxLength(50)
  @MinLength(1)
  @IsString()
  runanswer!: string;

  @Column("bool")
  @IsBoolean()
  yes!: boolean;

  @Column("bool")
  @IsBoolean()
  fake!: boolean;

  @Column("int4", { default: "EXTRACT(EPOCH FROM now())" })
  updatetime!: number;

  constructor(
    contestnumber: number,
    answernumber: number,
    runanswer: string,
    yes = false,
    fake = false
  ) {
    this.contestnumber = contestnumber;
    this.answernumber = answernumber;
    this.runanswer = runanswer;
    this.yes = yes;
    this.fake = fake;
  }
}

export { Answer };
