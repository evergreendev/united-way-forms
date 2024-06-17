import {RowDataPacket} from "mysql2/promise";

export type UserDTO = {
    id?: string|null,
    email?: string|null,
    user_name?: string|null,
    is_admin?: boolean|null,
    password?: string|null,
}

export interface IUser extends RowDataPacket, UserDTO{}

export type UserCompanyDTO = {
    company_id?: string|null,
    user_id?: string|null,
}

export type CompanyDTO = {
    id?: string;
    company_name?: string;
    internal_id?: string;
}

export interface ICompany extends RowDataPacket, CompanyDTO{}

export type EntryDTO = {
    id?: string|null,
    entry?: JSON|null,
    submit_date?: string|null,
    modified_date?: string|null,
}

export interface IEntry extends RowDataPacket, EntryDTO{}