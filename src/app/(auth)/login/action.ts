"use server";

import {
  AuthorizeSessionDocument,
  AuthorizeSessionMutation,
  SignInDocument,
  SignInMutation,
  SignInTokenType,
} from "#graphql/republik-api/__generated__/gql/graphql";
import { getClient } from "@/lib/graphql/client";

export async function signIn(
  prevState: any,
  formData: FormData
): Promise<{
  signIn?: SignInMutation["signIn"];
  email?: string;
  error?: string;
}> {
  const gql = getClient();

  const email = formData.get("email") as string;

  try {
    const result = await gql.request(SignInDocument, {
      email: "blah",
      tokenType: SignInTokenType.EmailCode,
    });

    return { signIn: result.signIn, email };
  } catch (e) {
    console.error(e);
    return { error: e.message };
  }
}

export async function authorizeWithCode(
  prevState: any,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const gql = getClient();

  const email = formData.get("email") as string;
  const code = formData.get("code") as string;

  try {
    const result = await gql.request(AuthorizeSessionDocument, {
      email,
      tokens: [{ type: SignInTokenType.EmailCode, payload: code }],
    });

    return { success: result.authorizeSession };
  } catch (e) {
    console.error(e);
    return { error: e.message };
  }
}
