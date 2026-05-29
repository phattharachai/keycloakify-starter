import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { logoSrc, resolveSocialIcon } from "../assets";

export default function LoginUsername(props: PageProps<Extract<KcContext, { pageId: "login-username.ftl" }>, I18n>) {
    const { kcContext, i18n, Template, doUseDefaultCss, classes } = props;

    const { social, realm, url, usernameHidden, login, registrationDisabled, messagesPerField } = kcContext;
    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    const hasError     = messagesPerField.existsError("username");
    const showReg      = realm.password && realm.registrationAllowed && !registrationDisabled;
    const showSocial   = realm.password && social?.providers !== undefined && social.providers.length !== 0;
    const usernameKey  = !realm.loginWithEmailAllowed ? "username" : !realm.registrationEmailAsUsername ? "usernameOrEmail" : "email";

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!hasError}
            headerNode={msg("doLogIn")}
        >
            <form
                id="kc-form-login"
                className="flex flex-col gap-4"
                action={url.loginAction}
                method="post"
                onSubmit={() => { setIsLoginButtonDisabled(true); return true; }}
            >
                {/* Branding + title */}
                <div className="text-center mb-1.5">
                    <a href="#" className="flex justify-center mb-3" tabIndex={-1} aria-hidden="true">
                        <img src={logoSrc} alt="Logo" className="auth-logo" />
                    </a>
                    <h3 className="text-lg font-medium text-mono leading-none mb-2.5">
                        {msg("doLogIn")}
                    </h3>
                    {showReg && (
                        <div className="flex items-center justify-center font-medium">
                            <span className="text-sm text-secondary-foreground me-1.5">
                                {msg("noAccount")}
                            </span>
                            <a className="text-sm kt-link" href={url.registrationUrl}>
                                {msg("doRegister")}
                            </a>
                        </div>
                    )}
                </div>

                {/* Social providers */}
                {showSocial && (
                    <>
                        <div className={clsx("grid gap-2.5", social!.providers!.length === 1 ? "grid-cols-1" : "grid-cols-2")}>
                            {social!.providers!.map(p => {
                                const icon = resolveSocialIcon(p.providerId, p.iconClasses);
                                return (
                                    <a key={p.alias} id={`social-${p.alias}`} className="kt-btn kt-btn-outline justify-center gap-2" href={p.loginUrl}>
                                        {icon.src
                                            ? <img alt="" className="size-4 shrink-0" src={icon.src} />
                                            : icon.faClass
                                              ? <i className={clsx(icon.faClass, "size-4 shrink-0")} aria-hidden="true" />
                                              : null}
                                        <span dangerouslySetInnerHTML={{ __html: kcSanitize(p.displayName) }} />
                                    </a>
                                );
                            })}
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="flex-1 border-t border-border min-w-0" />
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest px-1 whitespace-nowrap shrink-0">
                                {msg("identity-provider-login-label")}
                            </span>
                            <span className="flex-1 border-t border-border min-w-0" />
                        </div>
                    </>
                )}

                {/* Username field */}
                {realm.password && !usernameHidden && (
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="username" className="kt-form-label mb-0 text-sm font-medium text-mono">
                            {msg(usernameKey)}
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            autoFocus
                            autoComplete="username"
                            placeholder={msgStr(usernameKey)}
                            defaultValue={login.username ?? ""}
                            className="kt-input"
                            aria-invalid={hasError}
                            aria-describedby={hasError ? "input-error-username" : undefined}
                        />
                        {hasError && (
                            <span
                                id="input-error-username"
                                className="auth-error flex items-start gap-1.5 text-xs text-destructive mt-1"
                                role="alert"
                                aria-live="polite"
                            >
                                <i className="ki-filled ki-information-2 text-sm shrink-0 mt-px" />
                                <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.getFirstError("username")) }} />
                            </span>
                        )}
                    </div>
                )}

                {/* Remember me */}
                {realm.rememberMe && !usernameHidden && (
                    <label className="kt-label flex items-center gap-2 cursor-pointer rounded-md px-0.5 py-0.5">
                        <input
                            id="rememberMe"
                            name="rememberMe"
                            type="checkbox"
                            defaultChecked={!!login.rememberMe}
                            className="kt-checkbox kt-checkbox-sm"
                        />
                        <span className="kt-checkbox-label text-sm">{msg("rememberMe")}</span>
                    </label>
                )}

                {/* Submit */}
                {realm.password && (
                    <button
                        type="submit"
                        name="login"
                        id="kc-login"
                        disabled={isLoginButtonDisabled}
                        aria-busy={isLoginButtonDisabled}
                        className="kt-btn kt-btn-primary mt-1 flex justify-center grow transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoginButtonDisabled && <i className="ki-filled ki-loading animate-spin me-2" />}
                        {msgStr("doLogIn")}
                    </button>
                )}
            </form>
        </Template>
    );
}
