import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function LoginOauthGrant(props: PageProps<Extract<KcContext, { pageId: "login-oauth-grant.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, classes, Template } = props;

    const { url, oauth, client } = kcContext;
    const { msg, msgStr, advancedMsg, advancedMsgStr } = i18n;

    const [isAccepting, setIsAccepting]   = useState(false);
    const [isDeclining, setIsDeclining]   = useState(false);

    const appName      = client.name ? advancedMsgStr(client.name) : client.clientId;
    const hasLegalLinks = client.attributes.policyUri || client.attributes.tosUri;

    const logoSrc = `${import.meta.env.BASE_URL}metronic/media/app/default-logo.svg`;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("oauthGrantTitle", appName)}
        >
            <div className="flex flex-col gap-5">
                {/* Logo */}
                <div className="flex justify-center">
                    <img src={logoSrc} alt="Logo" className="h-8" />
                </div>

                {/* App identity */}
                <div className="flex flex-col items-center gap-3 text-center">
                    {client.attributes.logoUri ? (
                        <div className="flex items-center justify-center size-16 rounded-xl border border-border bg-background overflow-hidden">
                            <img src={client.attributes.logoUri} alt={appName} className="size-12 object-contain" />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center size-16 rounded-xl bg-primary/10">
                            <i className="ki-filled ki-technology-4 text-primary text-3xl" />
                        </div>
                    )}
                    <div>
                        <h3 className="text-lg font-medium text-mono leading-none mb-1">
                            {msg("oauthGrantTitle", appName)}
                        </h3>
                        <p className="text-sm text-secondary-foreground">
                            {msg("oauthGrantRequest")}
                        </p>
                    </div>
                </div>

                {/* Requested scopes */}
                {oauth.clientScopesRequested.length > 0 && (
                    <div className="rounded-lg border border-border overflow-hidden">
                        {oauth.clientScopesRequested.map((scope, index) => (
                            <div
                                key={scope.consentScreenText}
                                className={`flex items-center gap-3 px-4 py-3 ${
                                    index < oauth.clientScopesRequested.length - 1 ? "border-b border-border" : ""
                                }`}
                            >
                                <div className="flex items-center justify-center size-7 rounded-full bg-success/10 shrink-0">
                                    <i className="ki-filled ki-check-circle text-success text-sm" />
                                </div>
                                <span className="text-sm text-mono">
                                    {advancedMsg(scope.consentScreenText)}
                                    {scope.dynamicScopeParameter && (
                                        <>
                                            {": "}
                                            <strong className="font-semibold">{scope.dynamicScopeParameter}</strong>
                                        </>
                                    )}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Legal links */}
                {hasLegalLinks && (
                    <p className="text-xs text-secondary-foreground text-center leading-relaxed">
                        {msg("oauthGrantInformation", appName)}
                        {client.attributes.tosUri && (
                            <>
                                {" "}{msg("oauthGrantReview")}{" "}
                                <a
                                    href={client.attributes.tosUri}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="kt-link font-medium"
                                >
                                    {msg("oauthGrantTos")}
                                </a>
                            </>
                        )}
                        {client.attributes.policyUri && (
                            <>
                                {" "}{msg("oauthGrantReview")}{" "}
                                <a
                                    href={client.attributes.policyUri}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="kt-link font-medium"
                                >
                                    {msg("oauthGrantPolicy")}
                                </a>
                            </>
                        )}
                    </p>
                )}

                {/* Actions */}
                <form
                    id="kc-oauth"
                    action={url.oauthAction}
                    method="POST"
                    className="flex flex-col gap-2.5"
                >
                    <input type="hidden" name="code" value={oauth.code} />
                    <button
                        name="accept"
                        id="kc-login"
                        type="submit"
                        className="kt-btn kt-btn-primary flex justify-center grow transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={isAccepting || isDeclining}
                        aria-busy={isAccepting}
                        onClick={() => setIsAccepting(true)}
                    >
                        {isAccepting && <i className="ki-filled ki-loading animate-spin me-2" />}
                        {!isAccepting && <i className="ki-filled ki-check me-2" />}
                        {msgStr("doYes")}
                    </button>
                    <button
                        name="cancel"
                        id="kc-cancel"
                        type="submit"
                        className="kt-btn kt-btn-outline flex justify-center transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={isAccepting || isDeclining}
                        aria-busy={isDeclining}
                        onClick={() => setIsDeclining(true)}
                    >
                        {isDeclining && <i className="ki-filled ki-loading animate-spin me-2" />}
                        {msgStr("doNo")}
                    </button>
                </form>
            </div>
        </Template>
    );
}
