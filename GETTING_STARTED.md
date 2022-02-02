# Getting Started

## Why?

Due to GitLab enforcing two-factor authentication, it is required to generate a
personal access token to use when cloning the repository. This gives you
permission to interact with the repository.

## Create a personal access token

Please follow
[this guide from GitLab](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html#create-a-personal-access-token).

You can name you access token whatever you like, for instance
`personal_access_token`.

Set the expiration date to some time after this project is done, e.g. June 2022.

The access token can very well have all selected scopes (`api`, `read_users`,
`read_api`, `read_repository`, `write_repository`, `read_registry`,
`write_registry`).

Make sure you copy the personal access token somewhere, because you'll need it
later when cloning the repository.

## Cloning the repository

When cloning the repository, add your username and access token to the URL in
the following way:

```sh
git clone https://<username>:<token>@gitlab.stud.idi.ntnu.no/tdt4140-2022/landsby-4/gruppe_69/group69
```

Note how you start the URL with your username and personal access token.

## The way forward

Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) to learn how to contribute to
the code base.
