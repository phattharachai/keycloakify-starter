import type { PageProps } from "keycloakify/account/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function FederatedIdentity(props: PageProps<Extract<KcContext, { pageId: "federatedIdentity.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, classes, Template } = props;
    const { url, federatedIdentity, stateChecker } = kcContext;
    const { msg, msgStr } = i18n;

    const identities = federatedIdentity.identities ?? [];
    const connectedCount = identities.filter(identity => identity.connected).length;

    return (
        <Template {...{ kcContext, i18n, doUseDefaultCss, classes }} active="social">
            <section className="account-data-section">
                <div className="account-card-form__header">
                    <div>
                        <p className="account-card-form__eyebrow">{msg("federatedIdentityEyebrow")}</p>
                        <h2 className="account-card-form__title">{msg("federatedIdentitiesHtmlTitle")}</h2>
                        <p className="account-card-form__description">
                            Connect or disconnect external identity providers used to sign in to this account.
                        </p>
                    </div>

                    <div className="account-card-form__meta">
                        <span className="account-card-form__required-pill">
                            {connectedCount} / {identities.length} {msgStr("federatedIdentity").toLowerCase()}
                        </span>
                    </div>
                </div>

                <div className="account-data-section__body">
                    <div className="account-credential-list" id="federated-identities">
                        {identities.length === 0 ? (
                            <div className="account-empty-state">
                                <i className="ki-filled ki-profile-circle" aria-hidden="true" />
                                <p>No external identity providers are available for this account.</p>
                            </div>
                        ) : identities.map(identity => {
                            const inputId = `federated-identity-${identity.providerId}`;
                            const connected = identity.connected;
                            const canRemove = connected && federatedIdentity.removeLinkPossible;

                            return (
                                <article key={identity.providerId} className="account-credential-card">
                                    <div className="account-credential-card__body">
                                        <h3 className="account-credential-card__title">
                                            <span
                                                className={
                                                    connected
                                                        ? "account-permission-pill is-strong"
                                                        : "account-permission-pill"
                                                }
                                                aria-hidden="true"
                                            >
                                                <i
                                                    className={
                                                        connected
                                                            ? "ki-filled ki-check-circle text-sm"
                                                            : "ki-filled ki-disconnect text-sm"
                                                    }
                                                />
                                            </span>
                                            <span>{identity.displayName}</span>
                                        </h3>
                                        <dl className="account-credential-card__meta">
                                            <div>
                                                <dt>{msg("username")}</dt>
                                                <dd>
                                                    <input
                                                        id={inputId}
                                                        className="kt-input"
                                                        disabled
                                                        value={identity.userName ?? ""}
                                                        aria-label={identity.displayName}
                                                    />
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>

                                    <div className="account-credential-card__actions">
                                        {canRemove ? (
                                            <form action={url.socialUrl} method="post" className="inline-flex items-center gap-2">
                                                <input type="hidden" name="stateChecker" value={stateChecker} />
                                                <input type="hidden" name="action" value="remove" />
                                                <input type="hidden" name="providerId" value={identity.providerId} />
                                                <button
                                                    id={`remove-link-${identity.providerId}`}
                                                    type="submit"
                                                    className="kt-btn kt-btn-outline"
                                                >
                                                    {msg("doRemove")}
                                                </button>
                                            </form>
                                        ) : connected ? (
                                            <button
                                                type="button"
                                                className="kt-btn kt-btn-outline"
                                                disabled
                                                aria-disabled="true"
                                            >
                                                <i className="ki-filled ki-lock text-sm me-1" aria-hidden="true" />
                                                {msg("doRemove")}
                                            </button>
                                        ) : (
                                            <form action={url.socialUrl} method="post" className="inline-flex items-center gap-2">
                                                <input type="hidden" name="stateChecker" value={stateChecker} />
                                                <input type="hidden" name="action" value="add" />
                                                <input type="hidden" name="providerId" value={identity.providerId} />
                                                <button
                                                    id={`add-link-${identity.providerId}`}
                                                    type="submit"
                                                    className="kt-btn kt-btn-primary"
                                                >
                                                    {msg("doAdd")}
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>
        </Template>
    );
}
