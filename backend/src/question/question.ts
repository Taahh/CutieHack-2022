import { PathLike } from "fs";

export class Question {
    constructor(public id: string, public name: string, public file: PathLike) {
    }
}