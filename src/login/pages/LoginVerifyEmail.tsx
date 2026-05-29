import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { logoSrc, illustrationSrc } from "../assets";

export default function LoginVerifyEmail(props: PageProps<Extract<KcContext, { pageId: "login-verify-email.ftl" }>, I18n>) {
    const { kcContext, i18n, Template, doUseDefaultCss, classes } = props;

    const { msg } = i18n;
    const { url, user } = kcContext;


    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("emailVerifyTitle")}
        >
            <div className="flex flex-col gap-5">
                {/* Logo */}
                <div className="flex justify-center">
                    <img src={logoSrc} alt="Logo" className="auth-logo" />
                </div>

                {/* Illustration */}
                <div className="flex justify-center py-2">
                    <img
                        alt="Check your email"
                        className="max-h-[120px]"
                        src={illustrationSrc(30)}
                    />
                </div>

                {/* Title + message */}
                <div className="text-center">
                    <h3 className="text-lg font-medium text-mono mb-2">
                        {msg("emailVerifyTitle")}
                    </h3>
                    {user?.email && (
                        <p className="text-sm font-medium text-mono mb-1">{user.email}</p>
                    )}
                    <p className="text-sm text-secondary-foreground">
                        {msg("emailVerifyInstruction1", user?.email ?? "")}
                    </p>
                </div>

                {/* Resend link */}
                <div className="flex items-center justify-center gap-1 flex-wrap text-center">
                    <span className="text-xs text-secondary-foreground">
                        {msg("emailVerifyInstruction2")}
                    </span>
                    <a href={url.loginAction} className="text-xs font-medium kt-link">
                        {msg("doClickHere")}
                    </a>
                    <span className="text-xs text-secondary-foreground">
                        {msg("emailVerifyInstruction3")}
                    </span>
                </div>
            </div>
        </Template>
    );
}
