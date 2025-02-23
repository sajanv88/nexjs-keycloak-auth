"use server";
import {getJwtPayloadIfValid} from "@web/libs/openid";
import {forbidden} from "next/navigation";

export default async function userAction() {
   const jwt = await getJwtPayloadIfValid()
    if(!jwt) return forbidden();
    return jwt;
}
