"use client";
import { useFormStatus} from "react-dom";
import * as jose from "jose";
import userAction from "@web/app/actions/user-action";
import {useActionState} from "react";

type State = jose.JWTPayload | null;
const initialState: State = null;

export default function UserComponent() {
    const [state, action] = useActionState(userAction, initialState);
    const { pending } = useFormStatus();
    return (
        <div className="flex justify-center">
            {state && <pre>{JSON.stringify(state, null, 2)}</pre>}
            <form action={action}>
                <button className="bg-blue-500 px-5 py-3 hover:bg-blue-800 text-gray-900" disabled={pending}>
                    {pending ? "processing..." : "Invoke User Action"}
                </button>
            </form>
        </div>
    );
}
