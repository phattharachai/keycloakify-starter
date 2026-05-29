import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { logoSrc, resolveSocialIcon } from "../assets";
import { PasswordInput } from "./PasswordInput";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, Template, doUseDefaultCss, classes } = props;

    const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField } = kcContext;
    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    const hasUsernameError = messagesPerField.existsError("username");
    const hasPasswordError = messagesPerField.existsError("password");
    const hasError         = hasUsernameError || hasPasswordError;
    const showRegisterLink = realm.password && realm.registrationAllowed && !registrationDisabled;
    const showSocial       = realm.password && social?.providers !== undefined && social.providers.length !== 0;
    const usernameKey      = !realm.loginWithEmailAllowed ? "username" : !realm.registrationEmailAsUsername ? "usernameOrEmail" : "email";

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!hasError}
            headerNode={msg("loginAccountTitle")}
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
                        {msg("loginAccountTitle")}
                    </h3>
                    {showRegisterLink && (
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
                        <div className={clsx(
                            "grid gap-2.5",
                            social!.providers!.length === 1 ? "grid-cols-1" : "grid-cols-2"
                        )}>
                            {social!.providers!.map(p => {
                                const icon = resolveSocialIcon(p.providerId, p.iconClasses);
                                return (
                                    <a
                                        key={p.alias}
                                        id={`social-${p.alias}`}
                                        className="kt-btn kt-btn-outline justify-center gap-2"
                                        href={p.loginUrl}
                                    >
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

                {/* Credentials */}
                {realm.password && (
                    <>
                        {/* Username / email */}
                        {!usernameHidden && (
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
                                    defaultValue={login.username ?? ""}
                                    placeholder={msgStr(usernameKey)}
                                    className="kt-input"
                                    aria-invalid={hasUsernameError}
                                    aria-describedby={hasUsernameError ? "input-error-username" : undefined}
                                />
                                {hasUsernameError && (
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

                        {/* Password */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-baseline justify-between gap-3">
                                <label htmlFor="password" className="kt-form-label mb-0 min-w-0 text-sm font-medium text-mono">
                                    {msg("password")}
                                </label>
                                {realm.resetPasswordAllowed && (
                                    <a
                                        className="kt-link shrink-0 whitespace-nowrap text-xs font-medium text-right sm:text-sm"
                                        href={url.loginResetCredentialsUrl}
                                    >
                                        {msg("doForgotPassword")}
                                    </a>
                                )}
                            </div>
                            <PasswordInput
                                id="password"
                                name="password"
                                placeholder={msgStr("password")}
                                autoFocus={usernameHidden}
                                autoComplete="current-password"
                                hasError={hasPasswordError}
                                errorId="input-error-password"
                                i18n={i18n}
                            />
                            {hasPasswordError && (
                                <span
                                    id="input-error-password"
                                    className="auth-error flex items-start gap-1.5 text-xs text-destructive mt-1"
                                    role="alert"
                                    aria-live="polite"
                                >
                                    <i className="ki-filled ki-information-2 text-sm shrink-0 mt-px" />
                                    <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.getFirstError("password")) }} />
                                </span>
                            )}
                        </div>

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

                        <input
                            type="hidden"
                            id="id-hidden-input"
                            name="credentialId"
                            value={auth.selectedCredential}
                        />

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoginButtonDisabled}
                            name="login"
                            id="kc-login"
                            aria-busy={isLoginButtonDisabled}
                            className="kt-btn kt-btn-primary mt-1 flex justify-center grow transition-opacity disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {isLoginButtonDisabled
                                ? <><i className="ki-filled ki-loading animate-spin me-2" />{msgStr("doLogIn")}</>
                                : msgStr("doLogIn")}
                        </button>
                    </>
                )}
            </form>
        </Template>
    );
}
