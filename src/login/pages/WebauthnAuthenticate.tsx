import { Fragment } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { useScript } from "keycloakify/login/pages/WebauthnAuthenticate.useScript";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function WebauthnAuthenticate(props: PageProps<Extract<KcContext, { pageId: "webauthn-authenticate.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, realm, registrationDisabled, authenticators, shouldDisplayAuthenticators } = kcContext;
    const { msg, msgStr, advancedMsg } = i18n;

    const authButtonId = "authenticateWebAuthnButton";

    useScript({ authButtonId, kcContext, i18n });

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("webauthn-login-title")}
        >
            <div className="flex flex-col gap-5">
                {/* Icon + title */}
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex items-center justify-center size-16 rounded-full bg-primary/10">
                        <i className="ki-filled ki-fingerprint-scanning text-primary text-3xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-mono leading-none mb-1">
                            {msg("webauthn-login-title")}
                        </h3>
                        <p className="text-sm text-secondary-foreground">
                            {msg("webauthn-help-text")}
                        </p>
                    </div>
                </div>

                {/* Hidden WebAuthn form */}
                <form id="webauth" action={url.loginAction} method="post">
                    <input type="hidden" id="clientDataJSON"    name="clientDataJSON" />
                    <input type="hidden" id="authenticatorData" name="authenticatorData" />
                    <input type="hidden" id="signature"         name="signature" />
                    <input type="hidden" id="credentialId"      name="credentialId" />
                    <input type="hidden" id="userHandle"        name="userHandle" />
                    <input type="hidden" id="error"             name="error" />
                </form>

                {/* Authenticator selector (hidden) */}
                {authenticators && (
                    <form id="authn_select">
                        {authenticators.authenticators.map((authenticator, i) => (
                            <input key={i} type="hidden" name="authn_use_chk" value={authenticator.credentialId} />
                        ))}
                    </form>
                )}

                {/* Registered devices list */}
                {authenticators && shouldDisplayAuthenticators && authenticators.authenticators.length > 0 && (
                    <div className="flex flex-col gap-2">
                        {authenticators.authenticators.length > 1 && (
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                {msg("webauthn-available-authenticators")}
                            </p>
                        )}
                        <div className="flex flex-col gap-2">
                            {authenticators.authenticators.map((authenticator, i) => (
                                <div
                                    key={i}
                                    id={`kc-webauthn-authenticator-item-${i}`}
                                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/40"
                                >
                                    <div className="flex items-center justify-center size-9 rounded-full bg-background border border-border shrink-0">
                                        <i className={clsx(
                                            "ki-filled text-muted-foreground text-base",
                                            authenticator.transports.displayNameProperties?.length
                                                ? "ki-shield-tick"
                                                : "ki-security-user"
                                        )} />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span
                                            id={`kc-webauthn-authenticator-label-${i}`}
                                            className="text-sm font-medium text-mono truncate"
                                        >
                                            {advancedMsg(authenticator.label)}
                                        </span>
                                        {authenticator.transports.displayNameProperties?.length && (
                                            <span
                                                id={`kc-webauthn-authenticator-transport-${i}`}
                                                className="text-xs text-muted-foreground"
                                            >
                                                {authenticator.transports.displayNameProperties
                                                    .map((prop, j, arr) => (
                                                        <Fragment key={prop}>
                                                            {advancedMsg(prop)}
                                                            {j !== arr.length - 1 && ", "}
                                                        </Fragment>
                                                    ))}
                                            </span>
                                        )}
                                        <span
                                            id={`kc-webauthn-authenticator-created-${i}`}
                                            className="text-xs text-muted-foreground"
                                        >
                                            <span className="me-1">{msg("webauthn-createdAt-label")}</span>
                                            {authenticator.createdAt}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main action button — id is required by useScript */}
                <input
                    id={authButtonId}
                    type="button"
                    autoFocus
                    value={msgStr("webauthn-doAuthenticate")}
                    className="kt-btn kt-btn-primary w-full justify-center cursor-pointer"
                />

                {/* Register link */}
                {realm.registrationAllowed && !registrationDisabled && (
                    <div className="text-center">
                        <span className="text-sm text-secondary-foreground me-1">{msg("noAccount")}</span>
                        <a href={url.registrationUrl} className="text-sm kt-link">
                            {msg("doRegister")}
                        </a>
                    </div>
                )}
            </div>
        </Template>
    );
}
