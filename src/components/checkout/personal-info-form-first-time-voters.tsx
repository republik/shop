"use client";
import { requestAccess } from "@/actions/request-access";
import { updateMe } from "@/actions/update-me";
import { useSignOut } from "@/components/login/login-view";
import { Button } from "@/components/ui/button";
import {
  Checkbox,
  FormField,
  SelectField,
  TextArea,
} from "@/components/ui/form";
import type { Me } from "@/lib/auth/types";
import { css } from "@/theme/css";
import { useTranslations } from "next-intl";
import React, {
  useActionState,
  useEffect,
  useId,
  useMemo,
  useState,
  useTransition,
} from "react";

const GENDER_PRESET_KEYS = [
  "female",
  "male",
  "non-binary",
  "unspecified",
] as const;

const CUSTOM_GENDER = "__custom__";

function getInitialGenderMode(
  gender: string | null | undefined,
  presetValues: string[],
) {
  if (!gender) {
    return { mode: "preset" as const, preset: "", custom: "" };
  }

  if (presetValues.includes(gender)) {
    return { mode: "preset" as const, preset: gender, custom: "" };
  }

  return { mode: "custom" as const, preset: CUSTOM_GENDER, custom: gender };
}

export function PersonalInfoFormFirstTimeVoters({
  campaignId,
  code,
  me,
  birthyear,
  addressRequired,
  onComplete,
}: {
  campaignId: string;
  code?: string;
  me: Me;
  birthyear?: string;
  addressRequired: boolean;
  onComplete: () => void | Promise<void>;
}) {
  const [state, action, isPending] = useActionState(updateMe, {
    type: "initial",
    data: {
      firstName: me.firstName,
      lastName: me.lastName,
      organization: me.address?.organization,
      gender: me.gender,
      name: me.address?.name,
      line1: me.address?.line1,
      line2: me.address?.line2,
      postalCode: me.address?.postalCode,
      city: me.address?.city,
      country: me.address?.country,
      birthyear,
    },
  });

  const [isRequestingAccess, startRequestAccess] = useTransition();
  const [requestAccessError, setRequestAccessError] = useState<string | null>(
    null,
  );
  const [motivation, setMotivation] = useState("");
  const motivationId = useId();

  const signOut = useSignOut();

  const t = useTranslations();
  const tForm = useTranslations("form");
  const tField = useTranslations("form.fields");
  const tDefault = useTranslations("form.defaults");
  const tGender = useTranslations("form.genderOptions");
  const tFtv = useTranslations("landing.first-time-voters");

  const presetValues = useMemo(
    () => GENDER_PRESET_KEYS.map((key) => tGender(key)),
    [tGender],
  );

  const initialGender = state.data.gender ?? me.gender ?? "";
  const initialGenderState = useMemo(
    () => getInitialGenderMode(initialGender, presetValues),
    [initialGender, presetValues],
  );

  const [genderMode, setGenderMode] = useState(initialGenderState.mode);
  const [selectedPreset, setSelectedPreset] = useState(
    initialGenderState.preset,
  );
  const [customGender, setCustomGender] = useState(initialGenderState.custom);

  useEffect(() => {
    const nextGender = state.data.gender ?? me.gender ?? "";
    const nextGenderState = getInitialGenderMode(nextGender, presetValues);
    setGenderMode(nextGenderState.mode);
    setSelectedPreset(nextGenderState.preset);
    setCustomGender(nextGenderState.custom);
  }, [me.gender, presetValues, state.data.gender]);

  useEffect(() => {
    if (state.type === "success") {
      startRequestAccess(async () => {
        const result = await requestAccess(
          campaignId,
          motivation,
        );
        if (result.type === "success") {
          onComplete();
        } else if (result.type === "error") {
          setRequestAccessError(result.message);
        }
      });
    }
  }, [state, onComplete]);

  return (
    <form
      action={action}
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "4",
      })}
    >
      <FormField
        type="text"
        label={tField("email")}
        name="email"
        disabled
        readOnly
        defaultValue={me.email ?? undefined}
        description={tForm.rich("changeEmailNote", {
          signOutButton: (chunks: React.ReactNode) => (
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
      <SelectField
        label={tField("gender")}
        error={state.errors?.gender}
        value={genderMode === "custom" ? CUSTOM_GENDER : selectedPreset}
        required={genderMode === "preset"}
        onChange={(event) => {
          const value = event.target.value;

          if (value === CUSTOM_GENDER) {
            setGenderMode("custom");
            setSelectedPreset(CUSTOM_GENDER);
            return;
          }

          setGenderMode("preset");
          setSelectedPreset(value);
          setCustomGender("");
        }}
      >
        <option value="" disabled hidden>
          {tField("gender")}
        </option>
        {GENDER_PRESET_KEYS.map((key) => (
          <option key={key} value={tGender(key)}>
            {tGender(key)}
          </option>
        ))}
        <option value={CUSTOM_GENDER}>{tGender("custom")}</option>
      </SelectField>
      {genderMode === "preset" ? (
        <input type="hidden" name="gender" value={selectedPreset} />
      ) : (
        <FormField
          type="text"
          label={tField("gender")}
          name="gender"
          error={state.errors?.gender}
          value={customGender}
          onChange={(event) => setCustomGender(event.target.value)}
          required
        />
      )}

      <FormField
        type="number"
        label={tField("birthyear")}
        name="birthyear"
        defaultValue={state.data.birthyear ?? new Date().getFullYear()}
        required
        min={new Date().getFullYear() - 20}
        max={new Date().getFullYear()}
      />

      <h2 className={css({ fontSize: "md", fontWeight: "medium", mt: "4" })}>
        {tForm("address")}
      </h2>

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
        defaultValue={state.data.country ?? tDefault("country")}
        required
      />

      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "1.5",
          mt: "4",
        })}
      >
        <label
          htmlFor={motivationId}
          className={css({ fontSize: "sm", textAlign: "left" })}
        >
          <b>{tFtv("motivation.label")}</b> {tFtv("motivation.description")}
        </label>
        <textarea
          id={motivationId}
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          required
          rows={5}
          className={css({
            background: "white",
            borderWidth: "1px",
            borderColor: "divider",
            borderRadius: "sm",
            p: "2",
            resize: "vertical",
            _focus: { borderColor: "text", outline: "none" },
            _placeholder: { color: "text.tertiary", fontWeight: "normal" },
          })}
        />
      </div>

      <h2
        className={css({
          fontSize: "md",
          fontWeight: "medium",
          mt: "4",
        })}
      >
        {tFtv("legal.title")}
      </h2>

      <Checkbox name="confirmSuspension" value="yes" required>
        {tFtv("legal.accountSuspension")}
      </Checkbox>

      {code && <input name="code" type="text" hidden readOnly value={code} />}

      <input
        name="addressRequired"
        type="text"
        hidden
        readOnly
        value={addressRequired ? "required" : "notRequired"}
      />

      <div className={css({ mt: "4" })}>
        <Button
          type="submit"
          size="large"
          loading={isPending || isRequestingAccess}
        >
          {t("checkout.actions.next")}
        </Button>
        {requestAccessError && (
          <p className={css({ mt: "2", color: "error" })}>
            {requestAccessError ===
            "Sie können keinen weiteren Zugriff vergeben."
              ? t("checkout.errors.requestAccessAlreadyRequested")
              : t("checkout.errors.requestAccessFailed")}
          </p>
        )}
      </div>
    </form>
  );
}
