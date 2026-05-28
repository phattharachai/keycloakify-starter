import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { logoSrc } from "../assets";

export default function WebauthnError(props: PageProps<Extract<KcContext, { pageId: "webauthn-error.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, isAppInitiatedAction } = kcContext;
    const { msg, msgStr } = i18n;
    const [isRetrying, setIsRetrying] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage
            headerNode={msg("webauthn-error-title")}
        >
            <div className="flex flex-col gap-4">
                <div className="flex justify-center">
                    <img src={logoSrc} alt="Logo" className="h-8" />
                </div>

                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex items-center justify-center size-16 rounded-full bg-destructive/10">
                        <i className="ki-filled ki-shield-cross text-destructive text-3xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-mono leading-none mb-1">{msg("webauthn-error-title")}</h3>
                    </div>
                </div>

                <form id="kc-error-credential-form" action={url.loginAction} method="post" className="hidden">
                    <input type="hidden" id="executionValue" name="authenticationExecution" />
                    <input type="hidden" id="isSetRetry" name="isSetRetry" />
                </form>

                <div className="flex flex-col gap-2.5">
                    <button
                        type="button"
                        className="kt-btn kt-btn-primary flex justify-center transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                        name="try-again"
                        id="kc-try-again"
                        disabled={isRetrying || isCancelling}
                        aria-busy={isRetrying}
                        onClick={() => {
                            setIsRetrying(true);
                            const retryInput = document.getElementById("isSetRetry") as HTMLInputElement | null;
                            const executionInput = document.getElementById("executionValue") as HTMLInputElement | null;
                            const form = document.getElementById("kc-error-credential-form") as HTMLFormElement | null;

                            if (!retryInput || !executionInput || !form) {
                                setIsRetrying(false);
                                return;
                            }

                            retryInput.value = "retry";
                            executionInput.value = "${execution}";
                            form.requestSubmit();
                        }}
                    >
                        {isRetrying && <i className="ki-filled ki-loading animate-spin me-2" />}
                        {msgStr("doTryAgain")}
                    </button>

                    {isAppInitiatedAction && (
                        <form action={url.loginAction} id="kc-webauthn-settings-form" method="post">
                            <button
                                type="submit"
                                className="kt-btn kt-btn-outline flex justify-center transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                                id="cancelWebAuthnAIA"
                                name="cancel-aia"
                                value="true"
                                disabled={isRetrying || isCancelling}
                                aria-busy={isCancelling}
                                onClick={() => setIsCancelling(true)}
                            >
                                {isCancelling && <i className="ki-filled ki-loading animate-spin me-2" />}
                                {msgStr("doCancel")}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </Template>
    );
}