import { useScript } from "keycloakify/login/pages/WebauthnRegister.useScript";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function WebauthnRegister(props: PageProps<Extract<KcContext, { pageId: "webauthn-register.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, isSetRetry, isAppInitiatedAction } = kcContext;
    const { msg, msgStr } = i18n;

    const authButtonId = "authenticateWebAuthnButton";

    useScript({ authButtonId, kcContext, i18n });

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("webauthn-registration-title")}
        >
            <div className="flex flex-col gap-5">
                {/* Icon + title */}
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex items-center justify-center size-16 rounded-full bg-primary/10">
                        <i className="ki-filled ki-shield-tick text-primary text-3xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-mono leading-none mb-1">
                            {msg("webauthn-registration-title")}
                        </h3>
                        <p className="text-sm text-secondary-foreground">
                            {msg("webauthn-passwordless-help-text")}
                        </p>
                    </div>
                </div>

                {/* Hidden registration form fields */}
                <form id="register" action={url.loginAction} method="post">
                    <input type="hidden" id="clientDataJSON"        name="clientDataJSON" />
                    <input type="hidden" id="attestationObject"     name="attestationObject" />
                    <input type="hidden" id="publicKeyCredentialId" name="publicKeyCredentialId" />
                    <input type="hidden" id="authenticatorLabel"    name="authenticatorLabel" />
                    <input type="hidden" id="transports"            name="transports" />
                    <input type="hidden" id="error"                 name="error" />

                    {/* Logout other sessions */}
                    <label className="kt-label flex items-center gap-2">
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
                </form>

                {/* Register button — id is required by useScript */}
                <input
                    id={authButtonId}
                    type="submit"
                    value={msgStr("doRegisterSecurityKey")}
                    className="kt-btn kt-btn-primary w-full justify-center cursor-pointer"
                />

                {/* Cancel (only for app-initiated action when not retrying) */}
                {!isSetRetry && isAppInitiatedAction && (
                    <form
                        id="kc-webauthn-settings-form"
                        action={url.loginAction}
                        method="post"
                    >
                        <button
                            type="submit"
                            id="cancelWebAuthnAIA"
                            name="cancel-aia"
                            value="true"
                            className="kt-btn kt-btn-outline w-full justify-center"
                        >
                            {msg("doCancel")}
                        </button>
                    </form>
                )}
            </div>
        </Template>
    );
}
