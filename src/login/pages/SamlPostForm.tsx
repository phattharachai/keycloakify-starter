import { useEffect, useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function SamlPostForm(props: PageProps<Extract<KcContext, { pageId: "saml-post-form.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { msgStr, msg } = i18n;
    const { samlPost } = kcContext;
    const [htmlFormElement, setHtmlFormElement] = useState<HTMLFormElement | null>(null);

    useEffect(() => {
        if (htmlFormElement === null) {
            return;
        }

        if (samlPost.url === "#") {
            alert("In a real Keycloak the user would be redirected immediately");
            return;
        }

        htmlFormElement.requestSubmit();
    }, [htmlFormElement, samlPost.url]);

    const logoSrc = `${import.meta.env.BASE_URL}metronic/media/app/default-logo.svg`;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} headerNode={msg("saml.post-form.title")} displayMessage={false}>
            <div className="flex flex-col gap-4">
                <div className="flex justify-center">
                    <img src={logoSrc} alt="Logo" className="h-8" />
                </div>

                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex items-center justify-center size-16 rounded-full bg-primary/10">
                        <i className="ki-filled ki-technology text-primary text-3xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-mono leading-none mb-1">
                            {msg("saml.post-form.title")}
                        </h3>
                        <p className="text-sm text-secondary-foreground leading-relaxed">
                            {msg("saml.post-form.message")}
                        </p>
                    </div>
                </div>

                <form name="saml-post-binding" method="post" action={samlPost.url} ref={setHtmlFormElement}>
                    {samlPost.SAMLRequest && <input type="hidden" name="SAMLRequest" value={samlPost.SAMLRequest} />}
                    {samlPost.SAMLResponse && <input type="hidden" name="SAMLResponse" value={samlPost.SAMLResponse} />}
                    {samlPost.relayState && <input type="hidden" name="RelayState" value={samlPost.relayState} />}
                    <noscript>
                        <div className="flex flex-col gap-3">
                            <div className="rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-foreground text-center leading-relaxed">
                                {msg("saml.post-form.js-disabled")}
                            </div>
                            <input className="kt-btn kt-btn-primary flex justify-center w-full cursor-pointer" type="submit" value={msgStr("doContinue")} />
                        </div>
                    </noscript>
                </form>
            </div>
        </Template>
    );
}