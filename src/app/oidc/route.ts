import {headers} from 'next/headers'
import {NextRequest} from 'next/server'
import * as client from 'openid-client'
import {clientConfig, getClientConfig, getSession, getRedis} from "@web/libs/openid";



export async function GET(request: NextRequest) {

    const session = await getSession()
    const openIdClientConfig = await getClientConfig()
    const headerList = await headers()
    const host = headerList.get('x-forwarded-host') || headerList.get('host') || 'localhost'
    const protocol = headerList.get('x-forwarded-proto') || 'https'
    const currentUrl = new URL(
        `${protocol}://${host}${request.nextUrl.pathname}${request.nextUrl.search}`
    )
    const tokenSet = await client.authorizationCodeGrant(openIdClientConfig, currentUrl, {
        pkceCodeVerifier: session.code_verifier,
        expectedState: session.state,
    })


    console.log({tokenSet}, "tokenSet ==== ")
    const {access_token, refresh_token, expires_in, id_token} = tokenSet

    session.access_token = access_token
    session.expiresIn = expires_in

    const claims = tokenSet.claims()!
    const {sub} = claims

    // call userinfo endpoint to get user info
    const userinfo = await client.fetchUserInfo(openIdClientConfig, access_token, sub)
    console.log({userinfo}, "userinfo ==== ")
    session.sub = userinfo.sub;
    const redis = await getRedis();
    await redis.set(userinfo.sub, JSON.stringify({id_token, refresh_token}), 'EX', 86400);
    await session.save()
    return Response.redirect(clientConfig.post_login_route)

}

