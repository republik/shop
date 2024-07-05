"use server";

import {
  AuthorizeSessionDocument,
  AuthorizeSessionMutation,
  SignInDocument,
  SignInMutation,
  SignInTokenType,
} from "#graphql/republik-api/__generated__/gql/graphql";
import { getClient } from "@/lib/graphql/urql-client";

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

  const { error, data } = await gql.mutation(SignInDocument, {
    email,
    tokenType: SignInTokenType.EmailCode,
  });

  if (error?.networkError) {
    return { error: "Die Verbindung zur Republik schlug fehl" };
  }

  if (error?.graphQLErrors) {
    return {
      error: error.graphQLErrors[0]?.message ?? "Irgendwas klappte nicht",
    };
  }

  return { signIn: data?.signIn, email };
}

export async function authorizeWithCode(
  prevState: any,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const gql = getClient();

  const email = formData.get("email") as string;
  const code = (formData.get("code") as string)?.replace(/[^0-9]/g, "");

  const { error, data } = await gql.mutation(AuthorizeSessionDocument, {
    email,
    tokens: [{ type: SignInTokenType.EmailCode, payload: code }],
  });

  if (error?.networkError) {
    return { error: "Die Verbindung zur Republik schlug fehl" };
  }

  if (error?.graphQLErrors) {
    return {
      error: error.graphQLErrors[0]?.message ?? "Irgendwas klappte nicht",
    };
  }

  return { success: data?.authorizeSession };
}
