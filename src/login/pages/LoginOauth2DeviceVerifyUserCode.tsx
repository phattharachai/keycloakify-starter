import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { logoSrc } from "../assets";

export default function LoginOauth2DeviceVerifyUserCode(
    props: PageProps<Extract<KcContext, { pageId: "login-oauth2-device-verify-user-code.ftl" }>, I18n>
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, messagesPerField } = kcContext;
    const { msg, msgStr } = i18n;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const hasDeviceCodeError = messagesPerField.existsError("device_user_code");


    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!hasDeviceCodeError}
            headerNode={msg("oauth2DeviceVerificationTitle")}
        >
            <form
                id="kc-user-verify-device-user-code-form"
                className="flex flex-col gap-4"
                action={url.oauth2DeviceVerificationAction}
                method="post"
                onSubmit={() => { setIsSubmitting(true); return true; }}
            >
                {/* Logo */}
                <div className="flex justify-center">
                    <img src={logoSrc} alt="Logo" className="auth-logo" />
                </div>

                {/* Icon + title */}
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex items-center justify-center size-16 rounded-full bg-primary/10">
                        <i className="ki-filled ki-devices text-primary text-3xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-mono leading-none mb-1">
                            {msg("oauth2DeviceVerificationTitle")}
                        </h3>
                        <p className="text-sm text-secondary-foreground">
                            {msg("verifyOAuth2DeviceUserCode")}
                        </p>
                    </div>
                </div>

                {/* Device code input */}
                <div className="flex flex-col gap-1">
                    <input
                        id="device-user-code"
                        name="device_user_code"
                        type="text"
                        autoFocus
                        autoComplete="off"
                        placeholder="XXXX-XXXX"
                        className="kt-input text-center tracking-[0.3em] text-lg font-medium uppercase"
                        aria-label={msgStr("verifyOAuth2DeviceUserCode")}
                        aria-invalid={hasDeviceCodeError}
                        aria-describedby={hasDeviceCodeError ? "input-error-device-user-code" : undefined}
                    />
                    {hasDeviceCodeError && (
                        <span
                            id="input-error-device-user-code"
                            className="auth-error flex items-start justify-center gap-1.5 text-xs text-destructive mt-1"
                            role="alert"
                            aria-live="polite"
                        >
                            <i className="ki-filled ki-information-2 text-sm shrink-0 mt-px" />
                            <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.get("device_user_code")) }} />
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
                    {msgStr("doSubmit")}
                </button>
            </form>
        </Template>
    );
}
