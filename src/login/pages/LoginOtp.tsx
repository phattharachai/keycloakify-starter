import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { logoSrc, illustrationSrc } from "../assets";

export default function LoginOtp(props: PageProps<Extract<KcContext, { pageId: "login-otp.ftl" }>, I18n>) {
    const { kcContext, i18n, Template, doUseDefaultCss, classes } = props;

    const { otpLogin, url, messagesPerField } = kcContext;
    const { msg } = i18n;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const hasError = messagesPerField.existsError("totp");


    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!hasError}
            headerNode={msg("doLogIn")}
        >
            <form
                id="kc-otp-login-form"
                className="flex flex-col gap-5"
                action={url.loginAction}
                method="post"
                onSubmit={() => { setIsSubmitting(true); return true; }}
            >
                {/* Logo */}
                <div className="flex justify-center">
                    <img src={logoSrc} alt="Logo" className="auth-logo" />
                </div>

                {/* Illustration */}
                <div className="flex justify-center py-1">
                    <img
                        alt="2FA verification"
                        className="h-20"
                        src={illustrationSrc(34)}
                    />
                </div>

                {/* Title */}
                <div className="text-center">
                    <h3 className="text-lg font-medium text-mono">
                        {msg("loginOtpOneTime")}
                    </h3>
                </div>

                {/* OTP device selector */}
                {otpLogin.userOtpCredentials.length > 1 && (
                    <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-2">
                        {otpLogin.userOtpCredentials.map((otpCredential, index) => (
                            <label key={index} className="kt-label flex items-center gap-2 cursor-pointer rounded-md px-2 py-1.5 hover:bg-background">
                                <input
                                    id={`kc-otp-credential-${index}`}
                                    type="radio"
                                    name="selectedCredentialId"
                                    value={otpCredential.id}
                                    defaultChecked={otpCredential.id === otpLogin.selectedCredentialId}
                                    className="kt-radio"
                                />
                                <span className="text-sm text-mono">{otpCredential.userLabel}</span>
                            </label>
                        ))}
                    </div>
                )}

                {/* OTP input */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="otp" className="sr-only">
                        {msg("loginOtpOneTime")}
                    </label>
                    <input
                        id="otp"
                        name="otp"
                        type="text"
                        autoComplete="one-time-code"
                        inputMode="numeric"
                        autoFocus
                        placeholder="• • • • • •"
                        className="kt-input text-center tracking-[0.5em] text-lg font-medium"
                        aria-invalid={hasError}
                        aria-describedby={hasError ? "input-error-otp-code" : undefined}
                    />
                    {hasError && (
                        <span
                            id="input-error-otp-code"
                            className="auth-error flex items-start justify-center gap-1.5 text-xs text-destructive mt-1"
                            role="alert"
                            aria-live="polite"
                        >
                            <i className="ki-filled ki-information-2 text-sm shrink-0 mt-px" />
                            <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.get("totp")) }} />
                        </span>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="kt-btn kt-btn-primary flex justify-center grow transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                >
                    {isSubmitting && <i className="ki-filled ki-loading animate-spin me-2" />}
                    {msg("doLogIn")}
                </button>
            </form>
        </Template>
    );
}
