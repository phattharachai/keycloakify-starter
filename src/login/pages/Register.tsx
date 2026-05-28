import { useState, useLayoutEffect } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { JSX } from "keycloakify/tools/JSX";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { logoSrc } from "../assets";

type Props = PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n> & {
    UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
    doMakeUserConfirmPassword: boolean;
};

const profileClasses = {
    kcFormGroupClass:                       "flex flex-col gap-1.5 mb-4",
    kcFormGroupHeader:                      "text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border pb-2 mb-2",
    kcContentWrapperClass:                  "",
    kcLabelWrapperClass:                    "flex items-baseline gap-0.5",
    kcLabelClass:                           "kt-form-label font-medium text-mono",
    kcInputWrapperClass:                    "flex flex-col gap-1",
    kcInputClass:                           "kt-input",
    kcInputGroup:                           "auth-password-input",
    kcTextareaClass:                        "kt-input min-h-[80px] resize-y",
    kcInputErrorMessageClass:               "auth-error flex items-start gap-1.5 text-xs text-destructive mt-1",
    kcInputHelperTextBeforeClass:           "auth-helper text-xs mb-1",
    kcInputHelperTextAfterClass:            "auth-helper text-xs mt-0.5",
    kcFormPasswordVisibilityButtonClass:    "auth-password-toggle",
    kcFormPasswordVisibilityIconHide:       "ki-filled ki-eye-slash text-muted-foreground",
    kcFormPasswordVisibilityIconShow:       "ki-filled ki-eye text-muted-foreground",
    kcInputClassCheckbox:                   "flex items-center gap-2 rounded-md py-1",
    kcInputClassCheckboxInput:              "kt-checkbox kt-checkbox-sm",
    kcInputClassCheckboxLabel:              "text-sm text-mono",
    kcInputClassRadio:                      "flex items-center gap-2 rounded-md py-1",
    kcInputClassRadioInput:                 "kt-radio",
    kcInputClassRadioLabel:                 "text-sm text-mono",
    kcInputClassRadioCheckboxLabelDisabled: "opacity-60 cursor-not-allowed",
} as const;

