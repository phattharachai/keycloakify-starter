import type { ReactNode } from "react";
import type { PageProps } from "keycloakify/account/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function Applications(props: PageProps<Extract<KcContext, { pageId: "applications.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, classes, Template } = props;
    const {
        url,
        applications: { applications },
        stateChecker
    } = kcContext;
    const { msg, advancedMsg } = i18n;

    return (
        <Template {...{ kcContext, i18n, doUseDefaultCss, classes }} active="applications">
            <section className="account-data-section">
                <div className="account-card-form__header">
                    <div>
                        <p className="account-card-form__eyebrow">{msg("applicationsEyebrow")}</p>
                        <h2 className="account-card-form__title">{msg("applicationsHtmlTitle")}</h2>
                        <p className="account-card-form__description">
                            Review application access, available roles, and granted scopes, then revoke access where consent is no longer required.
                        </p>
                    </div>

                    <div className="account-card-form__meta">
                        <span className="account-card-form__required-pill">{applications.length} connected</span>
                    </div>
                </div>

                <form action={url.applicationsUrl} method="post" className="account-data-section__body">
                    <input type="hidden" id="stateChecker" name="stateChecker" value={stateChecker} />
                    <input type="hidden" id="referrer" name="referrer" value={stateChecker} />

                    <div className="account-table-shell">
                        <table className="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>{msg("application")}</th>
                                    <th>{msg("availableRoles")}</th>
                                    <th>{msg("grantedPermissions")}</th>
                                    <th>{msg("additionalGrants")}</th>
                                    <th>{msg("action")}</th>
                                </tr>
                            </thead>

                            <tbody>
                                {applications.map(application => {
                                    const appLabel = (application.client.name && advancedMsg(application.client.name)) || application.client.clientId;
                                    const showRevokeButton =
                                        (application.client.consentRequired && application.clientScopesGranted.length > 0) ||
                                        application.additionalGrants.length > 0;

                                    return (
                                        <tr key={application.client.clientId}>
                                            <td>
                                                <div className="account-application-cell">
                                                    {application.effectiveUrl ? (
                                                        <a href={application.effectiveUrl} className="kt-link account-application-link">
                                                            {appLabel}
                                                        </a>
                                                    ) : (
                                                        <span className="account-application-link">{appLabel}</span>
                                                    )}
                                                    <span className="account-application-client-id">{application.client.clientId}</span>
                                                </div>
                                            </td>

                                            <td>{renderAvailableRoles(application, advancedMsg, msg("inResource"))}</td>

                                            <td>
                                                {application.client.consentRequired ? (
                                                    <div className="account-permission-list">
                                                        {application.clientScopesGranted.map(scope => (
                                                            <span key={scope} className="account-permission-pill">
                                                                {advancedMsg(scope)}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="account-permission-pill is-strong">{msg("fullAccess")}</span>
                                                )}
                                            </td>

                                            <td>
                                                {application.additionalGrants.length > 0 ? (
                                                    <div className="account-permission-list">
                                                        {application.additionalGrants.map(grant => (
                                                            <span key={grant} className="account-permission-pill">
                                                                {advancedMsg(grant)}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="account-empty-inline">-</span>
                                                )}
                                            </td>

                                            <td>
                                                {showRevokeButton ? (
                                                    <button
                                                        type="submit"
                                                        className="kt-btn kt-btn-outline"
                                                        id={`revoke-${application.client.clientId}`}
                                                        name="clientId"
                                                        value={application.client.id}
                                                    >
                                                        {msg("revoke")}
                                                    </button>
                                                ) : (
                                                    <span className="account-empty-inline">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </form>
            </section>
        </Template>
    );
}

function renderAvailableRoles(
    application: Extract<KcContext, { pageId: "applications.ftl" }>['applications']['applications'][number],
    advancedMsg: (messageKey: string) => ReactNode,
    inResourceLabel: ReactNode
) {
    const realmRoles = isArrayWithEmptyObject(application.realmRolesAvailable)
        ? []
        : application.realmRolesAvailable.map(role => (
              <span key={`realm-${role.name}`} className="account-permission-pill">
                  {role.description ? advancedMsg(role.description) : advancedMsg(role.name)}
              </span>
          ));

    const resourceRoles = Object.entries(application.resourceRolesAvailable).flatMap(([resourceKey, roles]) =>
        roles.map(role => (
            <span key={`${resourceKey}-${role.clientId}-${role.roleName}`} className="account-permission-pill">
                {role.roleDescription ? advancedMsg(role.roleDescription) : advancedMsg(role.roleName)} {inResourceLabel}{" "}
                <strong>{role.clientName ? advancedMsg(role.clientName) : role.clientId}</strong>
            </span>
        ))
    );

    if (realmRoles.length === 0 && resourceRoles.length === 0) {
        return <span className="account-empty-inline">-</span>;
    }

    return <div className="account-permission-list">{[...realmRoles, ...resourceRoles]}</div>;
}

function isArrayWithEmptyObject(variable: unknown): boolean {
    return Array.isArray(variable) && variable.length === 1 && typeof variable[0] === "object" && variable[0] !== null && Object.keys(variable[0]).length === 0;
}