import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { PasswordInput } from "./PasswordInput";

export default function LoginPassword(props: PageProps<Extract<KcContext, { pageId: "login-password.ftl" }>, I18n>) {
    const { kcContext, i18n, Template, doUseDefaultCss, classes } = props;

    const { realm, url, messagesPerField } = kcContext;
    const { msg, msgStr } = i18n;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const hasError = messagesPerField.existsError("password");

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
                id="kc-form-login"
                className="flex flex-col gap-5"
                action={url.loginAction}
                method="post"
                onSubmit={() => { setIsSubmitting(true); return true; }}
            >
                {/* Branding + title */}
                <div className="text-center mb-2.5">
                    <a href="#" className="flex justify-center mb-3" tabIndex={-1} aria-hidden="true">
                        <img src={logoSrc} alt="Logo" className="h-8" />
                    </a>
                    <h3 className="text-lg font-medium text-mono leading-none">
                        {msg("doLogIn")}
                    </h3>
                </div>

                {/* Password field */}
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                        <label htmlFor="password" className="kt-form-label font-normal text-mono">
                            {msg("password")}
                        </label>
                        {realm.resetPasswordAllowed && (
                            <a className="text-sm kt-link shrink-0 text-right" href={url.loginResetCredentialsUrl}>
                                {msg("doForgotPassword")}
                            </a>
                        )}
                    </div>
                    <PasswordInput
                        id="password"
                        name="password"
                        placeholder={msgStr("password")}
                        autoFocus
                        autoComplete="current-password"
                        hasError={hasError}
                        errorId="input-error-password"
                        i18n={i18n}
                    />
                    {hasError && (
                        <span
                            id="input-error-password"
                            className="auth-error flex items-start gap-1.5 text-xs text-destructive mt-1"
                            role="alert"
                            aria-live="polite"
                        >
                            <i className="ki-filled ki-information-2 text-sm shrink-0 mt-px" />
                            <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.get("password")) }} />
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
                    {!isSubmitting && <i className="ki-filled ki-black-right ms-1" />}
                </button>

                <div className="text-center">
                    <a href={url.loginUrl} className="text-sm kt-link">
                        {msg("backToLogin")}
                    </a>
                </div>
            </form>
        </Template>
    );
}
