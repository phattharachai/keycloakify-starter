import { useEffect, useRef } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/account/Template.useInitialize";
import type { TemplateProps } from "keycloakify/account/TemplateProps";
import type { KcContext } from "./KcContext";
import type { I18n } from "./i18n";
import "./account.css";

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, active, children } = props;
    const { msg, msgStr, currentLanguage, enabledLanguages } = i18n;
    const { url, features, realm, message, referrer } = kcContext;

    const resourcesPath = `${import.meta.env.BASE_URL}metronic`;
    const activeNavItemRef = useRef<HTMLAnchorElement | null>(null);

    const navItems = [
        { id: "account", href: url.accountUrl, label: msgStr("account"), icon: "ki-user" },
        ...(features.passwordUpdateSupported ? [{ id: "password", href: url.passwordUrl, label: msgStr("password"), icon: "ki-key" }] : []),
        { id: "totp", href: url.totpUrl, label: msgStr("authenticator"), icon: "ki-security-user" },
        ...(features.identityFederation
            ? [{ id: "social", href: url.socialUrl, label: msgStr("federatedIdentity"), icon: "ki-profile-circle" }]
            : []),
        { id: "sessions", href: url.sessionsUrl, label: msgStr("sessions"), icon: "ki-shield-tick" },
        { id: "applications", href: url.applicationsUrl, label: msgStr("applications"), icon: "ki-element-11" },
        ...(features.log ? [{ id: "log", href: url.logUrl, label: msgStr("log"), icon: "ki-time" }] : []),
        ...(realm.userManagedAccessAllowed && features.authorization
            ? [{ id: "authorization", href: url.resourceUrl, label: msgStr("myResources"), icon: "ki-abstract-26" }]
            : [])
    ];

    useEffect(() => {
        document.title = msgStr("accountManagementTitle");
    }, [msgStr]);

    useSetClassName({
        qualifiedName: "html",
        className: "h-full w-full overflow-x-hidden"
    });

    useSetClassName({
        qualifiedName: "body",
        className: "min-h-full w-full overflow-x-hidden bg-background text-foreground antialiased"
    });

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

    useEffect(() => {
        if (!isReadyToRender) {
            return;
        }

        const activeNavItem = activeNavItemRef.current;
        const nav = activeNavItem?.parentElement;

        if (activeNavItem === undefined || activeNavItem === null || nav === undefined || nav === null) {
            return;
        }

        requestAnimationFrame(() => {
            nav.scrollLeft = activeNavItem.offsetLeft - nav.clientWidth / 2 + activeNavItem.clientWidth / 2;
        });
    }, [active, isReadyToRender]);

    if (!isReadyToRender) {
        return null;
    }

    return (
        <>
            <link rel="icon" type="image/x-icon" href={`${resourcesPath}/media/app/favicon.ico`} />
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
            <link rel="stylesheet" href={`${resourcesPath}/vendors/keenicons/styles.bundle.css`} />
            <link rel="stylesheet" href={`${resourcesPath}/css/styles.css`} />

            <div className="account-shell">
                <header className="account-topbar">
                    <div className="account-topbar__inner">
                        <a href={url.accountUrl} className="account-brand" aria-label={msgStr("accountManagementTitle")}>
                            <img src={`${resourcesPath}/media/app/default-logo.svg`} alt="" className="account-brand__logo" />
                            <div className="account-brand__copy">
                                <span className="account-brand__eyebrow">Keycloak Theme Studio</span>
                                <span className="account-brand__title">{msg("accountManagementTitle")}</span>
                            </div>
                        </a>

                        <div className="account-topbar__actions">
                            {enabledLanguages.length > 1 && (
                                <details className="account-locale-switcher">
                                    <summary>
                                        <i className="ki-filled ki-geolocation text-sm" aria-hidden="true" />
                                        <span>{currentLanguage.label}</span>
                                    </summary>
                                    <div className="account-locale-switcher__menu">
                                        {enabledLanguages.map(({ languageTag, label, href }) => (
                                            <a key={languageTag} href={href} className="account-locale-switcher__item">
                                                {label}
                                            </a>
                                        ))}
                                    </div>
                                </details>
                            )}

                            {referrer?.url && (
                                <a href={referrer.url} className="account-action-link">
                                    <i className="ki-filled ki-arrow-left text-sm" aria-hidden="true" />
                                    <span>{msg("backTo", referrer.name)}</span>
                                </a>
                            )}

                            <a href={url.getLogoutUrl()} className="account-signout-btn">
                                <i className="ki-filled ki-exit-right-corner text-sm" aria-hidden="true" />
                                <span>{msg("doSignOut")}</span>
                            </a>
                        </div>
                    </div>
                </header>

                <main className="account-layout">
                    <aside className="account-sidebar">
                        <div className="account-sidebar__heading">
                            <span className="account-sidebar__eyebrow">Workspace</span>
                            <h1 className="account-sidebar__title">{msg("accountManagementTitle")}</h1>
                            <p className="account-sidebar__description">Manage profile details, sessions, authenticators, and application access from one place.</p>
                        </div>

                        <nav className="account-nav" aria-label={msgStr("accountManagementTitle")}>
                            {navItems.map(item => (
                                <a
                                    key={item.id}
                                    ref={item.id === active ? activeNavItemRef : undefined}
                                    href={item.href}
                                    className={clsx("account-nav__item", item.id === active && "is-active")}
                                    aria-current={item.id === active ? "page" : undefined}
                                >
                                    <span className="account-nav__icon">
                                        <i className={clsx("ki-filled", item.icon)} aria-hidden="true" />
                                    </span>
                                    <span>{item.label}</span>
                                </a>
                            ))}
                        </nav>
                    </aside>

                    <section className="account-panel">
                        {message !== undefined && (
                            <div className={clsx("account-alert", `is-${message.type}`)} role={message.type === "error" ? "alert" : "status"}>
                                <i
                                    className={clsx(
                                        "ki-filled text-base",
                                        message.type === "success" && "ki-check-circle",
                                        message.type === "error" && "ki-information-2",
                                        message.type === "warning" && "ki-information-4",
                                        message.type === "info" && "ki-information-4"
                                    )}
                                    aria-hidden="true"
                                />
                                <span dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }} />
                            </div>
                        )}

                        <div className="account-panel__surface">{children}</div>
                    </section>
                </main>
            </div>
        </>
    );
}
