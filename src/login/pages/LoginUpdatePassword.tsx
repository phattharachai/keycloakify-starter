import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { PasswordInput } from "./PasswordInput";

export default function LoginUpdatePassword(props: PageProps<Extract<KcContext, { pageId: "login-update-password.ftl" }>, I18n>) {
    const { kcContext, i18n, Template, doUseDefaultCss, classes } = props;

    const { url, messagesPerField, isAppInitiatedAction } = kcContext;
    const { msg, msgStr } = i18n;

    const [isSubmitting, setIsSubmitting] = useState(false);

    const hasNewPasswordError     = messagesPerField.existsError("password");
    const hasConfirmPasswordError = messagesPerField.existsError("password-confirm");

    const logoSrc = `${import.meta.env.BASE_URL}metronic/media/app/default-logo.svg`;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!hasNewPasswordError && !hasConfirmPasswordError}
            headerNode={msg("updatePasswordTitle")}
        >
            <form
                id="kc-passwd-update-form"
                className="flex flex-col gap-4"
                action={url.loginAction}
                method="post"
                onSubmit={() => { setIsSubmitting(true); return true; }}
            >
                {/* Branding + title */}
                <div className="text-center mb-1.5">
                    <a href="#" className="flex justify-center mb-3" tabIndex={-1} aria-hidden="true">
                        <img src={logoSrc} alt="Logo" className="h-8" />
                    </a>
                    <h3 className="text-lg font-medium text-mono leading-none">
                        {msg("updatePasswordTitle")}
                    </h3>
                </div>

                {/* New password */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="password-new" className="kt-form-label mb-0 text-sm font-medium text-mono">
                        {msg("passwordNew")}
                    </label>
                    <PasswordInput
                        id="password-new"
                        name="password-new"
                        placeholder={msgStr("passwordNew")}
                        autoFocus
                        autoComplete="new-password"
                        hasError={hasNewPasswordError}
                        errorId="input-error-password"
                        i18n={i18n}
                    />
                    {hasNewPasswordError && (
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

                {/* Confirm password */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="password-confirm" className="kt-form-label mb-0 text-sm font-medium text-mono">
                        {msg("passwordConfirm")}
                    </label>
                    <PasswordInput
                        id="password-confirm"
                        name="password-confirm"
                        placeholder={msgStr("passwordConfirm")}
                        autoComplete="new-password"
                        hasError={hasConfirmPasswordError}
                        errorId="input-error-password-confirm"
                        i18n={i18n}
                    />
                    {hasConfirmPasswordError && (
                        <span
                            id="input-error-password-confirm"
                            className="auth-error flex items-start gap-1.5 text-xs text-destructive mt-1"
                            role="alert"
                            aria-live="polite"
                        >
                            <i className="ki-filled ki-information-2 text-sm shrink-0 mt-px" />
                            <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.get("password-confirm")) }} />
                        </span>
                    )}
                </div>

                {/* Logout other sessions */}
                <label className="kt-label flex items-center gap-2 cursor-pointer rounded-md px-0.5 py-0.5">
                    <input
                        type="checkbox"
                        id="logout-sessions"
                        name="logout-sessions"
                        value="on"
                        defaultChecked
                        className="kt-checkbox kt-checkbox-sm"
                    />
                    <span className="kt-checkbox-label text-sm">{msg("logoutOtherSessions")}</span>
                </label>

                {/* Actions */}
                <div className="mt-1 flex gap-2.5">
                    <button
                        type="submit"
                        className="kt-btn kt-btn-primary flex justify-center grow transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                        aria-busy={isSubmitting}
                    >
                        {isSubmitting && <i className="ki-filled ki-loading animate-spin me-2" />}
                        {msg("doSubmit")}
                    </button>
                    {isAppInitiatedAction && (
                        <button
                            type="submit"
                            name="cancel-aia"
                            value="true"
                            className="kt-btn kt-btn-outline flex justify-center"
                        >
                            {msg("doCancel")}
                        </button>
                    )}
                </div>
            </form>
        </Template>
    );
}
