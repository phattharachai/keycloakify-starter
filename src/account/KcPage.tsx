import { Suspense, lazy } from "react";
import type { ClassKey } from "keycloakify/account";
import type { KcContext } from "./KcContext";
import { useI18n } from "./i18n";
import DefaultPage from "keycloakify/account/DefaultPage";
import Template from "./Template";

const Account = lazy(() => import("./pages/Account"));
const Password = lazy(() => import("./pages/Password"));
const Totp = lazy(() => import("./pages/Totp"));
const Sessions = lazy(() => import("./pages/Sessions"));
const Applications = lazy(() => import("./pages/Applications"));
const Log = lazy(() => import("./pages/Log"));
const FederatedIdentity = lazy(() => import("./pages/FederatedIdentity"));

export default function KcPage(props: { kcContext: KcContext }) {
    const { kcContext } = props;

    const { i18n } = useI18n({ kcContext });

    return (
        <Suspense>
            {(() => {
                switch (kcContext.pageId) {
                    case "account.ftl":
                        return <Account kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={false} />;
                    case "password.ftl":
                        return <Password kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={false} />;
                    case "totp.ftl":
                        return <Totp kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={false} />;
                    case "sessions.ftl":
                        return <Sessions kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={false} />;
                    case "applications.ftl":
                        return <Applications kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={false} />;
                    case "log.ftl":
                        return <Log kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={false} />;
                    case "federatedIdentity.ftl":
                        return <FederatedIdentity kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={false} />;
                    default:
                        return <DefaultPage kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={false} />;
                }
            })()}
        </Suspense>
    );
}

const classes = {
    kcHtmlClass: "h-full w-full overflow-x-hidden",
    kcBodyClass: "account-theme-body",
    kcButtonClass: "kt-btn",
    kcButtonPrimaryClass: "kt-btn-primary",
    kcButtonLargeClass: "kt-btn-lg",
    kcButtonDefaultClass: "kt-btn-outline",
    kcContentWrapperClass: "flex flex-col gap-4",
    kcFormClass: "flex flex-col gap-4",
    kcFormGroupClass: "flex flex-col gap-1 mb-4",
    kcInputWrapperClass: "",
    kcLabelClass: "kt-form-label font-normal text-mono",
    kcInputClass: "kt-input",
    kcInputErrorMessageClass: "flex items-center gap-1 text-xs text-destructive mt-0.5"
} satisfies { [key in ClassKey]?: string };
