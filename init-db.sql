create table company
(
    id           int auto_increment
        primary key,
    company_name varchar(255) not null,
    internal_id  varchar(255) null
);

create table form
(
    id         int auto_increment
        primary key,
    company_id int not null,
    constraint form_company__fk
        foreign key (company_id) references company (id)
);

create table form_entry
(
    id            int auto_increment
        primary key,
    form_id       int      not null,
    entry         json     null,
    submit_date   datetime not null,
    modified_date datetime null,
    constraint form_entry_form_id_fk
        foreign key (form_id) references form (id)
);

create table user
(
    id        int auto_increment
        primary key,
    user_name varchar(255) not null,
    password  varchar(255) not null,
    is_admin  tinyint(1)   not null,
    email     varchar(255) null,
    constraint user_pk
        unique (user_name)
);

create table company_user
(
    company_id int not null,
    user_id    int not null,
    primary key (company_id, user_id),
    constraint company_user_company_id_fk
        foreign key (company_id) references company (id)
            on update cascade on delete cascade,
    constraint company_user_user_id_fk
        foreign key (user_id) references user (id)
            on update cascade on delete cascade
);

create table user_token
(
    id         int auto_increment
        primary key,
    user_id    int         not null,
    expiration datetime    not null,
    token      varchar(36) not null,
    constraint user_token_user_id_fk
        foreign key (user_id) references user (id)
);


