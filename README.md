
## Using Keycloak to Authenticate And Secure API Routes in Next.js

This is a demo source code for the article [Using Keycloak to Authenticate And Secure API Routes in Next.js](https://blogs.sajankumarv.com)

## Getting Started
Make sure you have docker installed on your machine. If not, you can download it from [here](https://www.docker.com/products/docker-desktop)

Also, update your hosts file with the following entry
In linux: `/etc/hosts`
In windows: `C:\Windows\System32\drivers\etc\hosts` Add the following entry
- 127.0.0.1 keycloak.local

To start the keycloak server, run the following command

```bash

docker compose up -d

```
The above command will start a keycloak server, Caddy proxy and a redis server. You can access the keycloak server at https://keycloak.local

First, run the development server:
Create a .env file and setup the following environment variable
```bash 

NEXT_AUTHORITY_URL=https://keycloak.local/realms/dev
NEXT_PUBLIC_AUDIENCE=account
NEXT_PUBLIC_CLIENT_ID=public-client
NEXT_PUBLIC_ORIGIN=https://localhost:4200
SESSION_PASSWORD=$2a$10$5OjhNV934FmH7s4eMFqx.uW8v7Ot/HOHMaC5hoz7TTcmHEN6hS0N.
REDIS_URL=redis://localhost:6379

```


```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [https://localhost:4200](https://localhost:4200) with your browser to see the result.

