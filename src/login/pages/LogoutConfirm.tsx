import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { logoSrc } from "../assets";

export default function LogoutConfirm(props: PageProps<Extract<KcContext, { pageId: "logout-confirm.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, client, logoutConfirm } = kcContext;
    const { msg, msgStr } = i18n;
    const [isSubmitting, setIsSubmitting] = useState(false);

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} headerNode={msg("logoutConfirmTitle")}>
            <div className="flex flex-col gap-4">
                <div className="flex justify-center">
                    <img src={logoSrc} alt="Logo" className="h-8" />
                </div>

                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex items-center justify-center size-16 rounded-full bg-warning/10">
                        <i className="ki-filled ki-exit-right text-warning text-3xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-mono leading-none mb-1">{msg("logoutConfirmTitle")}</h3>
                        <p className="text-sm text-secondary-foreground">{msg("logoutConfirmHeader")}</p>
                    </div>
                </div>

                <form action={url.logoutConfirmAction} method="POST" onSubmit={() => { setIsSubmitting(true); return true; }}>
                    <input type="hidden" name="session_code" value={logoutConfirm.code} />
                    <button
                        className="kt-btn kt-btn-primary flex justify-center w-full transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                        name="confirmLogout"
                        id="kc-logout"
                        type="submit"
                        disabled={isSubmitting}
                        aria-busy={isSubmitting}
                    >
                        {isSubmitting && <i className="ki-filled ki-loading animate-spin me-2" />}
                        {msgStr("doLogout")}
                    </button>
                </form>

                {!logoutConfirm.skipLink && client.baseUrl && (
                    <a href={client.baseUrl} className="kt-link text-sm text-center">
                        {msg("backToApplication")}
                    </a>
                )}
            </div>
        </Template>
    );
}