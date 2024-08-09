"use server";

import {
  AuthorizeSessionDocument,
  SignInDocument,
  SignInMutation,
  SignInTokenType,
  SignOutDocument,
  UnauthorizedSessionDocument,
} from "#graphql/republik-api/__generated__/gql/graphql";
import { getClient } from "@/lib/graphql/client";
import { CombinedError } from "@urql/core";

function handleError(
  error: CombinedError | undefined
): { error: string } | undefined {
  if (error?.networkError) {
    return { error: "Die Verbindung zur Republik schlug fehl" };
  }

  if (error?.graphQLErrors) {
    return {
      error: error.graphQLErrors[0]?.message ?? "Irgendwas klappte nicht",
    };
  }
}

export async function signIn(
  prevState: any,
  formData: FormData
): Promise<{
  signIn?: SignInMutation["signIn"];
  email?: string;
  error?: string;
}> {
  const gql = getClient({
    setReceivedCookies: true,
  });

  const email = formData.get("email") as string;

  const { error, data } = await gql.mutation(SignInDocument, {
    email,
    tokenType: SignInTokenType.EmailCode,
  });

  const errResponse = handleError(error);
  if (errResponse) {
    return errResponse;
  }

  return { signIn: data?.signIn, email };
}

export async function signOut(prevState: any, formData: FormData) {
  const gql = getClient({
    setReceivedCookies: true,
  });
  const { error, data } = await gql.mutation(SignOutDocument, {});

  const errResponse = handleError(error);
  if (errResponse) {
    return errResponse;
  }

  return { success: data?.signOut };
}

export async function authorizeWithCode(
  prevState: any,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const gql = getClient({
    setReceivedCookies: true,
  });

  const email = formData.get("email") as string;
  const code = (formData.get("code") as string)?.replace(/[^0-9]/g, "");

  const unauthorizedSessionQueryRes = await gql.query(
    UnauthorizedSessionDocument,
    {
      email,
      token: { type: SignInTokenType.EmailCode, payload: code },
    }
  );

  const authorizeSessionMutationRes = await gql.mutation(
    AuthorizeSessionDocument,
    {
      email,
      tokens: [{ type: SignInTokenType.EmailCode, payload: code }],
      consents:
        unauthorizedSessionQueryRes.data?.unauthorizedSession?.requiredConsents,
    }
  );

  const errResponse = handleError(authorizeSessionMutationRes.error);
  if (errResponse) {
    return errResponse;
  }

  return { success: authorizeSessionMutationRes.data?.authorizeSession };
}
