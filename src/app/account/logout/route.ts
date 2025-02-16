import * as client from "openid-client";
import {clientConfig, getClientConfig, getSession} from "@web/libs/openid";
import {NextRequest} from "next/server";

export async function GET(req: NextRequest) {
    const session = await getSession()
    const openIdClientConfig = await getClientConfig()

    try {
        const id_token_hint = req.nextUrl.searchParams.get('id_token_hint') ?? "";
        const endSessionUrl = client.buildEndSessionUrl(openIdClientConfig, {
            post_logout_redirect_uri: clientConfig.post_logout_redirect_uri,
            id_token_hint,
        });
        session.destroy();
        return Response.redirect(endSessionUrl.href)
    }catch (e) {
        console.error(e);
        return new Response("Invalid request. No ID token provided.", { status: 400 });
    }


}
