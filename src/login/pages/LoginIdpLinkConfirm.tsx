import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { logoSrc } from "../assets";

export default function LoginIdpLinkConfirm(props: PageProps<Extract<KcContext, { pageId: "login-idp-link-confirm.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, idpAlias } = kcContext;
    const { msg } = i18n;
    const [pendingAction, setPendingAction] = useState<"linkAccount" | "updateProfile" | null>(null);


    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("confirmLinkIdpTitle")}
        >
            <div className="flex flex-col gap-4">
                {/* Logo */}
                <div className="flex justify-center">
                    <img src={logoSrc} alt="Logo" className="auth-logo" />
                </div>

                {/* Icon + title */}
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex items-center justify-center size-16 rounded-full bg-primary/10">
                        <i className="ki-filled ki-user-tick text-primary text-3xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-mono leading-none mb-1">
                            {msg("confirmLinkIdpTitle")}
                        </h3>
                        <p className="text-sm text-secondary-foreground">
                            {msg("confirmLinkIdpContinue", idpAlias)}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <form id="kc-register-form" action={url.loginAction} method="post" className="flex flex-col gap-2.5">
                    <button
                        type="submit"
                        name="submitAction"
                        id="linkAccount"
                        value="linkAccount"
                        className="kt-btn kt-btn-primary flex justify-center grow transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={pendingAction !== null}
                        aria-busy={pendingAction === "linkAccount"}
                        onClick={() => setPendingAction("linkAccount")}
                    >
                        {pendingAction === "linkAccount" ? (
                            <i className="ki-filled ki-loading animate-spin me-2" />
                        ) : (
                            <i className="ki-filled ki-user-tick me-2" />
                        )}
                        {msg("confirmLinkIdpContinue", idpAlias)}
                    </button>
                    <button
                        type="submit"
                        name="submitAction"
                        id="updateProfile"
                        value="updateProfile"
                        className="kt-btn kt-btn-outline flex justify-center transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={pendingAction !== null}
                        aria-busy={pendingAction === "updateProfile"}
                        onClick={() => setPendingAction("updateProfile")}
                    >
                        {pendingAction === "updateProfile" ? (
                            <i className="ki-filled ki-loading animate-spin me-2" />
                        ) : (
                            <i className="ki-filled ki-user-edit me-2" />
                        )}
                        {msg("confirmLinkIdpReviewProfile")}
                    </button>
                </form>
            </div>
        </Template>
    );
}
