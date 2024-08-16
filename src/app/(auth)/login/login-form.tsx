"use client";
import { authorizeWithCode, signIn } from "@/app/(auth)/login/action";
import { Button } from "@/components/ui/button";
import { css } from "@/theme/css";
import { vstack } from "@/theme/patterns";
import { ReactNode, useId, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import useTranslation from "next-translate/useTranslation";
import { redirect } from "next/navigation";
import { CodeInput } from "./code-input";
import { useClient, useMutation, useQuery } from "urql";
import {
  AuthorizeSessionDocument,
  SignInDocument,
  SignInTokenType,
  UnauthorizedSessionDocument,
} from "#graphql/republik-api/__generated__/gql/graphql";

const ErrorMessage = ({ error }: { error: string }) => {
  const { t } = useTranslation("error");
  return (
    <div
      className={css({
        bg: "amber.700",
        color: "text.inverted",
        p: "4",
      })}
    >
      <h2 className={css({ textStyle: "h3Sans", mb: "2" })}>
        {t("error:generic")}
      </h2>
      <p>{error}</p>
    </div>
  );
};

type SubmitProps = {
  pending?: boolean;
  children?: ReactNode;
};

export function Submit({ children, pending }: SubmitProps) {
  const { t } = useTranslation("login");
  return (
    <Button
      type="submit"
      disabled={pending}
      loading={pending}
      className={css({
        w: "max",
      })}
    >
      {children ?? t("login:action")}
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

  const [{ data, error, fetching, operation }, signIn] =
    useMutation(SignInDocument);

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
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        if (email) {
          signIn({
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
        {error && <ErrorMessage error={error.message} />}
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
        <Submit pending={fetching}>{props.submitButtonText}</Submit>
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
  // const [code, setCode] = useState("");

  const gql = useClient();

  const [{ data, error, fetching }, authorizeCode] = useMutation(
    AuthorizeSessionDocument
  );

  if (data?.authorizeSession) {
    window?.location.reload();
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const email = formData.get("email") as string;
        const code = (formData.get("code") as string)?.replace(/[^0-9]/g, "");
        const token = { type: SignInTokenType.EmailCode, payload: code };

        gql
          .query(UnauthorizedSessionDocument, {
            email,
            token,
          })
          .then((res) => {
            return authorizeCode({
              email,
              tokens: [token],
              consents: res.data?.unauthorizedSession?.requiredConsents,
            });
          });
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
        {error && <ErrorMessage error={error.message} />}
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
          <CodeInput
            formRef={formRef}
            id={codeId}
            name="code"
            // value={code}
            // onChange={(val) => setCode(val)}
          />
        </div>

        {info}
        <Submit pending={fetching}>{submitButtonText}</Submit>
      </div>
    </form>
  );
}
