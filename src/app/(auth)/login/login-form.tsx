"use client";
import { authorizeWithCode, signIn } from "@/app/(auth)/login/action";
import { Button } from "@/components/ui/button";
import { css } from "@/theme/css";
import { vstack } from "@/theme/patterns";
import { ReactNode, useId, useState } from "react";
import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import useTranslation from "next-translate/useTranslation";
import { redirect } from "next/navigation";
import { CodeInput } from "./code-input";

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
  children?: ReactNode;
};

export function Submit(props: SubmitProps) {
  const { pending } = useFormStatus();
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
      {props.children ?? t("login:action")}
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
  const [state, action] = useFormState(signIn, {});

  if (state.signIn && state.email) {
    return (
      <CodeForm
        email={state.email}
        renderHint={props.renderCodeFormHint}
        info={props.loginFormInfo}
        submitButtonText={props.submitButtonText}
      />
    );
  }

  return (
    <form action={action}>
      <div
        className={vstack({
          gap: "4",
          alignItems: "stretch",
          w: "full",
          maxW: "lg",
        })}
      >
        {props.loginFormHeader}
        {state.error && <ErrorMessage error={state.error} />}
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

function CodeForm(props: CodeFormProps) {
  const codeId = useId();
  const [code, setCode] = useState("");

  const [state, action] = useFormState(authorizeWithCode, {});

  if (state.success) {
    redirect("/");
  }

  return (
    <form action={action}>
      <div
        className={vstack({
          gap: "4",
          alignItems: "stretch",
          w: "full",
          maxW: "lg",
        })}
      >
        {props.renderHint?.(props.email)}
        {state.error && <ErrorMessage error={state.error} />}
        <input name="email" type="hidden" value={props.email}></input>
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
            id={codeId}
            name="code"
            value={code}
            onChange={(val) => setCode(val)}
          />
        </div>

        {props.info}
        <Submit>{props.submitButtonText}</Submit>
      </div>
    </form>
  );
}
