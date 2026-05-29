import { type ChangeEvent, type MouseEvent, useRef, useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { logoSrc } from "../assets";

export default function SelectOrganization(props: PageProps<Extract<KcContext, { pageId: "select-organization.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, user } = kcContext;
    const { msg, msgStr } = i18n;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState("");
    const formRef = useRef<HTMLFormElement>(null);
    const organizationInputRef = useRef<HTMLInputElement>(null);
    const organizations = user.organizations ?? [];
    const useSelect = organizations.length > 3;

    const submitOrganization = (organizationAlias: string) => {
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

    const onOrganizationClick = (organizationAlias: string) => (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        submitOrganization(organizationAlias);
    };

    const onOrganizationChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const organizationAlias = event.currentTarget.value;

        if (organizationAlias === "") {
            return;
        }

        setSelectedOrg(organizationAlias);
        submitOrganization(organizationAlias);
    };

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} headerNode={null} displayMessage={false}>
            <div className="flex flex-col gap-4">
                <div className="flex justify-center">
                    <img src={logoSrc} alt="Logo" className="auth-logo" />
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
                    <div id="kc-user-organizations">
                        {useSelect ? (
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="organization-select" className="auth-sr-only">
                                    {msg("organization.select")}
                                </label>
                                <div className="relative">
                                    <i className="ki-filled ki-office-bag auth-org-select-icon text-base text-muted-foreground" aria-hidden="true" />
                                    <select
                                        id="organization-select"
                                        className="kt-select auth-org-select text-sm font-medium"
                                        value={selectedOrg}
                                        onChange={onOrganizationChange}
                                        disabled={isSubmitting}
                                        aria-label={msgStr("organization.select")}
                                    >
                                        <option value="" disabled>
                                            {msg("organization.select")}
                                        </option>
                                        {organizations.map(({ alias, name }) => (
                                            <option key={alias} value={alias}>
                                                {name ?? alias}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ) : (
                            <ul className="grid grid-cols-1 gap-2.5">
                                {organizations.map(({ alias, name }) => (
                                    <li key={alias}>
                                        <button
                                            id={`organization-${alias}`}
                                            className="group w-full min-h-[60px] rounded-lg border border-border bg-background px-4 py-3 text-left shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:bg-background"
                                            type="button"
                                            onClick={onOrganizationClick(alias)}
                                            disabled={isSubmitting}
                                            aria-label={`${msgStr("organization.select")}: ${name ?? alias}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center size-9 rounded-full bg-primary/10 shrink-0 transition-colors group-hover:bg-primary/15">
                                                    <i className="ki-filled ki-office-bag text-primary text-base" />
                                                </div>
                                                <span className="min-w-0 truncate text-sm font-medium text-mono">{name ?? alias}</span>
                                                <i className="ki-filled ki-right text-muted-foreground text-sm ms-auto shrink-0 transition-transform group-hover:translate-x-0.5" />
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <input ref={organizationInputRef} type="hidden" name="kc.org" />
                </form>
            </div>
        </Template>
    );
}
