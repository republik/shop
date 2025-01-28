"use client";
import { FormField } from "@/app/angebot/abholen/components/form";
import { updateMe } from "@/app/angebot/abholen/components/update-me";
import { Button } from "@/components/ui/button";
import { Me } from "@/lib/auth/types";
import { useTranslations } from "next-intl";
import { useFormState } from "react-dom";

export function PersonalInfoForm({ code, me }: { code: string; me: Me }) {
  console.log(me);
  const [state, action] = useFormState(updateMe, { ok: true, errors: null });

  const t = useTranslations("formValidation");

  console.log(state);

  return (
    <form action={action}>
      <p>[Hier zusätzliche Infos abfragen]</p>

      <FormField
        type="text"
        label="Vorname"
        name="firstName"
        error={state.errors?.firstName}
        defaultValue={me.firstName ?? ""}
        required
      />
      <FormField
        type="text"
        label="Nachname"
        name="lastName"
        error={state.errors?.lastName}
        defaultValue={me.lastName ?? ""}
        required
      />
      <p>Vielleicht die Adresse hier so</p>
      <FormField
        type="text"
        label="Name"
        name="name"
        error={state.errors?.name}
        autoComplete="name"
        defaultValue={me.address?.name ?? ""}
        required
      />
      <FormField
        type="text"
        label="Strasse"
        name="line1"
        error={state.errors?.line1}
        autoComplete="address-line1"
        defaultValue={me.address?.line1 ?? ""}
        required
      />
      <FormField
        type="text"
        label="Strasse 2"
        name="line2"
        error={state.errors?.line2}
        autoComplete="address-line2"
        defaultValue={me.address?.line2 ?? ""}
      />
      <FormField
        type="text"
        label="PLZ"
        name="postalCode"
        error={state.errors?.postalCode}
        autoComplete="postal-code"
        defaultValue={me.address?.postalCode ?? ""}
        required
      />
      <FormField
        type="text"
        label="Ort"
        name="city"
        error={state.errors?.city}
        autoComplete="address-level2"
        defaultValue={me.address?.city ?? ""}
        required
      />
      <FormField
        type="text"
        label="Land"
        name="country"
        error={state.errors?.country}
        autoComplete="country-name"
        defaultValue={me.address?.country ?? ""}
        required
      />
      <input name="code" type="text" hidden readOnly value={code} />
      <Button type="submit">JETZT EINLÖSEN</Button>
    </form>
  );
}
