import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { logoSrc } from "../assets";

export default function SelectAuthenticator(props: PageProps<Extract<KcContext, { pageId: "select-authenticator.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, auth } = kcContext;
    const { msg, advancedMsg } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={msg("loginChooseAuthenticator")}
        >
            <div className="flex flex-col gap-4">
                <div className="flex justify-center">
                    <img src={logoSrc} alt="Logo" className="auth-logo" />
                </div>

                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex items-center justify-center size-16 rounded-full bg-primary/10">
                        <i className="ki-filled ki-security-user text-primary text-3xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-mono leading-none mb-1">
                            {msg("loginChooseAuthenticator")}
                        </h3>
                    </div>
                </div>

                {auth.authenticationSelections.length > 0 ? (
                    <form id="kc-select-credential-form" action={url.loginAction} method="post" className="flex flex-col gap-2.5">
                        {auth.authenticationSelections.map(authenticationSelection => (
                            <button
                                key={authenticationSelection.authExecId}
                                className="rounded-lg border border-border bg-background px-4 py-3 text-left transition-colors hover:border-primary/40 hover:bg-primary/5"
                                type="submit"
                                name="authenticationExecution"
                                value={authenticationSelection.authExecId}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 flex items-center justify-center size-9 rounded-full bg-primary/10 shrink-0">
                                        <i className="ki-filled ki-right-square text-primary text-base" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-sm font-medium text-mono leading-5">
                                            {advancedMsg(authenticationSelection.displayName)}
                                        </div>
                                        <div className="mt-1 text-xs text-secondary-foreground leading-relaxed">
                                            {advancedMsg(authenticationSelection.helpText)}
                                        </div>
                                    </div>
                                    <i className="ki-filled ki-right text-muted-foreground text-sm shrink-0 self-center" />
                                </div>
                            </button>
                        ))}
                    </form>
                ) : (
                    <div className="rounded-lg border border-border px-4 py-3 text-sm text-secondary-foreground text-center">
                        {msg("loginChooseAuthenticator")}
                    </div>
                )}
            </div>
        </Template>
    );
}