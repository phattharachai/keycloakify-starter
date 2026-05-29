import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { logoSrc } from "../assets";

export default function LinkIdpAction(props: PageProps<Extract<KcContext, { pageId: "link-idp-action.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { idpDisplayName, url } = kcContext;
    const { msg, msgStr } = i18n;
    const [isContinuing, setIsContinuing] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);


    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("linkIdpActionTitle", idpDisplayName)}
            displayMessage={false}
        >
            <div className="flex flex-col gap-4">
                {/* Logo */}
                <div className="flex justify-center">
                    <img src={logoSrc} alt="Logo" className="auth-logo" />
                </div>

                {/* Icon + title */}
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex items-center justify-center size-16 rounded-full bg-primary/10">
                        <i className="ki-filled ki-profile-circle text-primary text-3xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-mono leading-none mb-1">
                            {msg("linkIdpActionTitle", idpDisplayName)}
                        </h3>
                        <p className="text-sm text-secondary-foreground">
                            {msg("linkIdpActionMessage", idpDisplayName)}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <form action={url.loginAction} method="post" className="flex flex-col gap-2.5">
                    <button
                        type="submit"
                        name="continue"
                        id="kc-continue"
                        className="kt-btn kt-btn-primary flex justify-center grow transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={isContinuing || isCancelling}
                        aria-busy={isContinuing}
                        onClick={() => setIsContinuing(true)}
                    >
                        {isContinuing && <i className="ki-filled ki-loading animate-spin me-2" />}
                        {msgStr("doContinue")}
                    </button>
                    <button
                        type="submit"
                        name="cancel-aia"
                        id="kc-cancel"
                        className="kt-btn kt-btn-outline flex justify-center transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={isContinuing || isCancelling}
                        aria-busy={isCancelling}
                        onClick={() => setIsCancelling(true)}
                    >
                        {isCancelling && <i className="ki-filled ki-loading animate-spin me-2" />}
                        {msgStr("doCancel")}
                    </button>
                </form>
            </div>
        </Template>
    );
}
