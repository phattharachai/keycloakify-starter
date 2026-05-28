import { useEffect } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { clsx } from "keycloakify/tools/clsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import type { KcContext } from "./KcContext";
import type { I18n } from "./i18n";

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const {
        displayMessage = true,
        documentTitle,
        kcContext,
        i18n,
        doUseDefaultCss,
        children
    } = props;

    const { msgStr } = i18n;
    const { realm, url, message, isAppInitiatedAction } = kcContext;
    const resourcesPath = `${import.meta.env.BASE_URL}metronic`;
    const isLongForm = [
        "register.ftl",
        "login-update-profile.ftl",
        "login-config-totp.ftl",
        "login-recovery-authn-code-config.ftl"
    ].includes(kcContext.pageId);

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", realm.displayName || realm.name);
    }, []);

    useSetClassName({ qualifiedName: "html", className: "h-full w-full overflow-x-hidden" });
    useSetClassName({
        qualifiedName: "body",
        className: "antialiased flex h-full w-full overflow-x-hidden text-base text-foreground bg-background"
    });

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

    if (!isReadyToRender) {
        return null;
    }

    return (
        <>
            <link
                rel="icon"
                type="image/x-icon"
                href={`${resourcesPath}/media/app/favicon.ico`}
            />
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
            />
            <link rel="stylesheet" href={`${resourcesPath}/vendors/keenicons/styles.bundle.css`} />
            <link rel="stylesheet" href={`${resourcesPath}/css/styles.css`} />
            <style>{`
                .page-bg{background-image:linear-gradient(180deg,rgba(248,250,252,.92),rgba(248,250,252,.84)),url('${resourcesPath}/media/images/2600x1200/bg-10.png');}
                .auth-shell .kt-card{border-color:rgba(226,232,240,.9);box-shadow:0 24px 80px rgba(15,23,42,.14),0 1px 2px rgba(15,23,42,.06);}
                .auth-shell .kt-input{min-height:44px;border-color:rgb(203,213,225);background:rgba(255,255,255,.96);transition:border-color .18s ease,box-shadow .18s ease,background-color .18s ease;}
                .auth-shell input.kt-input{min-height:44px;}
                .auth-shell .kt-input:hover{border-color:rgb(148,163,184);}
                .auth-shell .kt-input:focus-within,.auth-shell input.kt-input:focus,.auth-shell .auth-password-input:focus-within{border-color:rgb(37,99,235);box-shadow:0 0 0 3px rgba(37,99,235,.14);background:#fff;}
                .auth-shell .kt-input:has(input[aria-invalid="true"]),.auth-shell input.kt-input[aria-invalid="true"],.auth-shell .auth-password-input:has(input[aria-invalid="true"]){border-color:rgb(220,38,38);box-shadow:0 0 0 3px rgba(220,38,38,.10);}
                .auth-shell .auth-password-input{display:flex;align-items:center;width:100%;height:44px;min-height:44px;padding:0 0.25rem 0 0.75rem;gap:0.5rem;border:1px solid rgb(203,213,225);border-radius:0.5rem;background:rgba(255,255,255,.96);box-shadow:0 1px 2px rgba(15,23,42,.05);transition:border-color .18s ease,box-shadow .18s ease,background-color .18s ease;}
                .auth-shell .auth-password-input:hover{border-color:rgb(148,163,184);}
                .auth-shell .auth-password-input input{height:100%;min-width:0;width:100%;border:0;background:transparent;padding:0;color:rgb(15,23,42);outline:0;font-size:0.8125rem;}
                .auth-shell .auth-password-input input::placeholder{color:rgb(100,116,139);}
                .auth-shell .auth-password-toggle{appearance:none;display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;flex:0 0 36px;border:0;border-radius:0.5rem;background:transparent;color:rgb(100,116,139);transition:color .18s ease,background-color .18s ease,box-shadow .18s ease;}
                .auth-shell .auth-password-toggle:hover{background:rgb(241,245,249);color:rgb(15,23,42);}
                .auth-shell .auth-password-toggle:focus-visible{outline:0;box-shadow:0 0 0 2px rgba(37,99,235,.28);}
                .auth-shell .kt-btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;min-height:44px;border-radius:.65rem;padding-inline:1rem;font-weight:600;line-height:1.25;transition:background-color .18s ease,border-color .18s ease,color .18s ease,box-shadow .18s ease,opacity .18s ease;}
                .auth-shell .kt-btn:not(.kt-btn-sm):not(.kt-btn-icon){width:100%;}
                .auth-shell .kt-btn:not(:disabled){cursor:pointer;}
                .auth-shell .kt-btn-primary{border-color:rgb(47,125,246);background:rgb(47,125,246);color:#fff;box-shadow:0 8px 18px rgba(47,125,246,.18);}
                .auth-shell .kt-btn-primary:hover{border-color:rgb(37,99,235);background:rgb(37,99,235);color:#fff;}
                .auth-shell .kt-btn-outline{border-color:rgb(203,213,225);background:#fff;color:rgb(51,65,85);box-shadow:0 1px 2px rgba(15,23,42,.04);}
                .auth-shell .kt-btn-outline:hover{border-color:rgb(148,163,184);background:rgb(248,250,252);color:rgb(15,23,42);}
                .auth-shell .kt-btn:focus-visible{outline:0;box-shadow:0 0 0 3px rgba(37,99,235,.20);}
                .auth-shell .kt-btn-primary:focus-visible{box-shadow:0 0 0 3px rgba(37,99,235,.22),0 8px 18px rgba(47,125,246,.18);}
                .auth-shell .kt-btn:disabled,.auth-shell .kt-btn[aria-disabled="true"]{opacity:.62;cursor:not-allowed;box-shadow:none;}
                .auth-shell .kt-btn-sm{width:auto;min-height:36px;border-radius:.55rem;padding-inline:.75rem;font-size:.8125rem;}
                .auth-shell .kt-btn-icon{min-height:36px;min-width:36px;}
                .auth-shell .kt-btn i{line-height:1;flex:0 0 auto;}
                .auth-shell .kt-checkbox,.auth-shell .kt-radio{min-width:18px;min-height:18px;}
                .auth-shell .kt-label{min-height:32px;}
                .auth-shell .auth-error{border:1px solid rgba(220,38,38,.18);background:rgba(254,242,242,.85);border-radius:.5rem;padding:.5rem .625rem;}
                .auth-shell .auth-helper{color:rgb(71,85,105);}
                @media (prefers-reduced-motion: reduce){.auth-shell .kt-input,.auth-shell .kt-btn,.auth-shell .auth-password-toggle{transition:none;}}
            `}</style>

            <div
                className="auth-shell flex items-center justify-center grow bg-center bg-no-repeat bg-cover page-bg px-4 py-6 sm:py-10"
                style={{
                    width: "100vw",
                    maxWidth: "100vw",
                    overflowX: "hidden"
                }}
            >
                <div
                    className="kt-card"
                    style={{
                        width: "100%",
                        maxWidth: isLongForm
                            ? "min(480px, calc(100vw - 2rem))"
                            : "min(390px, calc(100vw - 2rem))"
                    }}
                >
                    <div className="kt-card-content flex flex-col gap-5 p-6 sm:p-8">
                        {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                            <div
                                className={clsx(
                                    "kt-alert text-sm rounded-lg px-3 py-2.5 border",
                                    message.type === "error" && "border-destructive/40 bg-destructive/10 text-destructive",
                                    message.type === "warning" && "border-warning/40 bg-warning/10 text-warning",
                                    message.type === "success" && "border-success/40 bg-success/10 text-success",
                                    message.type === "info" && "border-border bg-muted text-foreground"
                                )}
                            >
                                <span
                                    dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }}
                                />
                            </div>
                        )}
                        {children}
                        {kcContext.auth?.showTryAnotherWayLink && (
                            <form id="kc-select-try-another-way-form" action={url.loginAction} method="post" className="text-center">
                                <input type="hidden" name="tryAnotherWay" value="on" />
                                <a
                                    href="#"
                                    className="kt-link text-sm font-medium"
                                    onClick={event => {
                                        document.forms["kc-select-try-another-way-form" as never].requestSubmit();
                                        event.preventDefault();
                                        return false;
                                    }}
                                >
                                    {i18n.msg("doTryAnotherWay")}
                                </a>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
