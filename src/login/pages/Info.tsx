import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { stripLeadingActionMarker } from "../stripLeadingActionMarker";

const actionIcons: Record<string, string> = {
    CONFIGURE_TOTP: "ki-security-user",
    UPDATE_PROFILE: "ki-user-edit",
    VERIFY_EMAIL:   "ki-sms",
};

export default function Info(
    props: PageProps<Extract<KcContext, { pageId: "info.ftl" }>, I18n>
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { advancedMsgStr, msgStr } = i18n;
    const { messageHeader, message, requiredActions, skipLink, pageRedirectUri, actionUri, client } = kcContext;

    const logoSrc = `${import.meta.env.BASE_URL}metronic/media/app/default-logo.svg`;

    const titleHtml = messageHeader
        ? advancedMsgStr(messageHeader)
        : (message.summary?.trim() ?? "");

    const bodyHtml = messageHeader ? (message.summary?.trim() ?? "") : null;

    const actionLink = !skipLink
        ? pageRedirectUri
                        ? { href: pageRedirectUri, label: stripLeadingActionMarker(msgStr("backToApplication")),   isPrimary: false }
            : actionUri
                            ? { href: actionUri,         label: stripLeadingActionMarker(msgStr("proceedWithAction")), isPrimary: true  }
              : client.baseUrl
                                ? { href: client.baseUrl,    label: stripLeadingActionMarker(msgStr("backToApplication")),   isPrimary: false }
                : null
        : null;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={<span dangerouslySetInnerHTML={{ __html: kcSanitize(titleHtml) }} />}
        >
            <div className="flex flex-col gap-4">
                {/* Logo */}
                <div className="flex justify-center">
                    <img src={logoSrc} alt="Logo" className="h-8" />
                </div>

                {/* Info icon + title */}
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex items-center justify-center size-16 rounded-full bg-primary/10">
                        <i className="ki-filled ki-information-2 text-primary text-3xl" />
                    </div>
                    <h3
                        className="text-lg font-medium text-mono leading-none"
                        dangerouslySetInnerHTML={{ __html: kcSanitize(titleHtml) }}
                    />
                </div>

                {/* Body: message + required actions */}
                <div id="kc-info-message" className="flex flex-col items-center gap-3">
                    {bodyHtml && (
                        <p
                            className="text-sm text-secondary-foreground text-center leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: kcSanitize(bodyHtml) }}
                        />
                    )}

                    {requiredActions && requiredActions.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2">
                            {requiredActions.map(action => (
                                <span
                                    key={action}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                                >
                                    <i className={`ki-filled ${actionIcons[action] ?? "ki-check-circle"} text-xs shrink-0`} />
                                    {advancedMsgStr(`requiredAction.${action}`)}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Action button */}
                {actionLink && (
                    <a
                        href={actionLink.href}
                        className={`kt-btn flex justify-center ${actionLink.isPrimary ? "kt-btn-primary" : "kt-btn-outline"}`}
                    >
                        <span>{actionLink.label}</span>
                    </a>
                )}
            </div>
        </Template>
    );
}
