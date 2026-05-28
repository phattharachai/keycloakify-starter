import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function LinkIdpAction(props: PageProps<Extract<KcContext, { pageId: "link-idp-action.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { idpDisplayName, url } = kcContext;
    const { msg, msgStr } = i18n;

    const logoSrc = `${import.meta.env.BASE_URL}metronic/media/app/default-logo.svg`;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("linkIdpActionTitle", idpDisplayName)}
            displayMessage={false}
        >
            <div className="flex flex-col gap-5">
                {/* Logo */}
                <div className="flex justify-center">
                    <img src={logoSrc} alt="Logo" className="h-8" />
                </div>

                {/* Icon + title */}
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex items-center justify-center size-16 rounded-full bg-primary/10">
                        <i className="ki-filled ki-profile-circle text-primary text-3xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-mono leading-none mb-1">
                            {msg("linkIdpActionTitle", idpDisplayName)}
                        </h3>
                        <p className="text-sm text-secondary-foreground">
                            {msg("linkIdpActionMessage", idpDisplayName)}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <form action={url.loginAction} method="post" className="flex flex-col gap-2.5">
                    <button
                        type="submit"
                        name="continue"
                        id="kc-continue"
                        className="kt-btn kt-btn-primary flex justify-center grow"
                    >
                        {msgStr("doContinue")}
                    </button>
                    <button
                        type="submit"
                        name="cancel-aia"
                        id="kc-cancel"
                        className="kt-btn kt-btn-outline flex justify-center"
                    >
                        {msgStr("doCancel")}
                    </button>
                </form>
            </div>
        </Template>
    );
}
