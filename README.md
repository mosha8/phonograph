# Introduction
Phonograph is an application developed using ```Nextjs``` that interacts with Spotify API to search for songs, artists, and albums. The client communicates to the server over the ```/api/graphql``` endpoint created using graphql-yoga. There is also an implementation of ```Authjs``` with google and custom credentials providers using the JWT strategy and custom Sing in and Sing up pages.
## Prerequisites
Please make sure you have the following installed:
```
Node.js (v22)
bun (v1)
docker
```
and that you have created a file called ```.env``` similar to ```.env.example``` with the right values.
## Run locally
Run the following commands:
```
bun install
bun docker:up
bun graphql:codegen
bun prisma:generate
bun dev
```
## Run using Docker:
Run the following commands:
```
bun docker:up
bun docker:build
bun docker:run
```
# More
The file structure of the repository looks like this:
```
├── docker
│   └── volumes
│       ├── postgres
│       └── redis
├── public
└── src
    ├── app
    ├── assets
    ├── components
    ├── configs
    ├── features
    ├── lib
    ├── server
    └── styles       
```
## License
[MIT](https://choosealicense.com/licenses/mit/)