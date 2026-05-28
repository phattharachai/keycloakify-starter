import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function Code(props: PageProps<Extract<KcContext, { pageId: "code.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { code } = kcContext;
    const { msg } = i18n;

    const logoSrc = `${import.meta.env.BASE_URL}metronic/media/app/default-logo.svg`;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={code.success ? msg("codeSuccessTitle") : msg("codeErrorTitle", code.error)}
        >
            <div className="flex flex-col gap-5">
                <div className="flex justify-center">
                    <img src={logoSrc} alt="Logo" className="h-8" />
                </div>

                <div className="flex flex-col items-center gap-3 text-center">
                    <div className={`flex items-center justify-center size-16 rounded-full ${code.success ? "bg-success/10" : "bg-destructive/10"}`}>
                        <i className={`ki-filled ${code.success ? "ki-shield-tick text-success" : "ki-information-2 text-destructive"} text-3xl`} />
                    </div>
                    <h3 className="text-lg font-medium text-mono leading-none">
                        {code.success ? msg("codeSuccessTitle") : msg("codeErrorTitle", code.error)}
                    </h3>
                </div>

                {code.success ? (
                    <div id="kc-code" className="flex flex-col gap-3">
                        <p className="text-sm text-secondary-foreground text-center leading-relaxed">
                            {msg("copyCodeInstruction")}
                        </p>
                        <textarea
                            id="code"
                            readOnly
                            value={code.code}
                            className="kt-input min-h-[112px] resize-none px-4 py-3 text-center font-mono text-base tracking-[0.24em]"
                            aria-label="Verification code"
                        />
                    </div>
                ) : (
                    code.error && (
                        <div
                            id="error"
                            className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive text-center leading-relaxed [&_a]:underline [&_a]:underline-offset-2"
                            dangerouslySetInnerHTML={{ __html: kcSanitize(code.error) }}
                        />
                    )
                )}
            </div>
        </Template>
    );
}