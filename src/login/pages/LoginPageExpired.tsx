import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function LoginPageExpired(props: PageProps<Extract<KcContext, { pageId: "login-page-expired.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url } = kcContext;
    const { msg } = i18n;

    const logoSrc = `${import.meta.env.BASE_URL}metronic/media/app/default-logo.svg`;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("pageExpiredTitle")}
        >
            <div className="flex flex-col gap-5">
                {/* Logo */}
                <div className="flex justify-center">
                    <img src={logoSrc} alt="Logo" className="h-8" />
                </div>

                {/* Icon + title */}
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex items-center justify-center size-16 rounded-full bg-warning/10">
                        <i className="ki-filled ki-time text-warning text-3xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-mono leading-none mb-1">
                            {msg("pageExpiredTitle")}
                        </h3>
                        <p className="text-sm text-secondary-foreground">
                            {msg("pageExpiredMsg1")}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2.5">
                    <a
                        id="loginRestartLink"
                        href={url.loginRestartFlowUrl}
                        className="kt-btn kt-btn-primary flex justify-center grow"
                    >
                        <span>{msg("doClickHere")}</span>
                    </a>
                    <p className="text-center text-xs text-secondary-foreground">
                        {msg("pageExpiredMsg2")}
                    </p>
                    <a
                        id="loginContinueLink"
                        href={url.loginAction}
                        className="kt-btn kt-btn-outline flex justify-center"
                    >
                        <span>{msg("doClickHere")}</span>
                    </a>
                </div>
            </div>
        </Template>
    );
}
