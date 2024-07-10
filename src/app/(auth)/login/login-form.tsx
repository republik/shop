"use client";
import { authorizeWithCode, signIn } from "@/app/(auth)/login/action";
import { Button } from "@/components/ui/button";
import { css } from "@/theme/css";
import { hstack, vstack } from "@/theme/patterns";
import { useId } from "react";
import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";

const ErrorMessage = ({ error }: { error: string }) => {
  return (
    <div
      className={css({
        bg: "amber.700",
        color: "text.inverted",
        p: "4",
      })}
    >
      <h2 className={css({ textStyle: "h3Sans", mb: "2" })}>
        Ein Fehler ist aufgetreten
      </h2>
      <p>{error}</p>
    </div>
  );
};

export const Submit = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      Anmelden
    </Button>
  );
};

export function LoginForm() {
  const emailId = useId();
  const [state, action] = useFormState(signIn, {});

  if (state.signIn && state.email) {
    return <CodeForm email={state.email} />;
  }

  return (
    <form action={action}>
      <div className={vstack({ gap: "2", alignItems: "stretch", w: "lg" })}>
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
        <Submit />
      </div>
    </form>
  );
}

function CodeForm({ email }: { email: string }) {
  const codeId = useId();

  const [state, action] = useFormState(authorizeWithCode, {});

  if (state.success) {
    return <div>Yay</div>;
  }

  return (
    <form action={action}>
      <div className={vstack({ gap: "2", alignItems: "stretch", w: "lg" })}>
        {state.error && <ErrorMessage error={state.error} />}
        <input name="email" type="hidden" value={email}></input>

        <label
          htmlFor={codeId}
          className={css({
            fontWeight: "medium",
            fontSize: "sm",
          })}
        >
          Code
        </label>
        <input
          id={codeId}
          name="code"
          type="text"
          className={css({
            borderWidth: "1px",
            borderColor: "text",
            borderRadius: "sm",
            p: "2",
          })}
        ></input>
        <Submit />
      </div>
    </form>
  );
}
