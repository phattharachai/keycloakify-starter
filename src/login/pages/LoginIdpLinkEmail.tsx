import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { logoSrc, illustrationSrc } from "../assets";

export default function LoginIdpLinkEmail(props: PageProps<Extract<KcContext, { pageId: "login-idp-link-email.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, realm, brokerContext, idpAlias } = kcContext;
    const { msg } = i18n;


    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("emailLinkIdpTitle", idpAlias)}
        >
            <div className="flex flex-col gap-5">
                {/* Logo */}
                <div className="flex justify-center">
                    <img src={logoSrc} alt="Logo" className="h-8" />
                </div>

                {/* Illustration */}
                <div className="flex justify-center py-2">
                    <img
                        alt="Check your email"
                        className="max-h-[110px]"
                        src={illustrationSrc(30)}
                    />
                </div>

                {/* Title */}
                <div className="text-center">
                    <h3 className="text-lg font-medium text-mono mb-2">
                        {msg("emailLinkIdpTitle", idpAlias)}
                    </h3>
                    <p className="text-sm text-secondary-foreground" id="instruction1">
                        {msg("emailLinkIdp1", idpAlias, brokerContext.username, realm.displayName)}
                    </p>
                </div>

                {/* Instructions */}
                <div className="rounded-lg border border-border bg-muted/40 p-4 flex flex-col gap-3">
                    <div className="flex items-start gap-3" id="instruction2">
                        <span className="flex items-center justify-center size-5 rounded-full bg-primary/10 shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-primary">1</span>
                        </span>
                        <p className="text-sm text-secondary-foreground">
                            {msg("emailLinkIdp2")}{" "}
                            <a href={url.loginAction} className="kt-link font-medium">
                                {msg("doClickHere")}
                            </a>{" "}
                            {msg("emailLinkIdp3")}
                        </p>
                    </div>
                    <div className="border-t border-border" />
                    <div className="flex items-start gap-3" id="instruction3">
                        <span className="flex items-center justify-center size-5 rounded-full bg-muted shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-muted-foreground">2</span>
                        </span>
                        <p className="text-sm text-secondary-foreground">
                            {msg("emailLinkIdp4")}{" "}
                            <a href={url.loginAction} className="kt-link font-medium">
                                {msg("doClickHere")}
                            </a>{" "}
                            {msg("emailLinkIdp5")}
                        </p>
                    </div>
                </div>
            </div>
        </Template>
    );
}
