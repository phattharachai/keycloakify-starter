import { useScript } from "keycloakify/login/pages/LoginRecoveryAuthnCodeConfig.useScript";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { logoSrc } from "../assets";

export default function LoginRecoveryAuthnCodeConfig(
    props: PageProps<Extract<KcContext, { pageId: "login-recovery-authn-code-config.ftl" }>, I18n>
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { recoveryAuthnCodesConfigBean, isAppInitiatedAction, url } = kcContext;
    const { msg, msgStr } = i18n;

    // Must match the id that useScript queries for copy/download/print
    const olRecoveryCodesListId = "kc-recovery-codes-list";

    useScript({ olRecoveryCodesListId, i18n });


    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("recovery-code-config-header")}
        >
            <div className="flex flex-col gap-5">
                {/* Logo */}
                <div className="flex justify-center">
                    <img src={logoSrc} alt="Logo" className="auth-logo" />
                </div>

                {/* Icon + title */}
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex items-center justify-center size-16 rounded-full bg-warning/10">
                        <i className="ki-filled ki-shield-tick text-warning text-3xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-mono leading-none mb-1">
                            {msg("recovery-code-config-header")}
                        </h3>
                    </div>
                </div>

                {/* Warning banner */}
                <div className="flex items-start gap-3 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3">
                    <i className="ki-filled ki-information-2 text-warning text-base shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-warning">{msg("recovery-code-config-warning-title")}</p>
                        <p className="text-xs text-warning/80 mt-0.5">{msg("recovery-code-config-warning-message")}</p>
                    </div>
                </div>

                {/* Recovery code grid */}
                <ol
                    id={olRecoveryCodesListId}
                    className="grid grid-cols-2 gap-1.5 rounded-lg border border-border bg-muted/40 p-3"
                >
                    {recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesList.map((code, index) => (
                        <li key={index} className="flex items-center gap-1.5 font-mono text-xs text-mono">
                            <span className="text-muted-foreground w-4 text-right shrink-0">{index + 1}.</span>
                            <span className="font-medium tracking-wider">
                                {code.slice(0, 4)}-{code.slice(4, 8)}-{code.slice(8)}
                            </span>
                        </li>
                    ))}
                </ol>

                {/* Action buttons — IDs are required by useScript */}
                <div className="grid grid-cols-3 gap-2">
                    <button
                        id="printRecoveryCodes"
                        type="button"
                        className="kt-btn kt-btn-outline kt-btn-sm flex justify-center gap-1.5"
                    >
                        <i className="ki-filled ki-printer text-sm" />
                        <span className="text-xs">{msg("recovery-codes-print")}</span>
                    </button>
                    <button
                        id="downloadRecoveryCodes"
                        type="button"
                        className="kt-btn kt-btn-outline kt-btn-sm flex justify-center gap-1.5"
                    >
                        <i className="ki-filled ki-file-down text-sm" />
                        <span className="text-xs">{msg("recovery-codes-download")}</span>
                    </button>
                    <button
                        id="copyRecoveryCodes"
                        type="button"
                        className="kt-btn kt-btn-outline kt-btn-sm flex justify-center gap-1.5"
                    >
                        <i className="ki-filled ki-copy text-sm" />
                        <span className="text-xs">{msg("recovery-codes-copy")}</span>
                    </button>
                </div>

                <form
                    action={url.loginAction}
                    id="kc-recovery-codes-settings-form"
                    method="post"
                    className="flex flex-col gap-4"
                >
                    <input type="hidden" name="generatedRecoveryAuthnCodes" value={recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesAsString} />
                    <input type="hidden" name="generatedAt" value={recoveryAuthnCodesConfigBean.generatedAt} />
                    <input type="hidden" id="userLabel" name="userLabel" value={msgStr("recovery-codes-label-default")} />

                    {/* Confirmation checkbox — enables submit via onChange in useScript */}
                    <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                            type="checkbox"
                            id="kcRecoveryCodesConfirmationCheck"
                            name="kcRecoveryCodesConfirmationCheck"
                            className="kt-checkbox kt-checkbox-sm mt-0.5 shrink-0"
                            onChange={event => {
                                const btn = document.getElementById("saveRecoveryAuthnCodesBtn") as HTMLButtonElement | null;
                                if (btn) btn.disabled = !event.target.checked;
                            }}
                        />
                        <span className="text-sm text-secondary-foreground">
                            {msg("recovery-codes-confirmation-message")}
                        </span>
                    </label>

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

                    {/* Submit — starts disabled, checkbox enables it */}
                    <div className="auth-action-row">
                        <button
                            type="submit"
                            id="saveRecoveryAuthnCodesBtn"
                            disabled
                            className="kt-btn kt-btn-primary flex justify-center grow transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {msgStr("recovery-codes-action-complete")}
                        </button>
                        {isAppInitiatedAction && (
                            <button
                                type="submit"
                                id="cancelRecoveryAuthnCodesBtn"
                                name="cancel-aia"
                                value="true"
                                className="kt-btn kt-btn-outline flex justify-center grow transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {msg("recovery-codes-action-cancel")}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </Template>
    );
}
