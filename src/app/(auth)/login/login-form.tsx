"use client";
import { authorizeWithCode, signIn } from "@/app/(auth)/login/action";
import { useId } from "react";
import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";

export const Submit = () => {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      Anmelden
    </button>
  );
};

export function LoginForm() {
  const emailId = useId();
  const [state, action] = useFormState(signIn, {});

  if (state.error) {
    return <p>Upsipupsi</p>;
  }

  console.log(state);

  if (state.signIn && state.email) {
    return <CodeForm email={state.email} />;
  }

  return (
    <form action={action}>
      <label htmlFor={emailId}>E-Mail</label>
      <input id={emailId} name="email" type="email"></input>
      <Submit />
    </form>
  );
}

function CodeForm({ email }: { email: string }) {
  const codeId = useId();

  const [state, action] = useFormState(authorizeWithCode, {});

  return (
    <form action={action}>
      <input name="email" type="hidden" value={email}></input>

      <label htmlFor={codeId}>Code</label>
      <input id={codeId} name="code" type="text"></input>
      <Submit />
    </form>
  );
}
