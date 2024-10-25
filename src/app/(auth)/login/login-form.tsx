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
import { ReactNode, useEffect, useId, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { CombinedError, useClient, useMutation } from "urql";
import { CodeInput } from "./code-input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

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
  const [pending, setPending] = useState(false);
  const t = useTranslations("checkout");

  const gql = useClient();

  const handleSubmit = async (formData: FormData) => {
    if (pending) {
      return;
    }

    const email = formData.get("email") as string;
    const code = (formData.get("code") as string)?.replace(/[^0-9]/g, "");
    const token = { type: SignInTokenType.EmailCode, payload: code };

    setPending(true);

    const unauthorizedRes = await gql.query(UnauthorizedSessionDocument, {
      email,
      token,
    });

    if (unauthorizedRes.error) {
      setError(unauthorizedRes.error);
      setPending(false);
      return;
    }

    const autorizedRes = await gql.mutation(AuthorizeSessionDocument, {
      email,
      tokens: [token],
      consents: unauthorizedRes.data?.unauthorizedSession?.requiredConsents,
    });

    if (autorizedRes.error) {
      setError(autorizedRes.error);
      setPending(false);
      return;
    }

    if (autorizedRes.data?.authorizeSession) {
      setTimeout(() => {
        window.location.reload();
      }, 200);
    }
  };

  return (
    <form action={handleSubmit} ref={formRef}>
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

        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "4",
            mt: "4",
          })}
        >
          {/* <label
            htmlFor={codeId}
            className={css({
              fontWeight: "medium",
              fontSize: "sm",
            })}
          >
            Code
          </label> */}
          <CodeInput
            id={codeId}
            name="code"
            disabled={pending}
            inputMode="numeric"
            autoFocus
            onComplete={() => {
              // Safari < 16 doesn't support requestSubmit(), so we submit manually
              // formRef.current?.requestSubmit?.();
              if (formRef.current && !pending) {
                handleSubmit(new FormData(formRef.current));
              }
            }}
          />
          <div
            // style={{ visibility: pending ? "visible" : "hidden" }}
            className={css({
              display: "flex",
              alignItems: "center",
              color: "textSoft",
              fontSize: "sm",
              textAlign: "center",
            })}
          >
            {pending ? (
              <>
                <span>{t("loginStep.code.checkingCode")}</span> <Spinner />
              </>
            ) : (
              <>
                <span>
                  {t.rich("loginStep.code.noCodeReceived", {
                    changeEmailButton: (chunks) => (
                      <button
                        type="button" // Important, so this button isn't used to submit the form
                        onClick={() => window.location.reload()}
                        className={css({
                          textDecoration: "underline",
                          display: "inline-block",
                        })}
                      >
                        {chunks}
                      </button>
                    ),
                  })}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
