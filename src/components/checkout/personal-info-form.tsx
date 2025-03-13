"use client";
import { updateMe } from "@/actions/update-me";
import { useSignOut } from "@/components/login/login-view";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import type { Me } from "@/lib/auth/types";
import { css } from "@/theme/css";
import { useTranslations } from "next-intl";
import { useActionState, useEffect } from "react";

export function PersonalInfoForm({
  code,
  me,
  addressRequired,
  onComplete,
}: {
  code?: string;
  me: Me;
  addressRequired: boolean;
  onComplete: () => void;
}) {
  const [state, action, isPending] = useActionState(updateMe, {
    type: "initial",
    data: {
      firstName: me.firstName,
      lastName: me.lastName,
      name: me.address?.name,
      line1: me.address?.line1,
      line2: me.address?.line2,
      postalCode: me.address?.postalCode,
      city: me.address?.city,
      country: me.address?.country,
    },
  });

  const signOut = useSignOut();

  const t = useTranslations();
  const tForm = useTranslations("form");
  const tField = useTranslations("form.fields");

  useEffect(() => {
    if (state.type === "success") {
      onComplete();
    }
  }, [state]);

  return (
    <form
      action={action}
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "4",
      })}
    >
      <p>{tForm("infoFormNote")}</p>
      <FormField
        type="text"
        label={tField("email")}
        name="email"
        disabled
        readOnly
        defaultValue={me.email ?? undefined}
        description={tForm.rich("changeEmailNote", {
          signOutButton: (chunks) => (
            <Button type="button" variant="link" onClick={() => signOut()}>
              {chunks}
            </Button>
          ),
        })}
      />
      <FormField
        type="text"
        label={tField("firstName")}
        name="firstName"
        error={state.errors?.firstName}
        autoComplete="given-name"
        defaultValue={state.data.firstName ?? undefined}
        required
      />
      <FormField
        type="text"
        label={tField("lastName")}
        name="lastName"
        error={state.errors?.lastName}
        autoComplete="family-name"
        defaultValue={state.data.lastName ?? undefined}
        required
      />

      {addressRequired && (
        <>
          <h2
            className={css({
              textStyle: "h3Sans",
              mt: "4",
            })}
          >
            {tForm("address")}
          </h2>

          <p>{tForm("addressNote")}</p>

          <FormField
            type="text"
            label={tField("line1")}
            name="line1"
            error={state.errors?.line1}
            autoComplete="address-line1"
            defaultValue={state.data.line1 ?? undefined}
            required
            maxLength={70}
          />
          <FormField
            type="text"
            label={tField("line2")}
            name="line2"
            error={state.errors?.line2}
            autoComplete="address-line2"
            defaultValue={state.data.line2 ?? undefined}
          />

          <div
            className={css({
              width: "full",
              display: "grid",
              gap: "4",
              gridTemplateColumns: "25% 1fr",
            })}
          >
            <FormField
              type="text"
              label={tField("postalCode")}
              name="postalCode"
              error={state.errors?.postalCode}
              autoComplete="postal-code"
              defaultValue={state.data.postalCode ?? undefined}
              required
            />
            <FormField
              type="text"
              label={tField("city")}
              name="city"
              error={state.errors?.city}
              autoComplete="address-level2"
              defaultValue={state.data.city ?? undefined}
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
            defaultValue={state.data.country ?? undefined}
            required
          />
        </>
      )}

      {code && <input name="code" type="text" hidden readOnly value={code} />}

      <input
        name="addressRequired"
        type="text"
        hidden
        readOnly
        value={addressRequired ? "required" : "notRequired"}
      />

      <div className={css({ mt: "4" })}>
        <Button type="submit" size="large" loading={isPending}>
          {t("checkout.actions.next")}
        </Button>
      </div>
    </form>
  );
}
