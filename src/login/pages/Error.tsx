import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { stripLeadingActionMarker } from "../stripLeadingActionMarker";
import { logoSrc } from "../assets";

export default function Error(
    props: PageProps<Extract<KcContext, { pageId: "error.ftl" }>, I18n>
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { message, client, skipLink } = kcContext;
    const { msg, msgStr } = i18n;


    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={msg("errorTitle")}
        >
            <div className="flex flex-col gap-5">
                {/* Logo */}
                <div className="flex justify-center">
                    <img src={logoSrc} alt="Logo" className="auth-logo" />
                </div>

                {/* Error icon + title */}
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex items-center justify-center size-16 rounded-full bg-destructive/10">
                        <i className="ki-filled ki-shield-cross text-destructive text-3xl" />
                    </div>
                    <h3 className="text-lg font-medium text-mono leading-none">
                        {msg("errorTitle")}
                    </h3>
                </div>

                {/* Error message */}
                <div
                    id="kc-error-message"
                    className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive leading-relaxed [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:opacity-80 [&_strong]:font-semibold"
                    dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }}
                />

                {/* Back to application */}
                {!skipLink && client?.baseUrl && (
                    <a
                        id="backToApplication"
                        href={client.baseUrl}
                        className="kt-btn kt-btn-outline flex justify-center"
                    >
                        {stripLeadingActionMarker(msgStr("backToApplication"))}
                    </a>
                )}
            </div>
        </Template>
    );
}
