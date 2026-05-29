import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { logoSrc } from "../assets";

export default function LoginResetPassword(props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>) {
    const { kcContext, i18n, Template, doUseDefaultCss, classes } = props;

    const { url, realm, auth, messagesPerField } = kcContext;
    const { msg, msgStr } = i18n;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const hasError = messagesPerField.existsError("username");

    const fieldLabel = !realm.loginWithEmailAllowed
        ? msg("username")
        : !realm.registrationEmailAsUsername
          ? msg("usernameOrEmail")
          : msg("email");


    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!hasError}
            headerNode={msg("emailForgotTitle")}
        >
            <form
                id="kc-reset-password-form"
                className="flex flex-col gap-4"
                action={url.loginAction}
                method="post"
                onSubmit={() => { setIsSubmitting(true); return true; }}
            >
                {/* Branding + title */}
                <div className="text-center mb-1.5">
                    <a href="#" className="flex justify-center mb-3" tabIndex={-1} aria-hidden="true">
                        <img src={logoSrc} alt="Logo" className="auth-logo" />
                    </a>
                    <h3 className="text-lg font-medium text-mono leading-none mb-2">
                        {msg("emailForgotTitle")}
                    </h3>
                    <p className="text-sm text-secondary-foreground">
                        {realm.duplicateEmailsAllowed ? msg("emailInstructionUsername") : msg("emailInstruction")}
                    </p>
                </div>

                {/* Username / email field */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="username" className="kt-form-label mb-0 text-sm font-medium text-mono">
                        {fieldLabel}
                    </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        autoFocus
                        placeholder={
                            !realm.loginWithEmailAllowed
                                ? msgStr("username")
                                : !realm.registrationEmailAsUsername
                                  ? msgStr("usernameOrEmail")
                                  : msgStr("email")
                        }
                        defaultValue={auth.attemptedUsername ?? ""}
                        className="kt-input"
                        aria-invalid={hasError}
                        aria-describedby={hasError ? "input-error-username" : undefined}
                    />
                    {hasError && (
                        <span
                            id="input-error-username"
                            className="auth-error flex items-start gap-1.5 text-xs text-destructive mt-1"
                            role="alert"
                            aria-live="polite"
                        >
                            <i className="ki-filled ki-information-2 text-sm shrink-0 mt-px" />
                            <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.get("username")) }} />
                        </span>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="kt-btn kt-btn-primary mt-1 flex justify-center grow transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                >
                    {isSubmitting && <i className="ki-filled ki-loading animate-spin me-2" />}
                    {msg("doSubmit")}
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
