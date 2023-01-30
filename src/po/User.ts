import { Expose } from "class-transformer";
import {
    Length,
    IsNotEmpty
  } from 'class-validator';

export class User {
    id: number
    @Length(3, 20)
    @IsNotEmpty()
    name: string
    age: number
    getName () {
        return this.name;
    }
}