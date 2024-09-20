"use client";
import {
  AuthorizeSessionDocument,
  SignInDocument,
  SignInTokenType,
  UnauthorizedSessionDocument,
} from "#graphql/republik-api/__generated__/gql/graphql";
import { Button } from "@/components/ui/button";
import { css } from "@/theme/css";
import { vstack } from "@/theme/patterns";
import { useTranslations } from "next-intl";
import { ReactNode, useId, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { CombinedError, useClient, useMutation } from "urql";
import { CodeInput } from "./code-input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ErrorMessage = ({
  error,
}: {
  error: string | CombinedError | undefined;
}) => {
  const t = useTranslations("error");

  const message =
    typeof error === "string"
      ? error
      : error?.networkError
        ? t("graphql.networkError")
        : error?.graphQLErrors[0]?.message;

  return (
    <Alert variant="error">
      <AlertTitle>{t("generic")}</AlertTitle>
      {message && <AlertDescription>{message}</AlertDescription>}
    </Alert>
  );
};

type SubmitProps = {
  children?: ReactNode;
};

export function Submit({ children }: SubmitProps) {
  const { pending } = useFormStatus();
  const t = useTranslations("login");
  return (
    <Button
      type="submit"
      disabled={pending}
      loading={pending}
      className={css({
        w: "max",
      })}
    >
      {children ?? t("action")}
    </Button>
  );
}

interface LoginFormProps {
  loginFormHeader?: ReactNode;
  loginFormInfo?: ReactNode;
  renderCodeFormHint?: CodeFormProps["renderHint"];
  submitButtonText?: string;
}

export function LoginForm(props: LoginFormProps) {
  const emailId = useId();

  const [{ data, error, operation }, signIn] = useMutation(SignInDocument);

  if (data?.signIn && operation?.variables.email) {
    return (
      <CodeForm
        email={operation?.variables.email}
        renderHint={props.renderCodeFormHint}
        info={props.loginFormInfo}
        submitButtonText={props.submitButtonText}
      />
    );
  }

  return (
    <form
      action={async (formData) => {
        const email = formData.get("email") as string;
        if (email) {
          await signIn({
            email: email,
            tokenType: SignInTokenType.EmailCode,
          });
        }
      }}
    >
      <div
        className={vstack({
          gap: "4",
          alignItems: "stretch",
          w: "full",
          maxW: "lg",
        })}
      >
        {props.loginFormHeader}
        {error && <ErrorMessage error={error} />}
        <label
          htmlFor={emailId}
          className={css({
            fontWeight: "medium",
            fontSize: "sm",
          })}
        >
          E-Mail
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoFocus
          className={css({
            borderWidth: "1px",
            borderColor: "text",
            borderRadius: "sm",
            p: "2",
          })}
        ></input>
        {props.loginFormInfo}
        <Submit>{props.submitButtonText}</Submit>
      </div>
    </form>
  );
}

interface CodeFormProps {
  email: string;
  renderHint?: (email: string) => ReactNode;
  info?: ReactNode;
  submitButtonText?: string;
}

function CodeForm({
  email,
  renderHint,
  info,
  submitButtonText,
}: CodeFormProps) {
  const codeId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<CombinedError | undefined>();

  const gql = useClient();

  return (
    <form
      action={async (formData) => {
        const email = formData.get("email") as string;
        const code = (formData.get("code") as string)?.replace(/[^0-9]/g, "");
        const token = { type: SignInTokenType.EmailCode, payload: code };

        const unauthorizedRes = await gql.query(UnauthorizedSessionDocument, {
          email,
          token,
        });

        if (unauthorizedRes.error) {
          setError(unauthorizedRes.error);
          return;
        }

        const autorizedRes = await gql.mutation(AuthorizeSessionDocument, {
          email,
          tokens: [token],
          consents: unauthorizedRes.data?.unauthorizedSession?.requiredConsents,
        });

        if (autorizedRes.error) {
          setError(autorizedRes.error);
          return;
        }

        if (autorizedRes.data?.authorizeSession) {
          window.location.reload();
        }
      }}
      ref={formRef}
    >
      <div
        className={vstack({
          gap: "4",
          alignItems: "stretch",
          w: "full",
          maxW: "lg",
        })}
      >
        {renderHint?.(email)}
        {error && <ErrorMessage error={error} />}
        <input name="email" type="hidden" value={email} readOnly></input>
        <label
          htmlFor={codeId}
          className={css({
            fontWeight: "medium",
            fontSize: "sm",
          })}
        >
          Code
        </label>
        <div
          className={css({
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          })}
        >
          <CodeInput formRef={formRef} id={codeId} name="code" />
        </div>

        {info}
        <Submit>{submitButtonText}</Submit>
      </div>
    </form>
  );
}
