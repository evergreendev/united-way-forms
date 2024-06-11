export type UserDTO = {
    id?: string|null,
    email?: string|null,
    user_name?: string|null,
    is_admin?: boolean|null,
    password?: string|null,
}

export type UserCompanyDTO = {
    company_id?: string|null,
    user_id?: string|null,
}