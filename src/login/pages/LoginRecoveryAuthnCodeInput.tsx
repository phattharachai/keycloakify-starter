import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { logoSrc, illustrationSrc } from "../assets";

export default function LoginRecoveryAuthnCodeInput(
    props: PageProps<Extract<KcContext, { pageId: "login-recovery-authn-code-input.ftl" }>, I18n>
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, messagesPerField, recoveryAuthnCodesInputBean } = kcContext;
    const { msg, msgStr } = i18n;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const hasError = messagesPerField.existsError("recoveryCodeInput");


    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("auth-recovery-code-header")}
            displayMessage={!hasError}
        >
            <form
                id="kc-recovery-code-login-form"
                className="flex flex-col gap-4"
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
                        alt="Recovery code"
                        className="h-20"
                        src={illustrationSrc(33)}
                    />
                </div>

                {/* Title */}
                <div className="text-center">
                    <h3 className="text-lg font-medium text-mono mb-1">
                        {msg("auth-recovery-code-header")}
                    </h3>
                    <p className="text-sm text-secondary-foreground">
                        {msg("auth-recovery-code-prompt", `${recoveryAuthnCodesInputBean.codeNumber}`)}
                    </p>
                </div>

                {/* Input */}
                <div className="flex flex-col gap-1.5">
                    <input
                        id="recoveryCodeInput"
                        name="recoveryCodeInput"
                        type="text"
                        autoFocus
                        autoComplete="off"
                        autoCapitalize="none"
                        spellCheck={false}
                        placeholder="xxxxx-xxxxx-xxxxx"
                        className="kt-input text-center font-mono tracking-wider"
                        style={{ fontFamily: "var(--font-mono)" }}
                        aria-label={msgStr("auth-recovery-code-prompt", `${recoveryAuthnCodesInputBean.codeNumber}`)}
                        aria-invalid={hasError}
                        aria-describedby={hasError ? "input-error-recovery" : undefined}
                    />
                    {hasError && (
                        <span
                            id="input-error-recovery"
                            className="auth-error flex items-start justify-center gap-1.5 text-xs text-destructive mt-1"
                            role="alert"
                            aria-live="polite"
                        >
                            <i className="ki-filled ki-information-2 text-sm shrink-0 mt-px" />
                            <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.get("recoveryCodeInput")) }} />
                        </span>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    name="login"
                    id="kc-login"
                    className="kt-btn kt-btn-primary flex justify-center grow transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                >
                    {isSubmitting && <i className="ki-filled ki-loading animate-spin me-2" />}
                    {msgStr("doLogIn")}
                </button>
            </form>
        </Template>
    );
}
