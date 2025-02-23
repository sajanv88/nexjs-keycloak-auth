import {IronSession, SessionOptions, getIronSession} from 'iron-session'
import {cookies} from 'next/headers'
import * as client from 'openid-client'
import Redis from "ioredis";
import * as jose from "jose";

export const clientConfig = {
    authority: process.env.NEXT_AUTHORITY_URL,
    audience: process.env.NEXT_PUBLIC_AUDIENCE,
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
    scope: 'openid profile email',
    redirect_uri: `${process.env.NEXT_PUBLIC_ORIGIN}/oidc`,
    post_logout_redirect_uri: `${process.env.NEXT_PUBLIC_ORIGIN}`,
    response_type: 'code',
    grant_type: 'authorization_code',
    post_login_route: `${process.env.NEXT_PUBLIC_ORIGIN}`,
    code_challenge_method: 'S256',
}


export interface SessionData {
    access_token?: string
    code_verifier?: string
    state?: string
    expiresIn?: number
    sub?: string
}

export const session: SessionData = {
    access_token: undefined,
    code_verifier: undefined,
    state: undefined,
    expiresIn: undefined,
    sub: undefined,
}

export const sessionOptions: SessionOptions = {
    password: process.env.SESSION_PASSWORD!,
    cookieName: 'app-session',
    cookieOptions: {
        secure: true,
    },
    ttl: 3600 * 8, // 8 hours
}


export async function getSession(): Promise<IronSession<SessionData>> {
    const cookiesList = await cookies()
    return await getIronSession<SessionData>(cookiesList, sessionOptions)
}

export async function getClientConfig() {
    if(!clientConfig.authority || !clientConfig.client_id) {
        throw new Error("Client configuration is not set. Please set the NEXT_AUTHORITY_URL and NEXT_PUBLIC_CLIENT_ID environment variables.");
    }
    return await client.discovery(new URL(clientConfig.authority), clientConfig.client_id);
}

export async function getRedis() {
    return new Redis(process.env.REDIS_URL!);
}

export async function getUserInfo() {
    try {
        const openIdClientConfig = await getClientConfig()
        const session = await getSession()
        if(!session.access_token || !session.sub) return;
        return await client.fetchUserInfo(openIdClientConfig, session.access_token, session.sub);
    }catch (e) {
        console.error(e);
        return null;
    }

}

export async function getJwtPayloadIfValid() {
    const session = await getSession()
    if(!session.access_token || !session.sub) return null;
    const JWKS = jose.createRemoteJWKSet(new URL(`${process.env.NEXT_AUTHORITY_URL}/protocol/openid-connect/certs`));
    const { payload } = await jose.jwtVerify(session.access_token, JWKS, {
        issuer: process.env.NEXT_AUTHORITY_URL,
        audience: process.env.NEXT_PUBLIC_AUDIENCE,
    });
    return payload;
}

