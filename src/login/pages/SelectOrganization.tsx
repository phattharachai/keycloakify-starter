import { type MouseEvent, useRef, useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { logoSrc } from "../assets";

export default function SelectOrganization(props: PageProps<Extract<KcContext, { pageId: "select-organization.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, user } = kcContext;
    const { msg } = i18n;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const organizationInputRef = useRef<HTMLInputElement>(null);
    const organizations = user.organizations ?? [];
    const shouldDisplayGrid = organizations.length > 3;

    const onOrganizationClick = (organizationAlias: string) => (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        if (!organizationInputRef.current || !formRef.current) {
            return;
        }

        organizationInputRef.current.value = organizationAlias;
        setIsSubmitting(true);

        if (typeof formRef.current.requestSubmit === "function") {
            formRef.current.requestSubmit();
            return;
        }

        formRef.current.submit();
    };

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} headerNode={null} displayMessage={false}>
            <div className="flex flex-col gap-4">
                <div className="flex justify-center">
                    <img src={logoSrc} alt="Logo" className="h-8" />
                </div>

                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex items-center justify-center size-16 rounded-full bg-primary/10">
                        <i className="ki-filled ki-people text-primary text-3xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-mono leading-none mb-1">
                            {msg("organization.select")}
                        </h3>
                    </div>
                </div>

                <form ref={formRef} action={url.loginAction} method="post">
                    <div id="kc-user-organizations" className={`grid gap-2.5 ${shouldDisplayGrid ? "sm:grid-cols-2" : "grid-cols-1"}`}>
                        {organizations.map(({ alias, name }) => (
                            <button
                                key={alias}
                                id={`organization-${alias}`}
                                className="rounded-lg border border-border bg-background px-4 py-3 text-left transition-colors hover:border-primary/40 hover:bg-primary/5 disabled:opacity-60 disabled:cursor-not-allowed"
                                type="button"
                                onClick={onOrganizationClick(alias)}
                                disabled={isSubmitting}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center size-9 rounded-full bg-primary/10 shrink-0">
                                        <i className="ki-filled ki-office-bag text-primary text-base" />
                                    </div>
                                    <span className="min-w-0 truncate text-sm font-medium text-mono">{name ?? alias}</span>
                                    <i className="ki-filled ki-right text-muted-foreground text-sm ms-auto shrink-0" />
                                </div>
                            </button>
                        ))}
                    </div>
                    <input ref={organizationInputRef} type="hidden" name="kc.org" />
                </form>
            </div>
        </Template>
    );
}