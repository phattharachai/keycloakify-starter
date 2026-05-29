import { useState } from "react";
import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { logoSrc } from "../assets";

export default function LoginX509Info(props: PageProps<Extract<KcContext, { pageId: "login-x509-info.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, x509 } = kcContext;
    const { msg, msgStr } = i18n;

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { subjectDN, username, isUserEnabled } = x509.formData;


    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("doLogIn")}
        >
            <form
                id="kc-x509-login-info"
                className="flex flex-col gap-4"
                action={url.loginAction}
                method="post"
                onSubmit={() => { setIsSubmitting(true); return true; }}
            >
                {/* Logo */}
                <div className="flex justify-center">
                    <img src={logoSrc} alt="Logo" className="auth-logo" />
                </div>

                {/* Icon + title */}
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className={clsx("flex items-center justify-center size-16 rounded-full", isUserEnabled ? "bg-success/10" : "bg-muted")}>
                        <i className={clsx("ki-filled ki-shield-tick text-3xl", isUserEnabled ? "text-success" : "text-muted-foreground")} />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-mono leading-none mb-1">
                            {msg("doLogIn")}
                        </h3>
                        <p className="text-sm text-secondary-foreground">
                            {msg("clientCertificate")}
                        </p>
                    </div>
                </div>

                {/* Certificate info card */}
                <div className="rounded-lg border border-border overflow-hidden">
                    {/* Subject DN */}
                    <div className="px-4 py-3 border-b border-border">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                            {msg("clientCertificate")}
                        </p>
                        {subjectDN ? (
                            <p
                                id="certificate_subjectDN"
                                className="font-mono text-xs text-mono break-all leading-relaxed"
                            >
                                {subjectDN}
                            </p>
                        ) : (
                            <p id="certificate_subjectDN" className="text-sm text-muted-foreground italic">
                                {msg("noCertificate")}
                            </p>
                        )}
                    </div>

                    {/* Username (only if user can login) */}
                    {isUserEnabled && username && (
                        <div className="px-4 py-3">
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                                {msg("doX509Login")}
                            </p>
                            <div className="flex items-center gap-2">
                                <i className="ki-filled ki-user text-muted-foreground text-sm" />
                                <span id="username" className="text-sm font-medium text-mono">
                                    {username}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* No certificate warning */}
                {!subjectDN && (
                    <div className="flex items-start gap-3 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3">
                        <i className="ki-filled ki-information-2 text-warning text-base shrink-0 mt-0.5" />
                        <p className="text-sm text-warning">{msg("noCertificate")}</p>
                    </div>
                )}

                {/* Actions */}
                <div className="auth-action-row">
                    <button
                        name="login"
                        id="kc-login"
                        type="submit"
                        className="kt-btn kt-btn-primary flex justify-center grow transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                        aria-busy={isSubmitting}
                    >
                        {isSubmitting && <i className="ki-filled ki-loading animate-spin me-2" />}
                        {msgStr("doContinue")}
                    </button>
                    {isUserEnabled && (
                        <button
                            name="cancel"
                            id="kc-cancel"
                            type="submit"
                            className="kt-btn kt-btn-outline flex justify-center grow transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {msgStr("doIgnore")}
                        </button>
                    )}
                </div>
            </form>
        </Template>
    );
}
