import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { logoSrc } from "../assets";

export default function Terms(
    props: PageProps<Extract<KcContext, { pageId: "terms.ftl" }>, I18n>
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { msg, advancedMsgStr, msgStr } = i18n;
    const { url } = kcContext;

    const termsHtml = advancedMsgStr("termsText");

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={msg("termsTitle")}
        >
            <div className="flex flex-col gap-5">
                <div className="flex justify-center">
                    <img src={logoSrc} alt="Logo" className="auth-logo" />
                </div>

                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex items-center justify-center size-16 rounded-full bg-primary/10">
                        <i className="ki-filled ki-file-sheet text-primary text-3xl" />
                    </div>
                    <h3 className="text-lg font-medium text-mono leading-none">
                        {msg("termsTitle")}
                    </h3>
                </div>

                <div
                    id="kc-terms-text"
                    className="max-h-[min(40vh,320px)] overflow-y-auto rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-secondary-foreground leading-relaxed sm:px-5 [&_a]:kt-link [&_h1]:text-base [&_h1]:font-semibold [&_h1]:text-mono [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:text-mono [&_ol]:list-decimal [&_ol]:ps-5 [&_p]:mb-3 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:ps-5"
                    dangerouslySetInnerHTML={{ __html: kcSanitize(termsHtml) }}
                />

                <form
                    className="grid grid-cols-1 gap-2.5 sm:grid-cols-2"
                    action={url.loginAction}
                    method="POST"
                >
                    <button
                        name="accept"
                        id="kc-accept"
                        type="submit"
                        className="kt-btn kt-btn-primary flex justify-center min-w-0"
                    >
                        {msgStr("doAccept")}
                    </button>
                    <button
                        name="cancel"
                        id="kc-decline"
                        type="submit"
                        className="kt-btn kt-btn-outline flex justify-center min-w-0"
                    >
                        {msgStr("doDecline")}
                    </button>
                </form>
            </div>
        </Template>
    );
}