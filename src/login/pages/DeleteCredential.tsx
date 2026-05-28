import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function DeleteCredential(
    props: PageProps<Extract<KcContext, { pageId: "delete-credential.ftl" }>, I18n>
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, credentialLabel } = kcContext;
    const { msg, msgStr } = i18n;

    const [isAccepting, setIsAccepting] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);

    const logoSrc = `${import.meta.env.BASE_URL}metronic/media/app/default-logo.svg`;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={msg("deleteCredentialTitle", credentialLabel)}
        >
            <div className="flex flex-col gap-5">
                <div className="flex justify-center">
                    <img src={logoSrc} alt="Logo" className="h-8" />
                </div>

                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex items-center justify-center size-16 rounded-full bg-destructive/10">
                        <i className="ki-filled ki-key text-destructive text-3xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-mono leading-none mb-1.5">
                            {msg("deleteCredentialTitle", credentialLabel)}
                        </h3>
                        <p id="kc-delete-text" className="text-sm text-secondary-foreground leading-relaxed">
                            {msg("deleteCredentialMessage", credentialLabel)}
                        </p>
                    </div>
                </div>

                <form action={url.loginAction} method="POST" className="flex flex-col gap-2.5">
                    <button
                        name="accept"
                        id="kc-accept"
                        type="submit"
                        className="kt-btn kt-btn-primary flex justify-center transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={isAccepting || isCancelling}
                        aria-busy={isAccepting}
                        onClick={() => setIsAccepting(true)}
                    >
                        {isAccepting && <i className="ki-filled ki-loading animate-spin me-2" />}
                        {msgStr("doConfirmDelete")}
                    </button>
                    <button
                        name="cancel-aia"
                        value="true"
                        id="kc-decline"
                        type="submit"
                        className="kt-btn kt-btn-outline flex justify-center transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={isAccepting || isCancelling}
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