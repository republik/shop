"use client";
import { updateMeRedeemGiftVoucher } from "@/actions/update-me";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { Me } from "@/lib/auth/types";
import { css } from "@/theme/css";
import { useTranslations } from "next-intl";
import { useActionState } from "react";

export function PersonalInfoForm({ code, me }: { code: string; me: Me }) {
  const [state, action, isPending] = useActionState(updateMeRedeemGiftVoucher, {
    ok: true,
    errors: {},
  });

  const t = useTranslations("form");
  const tField = useTranslations("form.fields");

  console.log(me);

  return (
    <form
      action={action}
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "4",
      })}
    >
      <h2
        className={css({
          textStyle: "h3Sans",
        })}
      >
        {t("name")}
      </h2>

      <FormField
        type="text"
        label={tField("firstName")}
        name="firstName"
        error={state.errors?.firstName}
        autoComplete="given-name"
        defaultValue={me.firstName ?? ""}
        required
      />
      <FormField
        type="text"
        label={tField("lastName")}
        name="lastName"
        error={state.errors?.lastName}
        autoComplete="family-name"
        defaultValue={me.lastName ?? ""}
        required
      />
      <h2
        className={css({
          textStyle: "h3Sans",
        })}
      >
        {t("address")}
      </h2>
      <FormField
        type="text"
        label={tField("name")}
        name="name"
        error={state.errors?.name}
        autoComplete="name"
        defaultValue={me.address?.name ?? ""}
        required
      />
      <FormField
        type="text"
        label={tField("line1")}
        name="line1"
        error={state.errors?.line1}
        autoComplete="address-line1"
        defaultValue={me.address?.line1 ?? ""}
        required
        maxLength={70}
      />
      <FormField
        type="text"
        label={tField("line2")}
        name="line2"
        error={state.errors?.line2}
        autoComplete="address-line2"
        defaultValue={me.address?.line2 ?? ""}
      />

      <div
        className={css({
          width: "full",
          display: "grid",
          gap: "4",
          gridTemplateColumns: "20% 1fr",
        })}
      >
        <FormField
          type="text"
          label={tField("postalCode")}
          name="postalCode"
          error={state.errors?.postalCode}
          autoComplete="postal-code"
          defaultValue={me.address?.postalCode ?? ""}
          required
        />
        <FormField
          type="text"
          label={tField("city")}
          name="city"
          error={state.errors?.city}
          autoComplete="address-level2"
          defaultValue={me.address?.city ?? ""}
          required
          maxLength={35}
        />
      </div>
      <FormField
        type="text"
        label={tField("country")}
        name="country"
        error={state.errors?.country}
        autoComplete="country-name"
        defaultValue={me.address?.country ?? ""}
        required
      />
      <input name="code" type="text" hidden readOnly value={code} />
      <Button type="submit" loading={isPending}>
        JETZT EINLÖSEN
      </Button>
    </form>
  );
}
