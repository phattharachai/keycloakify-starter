import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { logoSrc } from "../assets";

export default function DeleteAccountConfirm(
    props: PageProps<Extract<KcContext, { pageId: "delete-account-confirm.ftl" }>, I18n>
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, triggered_from_aia } = kcContext;
    const { msg, msgStr } = i18n;

    const [isConfirming, setIsConfirming] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);


    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={msg("deleteAccountConfirm")}
        >
            <div className="flex flex-col gap-5">
                <div className="flex justify-center">
                    <img src={logoSrc} alt="Logo" className="auth-logo" />
                </div>

                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex items-center justify-center size-16 rounded-full bg-warning/10">
                        <i className="ki-filled ki-shield-cross text-warning text-3xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-mono leading-none mb-1.5">
                            {msg("deleteAccountConfirm")}
                        </h3>
                        <p className="text-sm text-secondary-foreground leading-relaxed">
                            {msg("finalDeletionConfirmation")}
                        </p>
                    </div>
                </div>

                <div className="rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-foreground leading-relaxed">
                    <div className="mb-2 flex items-start gap-2 font-medium text-warning">
                        <i className="ki-filled ki-information-2 text-base shrink-0 mt-0.5" />
                        <span>{msg("irreversibleAction")}</span>
                    </div>
                    <p className="text-secondary-foreground mb-3">{msg("deletingImplies")}</p>
                    <ul className="list-disc space-y-1 ps-5 text-secondary-foreground marker:text-warning">
                        <li>{msg("loggingOutImmediately")}</li>
                        <li>{msg("errasingData")}</li>
                    </ul>
                </div>

                <form action={url.loginAction} method="post" className="flex flex-col gap-2.5">
                    <button
                        type="submit"
                        className="kt-btn kt-btn-primary flex justify-center transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={isConfirming || isCancelling}
                        aria-busy={isConfirming}
                        onClick={() => setIsConfirming(true)}
                    >
                        {isConfirming && <i className="ki-filled ki-loading animate-spin me-2" />}
                        {msgStr("doConfirmDelete")}
                    </button>

                    {triggered_from_aia && (
                        <button
                            type="submit"
                            name="cancel-aia"
                            value="true"
                            className="kt-btn kt-btn-outline flex justify-center transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                            disabled={isConfirming || isCancelling}
                            aria-busy={isCancelling}
                            onClick={() => setIsCancelling(true)}
                        >
                            {isCancelling && <i className="ki-filled ki-loading animate-spin me-2" />}
                            {msgStr("doCancel")}
                        </button>
                    )}
                </form>
            </div>
        </Template>
    );
}