import {getRedis, getUserInfo} from "@web/libs/openid";
import Link from "next/link";

export default async function Home() {
    const userInfoResponse = await getUserInfo()
    if (!userInfoResponse) {
        return (
            <main className="max-w-screen-md align-middle content-center h-svh mx-auto">
                <div className="flex justify-center">
                    <Link href="/account/login">Login</Link>
                </div>
            </main>
        )
    }
    const redis = await getRedis();
    const hintString = await redis.get(userInfoResponse.sub);
    const hints = JSON.parse(hintString!);

    return (
        <main className="max-w-screen-md align-middle content-center h-svh mx-auto">
            <pre>
                <code>
                    {JSON.stringify(userInfoResponse, null, 2)}
                </code>
            </pre>
            <div className="flex justify-center">
                <Link href={`/account/logout?id_token_hint=${hints.id_token}`}>Logout</Link>
            </div>
        </main>
    );
}
