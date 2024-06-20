import {RowDataPacket} from "mysql2/promise";

export type UserDTO = {
    id?: string,
    email?: string,
    user_name?: string,
    is_admin?: boolean,
    password?: string,
    receive_form_submission_emails?: 1|0
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
    id?: string,
    company_id?: string|null,
    submit_date?: string|null,
    modified_date?: string|null,
    Constituent_ID?: string|null,
    First_Name?: string|null,
    MI?: string|null,
    Last_Name?: string|null,
    Home_Address?: string|null,
    City?: string|null,
    State?: string|null,
    Zip?: string|null,
    Donation_Community?: string|null,
    Education_Percentage?: string|null,
    Financial_Percentage?: string|null,
    Health_Percentage?: string|null,
    Amount_Per_Pay_Period?: string|null,
    Number_of_Pay_Periods_Per_Year?: string|null,
    Dollar_A_Day?: string|null,
    Hourly_Rate_of_Pay?: string|null,
    authorization?: string|null
}

export interface IEntry extends RowDataPacket, EntryDTO{}
