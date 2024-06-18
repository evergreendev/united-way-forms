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
    id                             int auto_increment
        primary key,
    submit_date                    datetime     not null,
    modified_date                  datetime     null,
    company_id                     int          not null,
    Constituent_ID                 varchar(255) null,
    First_Name                     varchar(255) null,
    MI                             varchar(1)   null,
    Last_Name                      varchar(255) null,
    Home_Address                   varchar(255) null,
    City                           varchar(255) null,
    State                          varchar(255) null,
    Zip                            varchar(255) null,
    Donation_Community             varchar(255) null,
    Education_Percentage           varchar(255) null,
    Financial_Percentage           varchar(255) null,
    Health_Percentage              varchar(255) null,
    Amount_Per_Pay_Period          varchar(255) null,
    Number_of_Pay_Periods_Per_Year varchar(255) null,
    Dollar_A_Day                   varchar(255) null,
    Hourly_Rate_of_Pay             varchar(255) null,
    authorization                  varchar(255) null,
    constraint form_entry_company_id_fk
        foreign key (company_id) references company (id)
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

