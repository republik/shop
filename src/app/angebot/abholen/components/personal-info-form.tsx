"use client";
import { updateMe } from "@/app/angebot/abholen/components/update-me";
import { Button } from "@/components/ui/button";
import { Me } from "@/lib/auth/types";
import { useFormState } from "react-dom";

export function PersonalInfoForm({ code, me }: { code: string; me: Me }) {
  console.log(me);
  const [state, action] = useFormState(updateMe, {});

  console.log(state);

  return (
    <form action={action}>
      <p>[Hier zusätzliche Infos abfragen]</p>

      <label>
        Vorname
        <input
          name="firstName"
          type="text"
          defaultValue={me.firstName ?? ""}
          required
        />
      </label>
      <label>
        Nachname
        <input
          name="lastName"
          type="text"
          defaultValue={me.lastName ?? ""}
          required
        />
      </label>

      <p>Vielleicht die Adresse hier so</p>

      <label>
        Name
        <input
          name="name"
          type="text"
          defaultValue={me.address?.name ?? ""}
          required
        />
      </label>

      <label>
        Strasse
        <input
          name="line1"
          type="text"
          defaultValue={me.address?.line1 ?? ""}
          required
        />
      </label>
      <label>
        Strasse 2
        <input
          name="line2"
          type="text"
          defaultValue={me.address?.line2 ?? ""}
        />
      </label>
      <label>
        PLZ
        <input
          name="postalCode"
          type="text"
          defaultValue={me.address?.postalCode ?? ""}
          required
        />
      </label>
      <label>
        Ort
        <input
          name="city"
          type="text"
          defaultValue={me.address?.city ?? ""}
          required
        />
      </label>
      <label>
        Land
        <input
          name="country"
          type="text"
          defaultValue={me.address?.country ?? ""}
          required
        />
      </label>

      <input name="code" type="text" hidden readOnly value={code} />
      <Button type="submit">JETZT EINLÖSEN</Button>
    </form>
  );
}
