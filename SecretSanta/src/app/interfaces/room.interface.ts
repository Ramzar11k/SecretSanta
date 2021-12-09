import { IMember } from "./member.interface";

export interface IRoom {
    members: IMember[],
    status: string,
    startCode: string
}