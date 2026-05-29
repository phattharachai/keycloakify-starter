import { useEffect, useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { logoSrc } from "../assets";

export default function FrontchannelLogout(
    props: PageProps<Extract<KcContext, { pageId: "frontchannel-logout.ftl" }>, I18n>
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { logout } = kcContext;
    const { msg, msgStr } = i18n;

    const [iframeLoadCount, setIframeLoadCount] = useState(0);

    useEffect(() => {
        if (!logout.logoutRedirectUri) {
            return;
        }

        if (iframeLoadCount !== logout.clients.length) {
            return;
        }

        window.location.replace(logout.logoutRedirectUri);
    }, [iframeLoadCount, logout]);


    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            documentTitle={msgStr("frontchannel-logout.title")}
            headerNode={msg("frontchannel-logout.title")}
        >
            <div className="flex flex-col gap-5">
                <div className="flex justify-center">
                    <img src={logoSrc} alt="Logo" className="auth-logo" />
                </div>

                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex items-center justify-center size-16 rounded-full bg-primary/10">
                        <i className="ki-filled ki-loading text-primary text-3xl animate-spin" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-mono leading-none mb-1.5">
                            {msg("frontchannel-logout.title")}
                        </h3>
                        <p className="text-sm text-secondary-foreground leading-relaxed">
                            {msg("frontchannel-logout.message")}
                        </p>
                    </div>
                </div>

                {logout.clients.length > 0 && (
                    <div className="rounded-lg border border-border overflow-hidden">
                        {logout.clients.map((client, index) => (
                            <div key={client.name} className={`px-4 py-3 ${index < logout.clients.length - 1 ? "border-b border-border" : ""}`}>
                                <div className="flex items-center gap-3 text-sm text-mono">
                                    <div className="flex items-center justify-center size-7 rounded-full bg-primary/10 shrink-0">
                                        <i className="ki-filled ki-check-circle text-primary text-sm" />
                                    </div>
                                    <span className="truncate">{client.name}</span>
                                </div>
                                <iframe
                                    src={client.frontChannelLogoutUrl}
                                    style={{ display: "none" }}
                                    onLoad={() => {
                                        setIframeLoadCount(count => count + 1);
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {logout.logoutRedirectUri !== undefined && (
                    <a id="continue" className="kt-btn kt-btn-primary flex justify-center" href={logout.logoutRedirectUri}>
                        {msg("doContinue")}
                    </a>
                )}
            </div>
        </Template>
    );
}