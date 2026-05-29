import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { logoSrc } from "../assets";

export default function LoginIdpLinkConfirmOverride(props: PageProps<Extract<KcContext, { pageId: "login-idp-link-confirm-override.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, idpDisplayName } = kcContext;
    const { msg } = i18n;


    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("confirmOverrideIdpTitle")}
        >
            <div className="flex flex-col gap-5">
                {/* Logo */}
                <div className="flex justify-center">
                    <img src={logoSrc} alt="Logo" className="auth-logo" />
                </div>

                {/* Icon + title */}
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex items-center justify-center size-16 rounded-full bg-warning/10">
                        <i className="ki-filled ki-information-2 text-warning text-3xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-mono leading-none mb-1">
                            {msg("confirmOverrideIdpTitle")}
                        </h3>
                        <p className="text-sm text-secondary-foreground">
                            {msg("confirmOverrideIdpContinue", idpDisplayName)}
                        </p>
                    </div>
                </div>

                {/* Restart notice */}
                <div className="flex items-center justify-center gap-1 flex-wrap text-center">
                    <span className="text-xs text-secondary-foreground">
                        {msg("pageExpiredMsg1")}
                    </span>
                    <a id="loginRestartLink" href={url.loginRestartFlowUrl} className="text-xs kt-link font-medium">
                        {msg("doClickHere")}
                    </a>
                </div>

                {/* Confirm action */}
                <form id="kc-register-form" action={url.loginAction} method="post">
                    <button
                        type="submit"
                        name="submitAction"
                        id="confirmOverride"
                        value="confirmOverride"
                        className="kt-btn kt-btn-primary w-full flex justify-center"
                    >
                        {msg("confirmOverrideIdpContinue", idpDisplayName)}
                    </button>
                </form>
            </div>
        </Template>
    );
}
