import { Fragment, useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function LoginResetOtp(props: PageProps<Extract<KcContext, { pageId: "login-reset-otp.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, messagesPerField, configuredOtpCredentials } = kcContext;
    const { msg, msgStr } = i18n;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const hasError = messagesPerField.existsError("totp");

    const logoSrc = `${import.meta.env.BASE_URL}metronic/media/app/default-logo.svg`;

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
                id="kc-otp-reset-form"
                className="flex flex-col gap-5"
                action={url.loginAction}
                method="post"
                onSubmit={() => { setIsSubmitting(true); return true; }}
            >
                {/* Logo */}
                <div className="flex justify-center">
                    <img src={logoSrc} alt="Logo" className="h-8" />
                </div>

                {/* Icon + title */}
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex items-center justify-center size-16 rounded-full bg-primary/10">
                        <i className="ki-filled ki-security-user text-primary text-3xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-mono leading-none mb-1">
                            {msg("doLogIn")}
                        </h3>
                        <p className="text-sm text-secondary-foreground">
                            {msg("otp-reset-description")}
                        </p>
                    </div>
                </div>

                {/* OTP device list */}
                {configuredOtpCredentials.userOtpCredentials.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                            {msg("otp-reset-description")}
                        </p>
                        {configuredOtpCredentials.userOtpCredentials.map((otpCredential, index) => (
                            <Fragment key={otpCredential.id}>
                                <label
                                    htmlFor={`kc-otp-credential-${index}`}
                                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/40 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-colors"
                                >
                                    <input
                                        id={`kc-otp-credential-${index}`}
                                        type="radio"
                                        name="selectedCredentialId"
                                        value={otpCredential.id}
                                        defaultChecked={otpCredential.id === configuredOtpCredentials.selectedCredentialId}
                                        className="kt-radio shrink-0"
                                    />
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="flex items-center justify-center size-9 rounded-full bg-background border border-border shrink-0">
                                            <i className="ki-filled ki-phone text-muted-foreground text-base" />
                                        </div>
                                        <span className="text-sm font-medium text-mono truncate">
                                            {otpCredential.userLabel}
                                        </span>
                                    </div>
                                </label>
                            </Fragment>
                        ))}
                    </div>
                )}

                {/* Error */}
                {hasError && (
                    <span
                        className="auth-error flex items-start justify-center gap-1.5 text-xs text-destructive"
                        role="alert"
                        aria-live="polite"
                    >
                        <i className="ki-filled ki-information-2 text-sm shrink-0 mt-px" />
                        <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.get("totp")) }} />
                    </span>
                )}

                {/* Submit */}
                <button
                    id="kc-otp-reset-form-submit"
                    type="submit"
                    className="kt-btn kt-btn-primary flex justify-center grow transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                >
                    {isSubmitting && <i className="ki-filled ki-loading animate-spin me-2" />}
                    {msgStr("doSubmit")}
                </button>
            </form>
        </Template>
    );
}