export default function Register(props: Props) {
    const {
        kcContext, i18n, doUseDefaultCss, Template, classes,
        UserProfileFormFields, doMakeUserConfirmPassword
    } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes: { ...profileClasses, ...classes } });

    const {
        messageHeader, url, messagesPerField,
        recaptchaRequired, recaptchaVisible, recaptchaSiteKey, recaptchaAction,
        termsAcceptanceRequired
    } = kcContext;

    const { msg, msgStr, advancedMsg } = i18n;

    const [isFormSubmittable, setIsFormSubmittable] = useState(false);
    const [areTermsAccepted,  setAreTermsAccepted]  = useState(false);
    const [isSubmitting,      setIsSubmitting]      = useState(false);


    // Required by invisible reCAPTCHA (v2 invisible / v3)
    useLayoutEffect(() => {
        (window as unknown as Record<string, unknown>)["onSubmitRecaptcha"] = () => {
            (document.getElementById("kc-register-form") as HTMLFormElement).requestSubmit();
        };
        return () => {
            delete (window as unknown as Record<string, unknown>)["onSubmitRecaptcha"];
        };
    }, []);

    const isSubmitDisabled =
        !isFormSubmittable ||
        (termsAcceptanceRequired === true && !areTermsAccepted) ||
        isSubmitting;

    const titleNode = messageHeader !== undefined
        ? advancedMsg(messageHeader)
        : msg("registerTitle");

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={titleNode}
            displayMessage={messagesPerField.exists("global")}
        >
            <div className="flex flex-col gap-5">

                {/* Logo + title */}
                <div className="text-center mb-2.5">
                    <a href="#" className="flex justify-center mb-3" tabIndex={-1} aria-hidden="true">
                        <img src={logoSrc} alt="Logo" className="h-8" />
                    </a>

                    {/* Inline icon badge + title */}
                    <div className="flex items-center justify-center gap-2.5 mb-2">
                        <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 shrink-0">
                            <i className="ki-filled ki-plus text-primary text-sm" />
                        </div>
                        <h3 className="text-lg font-medium text-mono leading-none">
                            {titleNode}
                        </h3>
                    </div>

                    {/* Already have account */}
                    <div className="flex items-center justify-center gap-1 font-medium">
                        <span className="text-sm text-secondary-foreground">
                            {msg("alreadyHaveAccount")}
                        </span>
                        <a className="text-sm kt-link" href={url.loginUrl}>
                            {msg("doLogIn")}
                        </a>
                    </div>
                </div>

                {/* Registration form */}
                <form
                    id="kc-register-form"
                    action={url.registrationAction}
                    method="post"
                    onSubmit={() => { setIsSubmitting(true); return true; }}
                >
                    {/* Dynamic profile fields via Keycloakify */}
                    <UserProfileFormFields
                        kcContext={kcContext}
                        i18n={i18n}
                        kcClsx={kcClsx}
                        onIsFormSubmittableValueChange={setIsFormSubmittable}
                        doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                    />

                    {/* Terms acceptance */}
                    {termsAcceptanceRequired && (
                        <div className="flex flex-col gap-3 mb-4">
                            {/* Scrollable terms text */}
                            <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 max-h-[120px] overflow-y-auto">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                                    {msg("termsTitle")}
                                </p>
                                <div
                                    id="kc-registration-terms-text"
                                    className="text-sm text-secondary-foreground leading-relaxed [&_a]:kt-link"
                                >
                                    {msg("termsText")}
                                </div>
                            </div>

                            {/* Accept checkbox */}
                            <div className="flex flex-col gap-1">
                                <label className="kt-label flex items-start gap-2 cursor-pointer rounded-md px-0.5 py-1">
                                    <input
                                        type="checkbox"
                                        id="termsAccepted"
                                        name="termsAccepted"
                                        className="kt-checkbox kt-checkbox-sm mt-0.5 shrink-0"
                                        checked={areTermsAccepted}
                                        onChange={e => setAreTermsAccepted(e.target.checked)}
                                        aria-invalid={messagesPerField.existsError("termsAccepted")}
                                        aria-describedby={
                                            messagesPerField.existsError("termsAccepted")
                                                ? "input-error-terms"
                                                : undefined
                                        }
                                    />
                                    <span className="kt-checkbox-label text-sm leading-snug">
                                        {msg("acceptTerms")}
                                    </span>
                                </label>
                                {messagesPerField.existsError("termsAccepted") && (
                                    <span
                                        id="input-error-terms"
                                        className="auth-error flex items-start gap-1.5 text-xs text-destructive"
                                        role="alert"
                                        aria-live="polite"
                                    >
                                        <i className="ki-filled ki-information-2 text-sm shrink-0 mt-px" />
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: kcSanitize(messagesPerField.get("termsAccepted") ?? "")
                                            }}
                                        />
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* reCAPTCHA — visible mode */}
                    {recaptchaRequired && (recaptchaVisible || recaptchaAction === undefined) && (
                        <div className="mb-4 flex justify-center">
                            <div
                                className="g-recaptcha"
                                data-size="compact"
                                data-sitekey={recaptchaSiteKey}
                                data-action={recaptchaAction}
                            />
                        </div>
                    )}

                    {/* Submit */}
                    <div className="flex flex-col gap-2.5 mt-2">
                        {recaptchaRequired && !recaptchaVisible && recaptchaAction !== undefined ? (
                            /* Invisible reCAPTCHA — button triggers verification, callback submits form */
                            <button
                                type="submit"
                                className="g-recaptcha kt-btn kt-btn-primary flex justify-center grow transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                                data-sitekey={recaptchaSiteKey}
                                data-callback="onSubmitRecaptcha"
                                data-action={recaptchaAction}
                            >
                                {msgStr("doRegister")}
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={isSubmitDisabled}
                                aria-busy={isSubmitting}
                                className="kt-btn kt-btn-primary flex justify-center grow transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isSubmitting && <i className="ki-filled ki-loading animate-spin me-2" />}
                                {msgStr("doRegister")}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </Template>
    );
}
