## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

##ENV FILE
rename the env.example to .env

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## endpoints

http://localhost:3333/auth/signup - POST - Copmany Registration
The example of registration dto
{
"email":"youremail@example.com",
"password": "password",
"name": "name",
"industry": "industry",
"country": "country"
}

after signup you receive activation mail, after clicking the link account activates and it is possible to login
http://localhost:3333/auth/signin - POST - Copmany Login, company can sign in on this link
The example of signin dto
{
"email":"youremail@example.com",
"password": "password",
}
after sign in you receive Bearer token, copy it and enter into Authorization Bearer token in Postman
after that company can access http://localhost:3333/acount/me - GET - To access own profile

http://localhost:3333/account/subscriptionPlan - GET - To see currrent subscription plan

http://localhost:3333/account/changePassword - PATCH - To change current password

http://localhost:3333/account/editProfile - PATCH - To edit profile

http://localhost:3333/account/subscribe - POST - To choose subscription plan
example of subscribe dto:
{
"subscribe":"free | basic | premium",

}

http://localhost:3333/account/changeSubscriptionPlan - PUT - To downgrade or upgrade subscription plan

http://localhost:3333/account/members - POST - To add members/coworkers
how members DTO looks like
{
"email":"email",
"password":"password",
"name":"name",

}
after we add members, they receive activation mail

to see all added members:
http://localhost:3333/account/members - GET - To see all members
