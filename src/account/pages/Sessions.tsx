import type { PageProps } from "keycloakify/account/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function Sessions(props: PageProps<Extract<KcContext, { pageId: "sessions.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, classes, Template } = props;
    const { url, stateChecker, sessions } = kcContext;
    const { msg } = i18n;

    return (
        <Template {...{ kcContext, i18n, doUseDefaultCss, classes }} active="sessions">
            <section className="account-data-section">
                <div className="account-card-form__header">
                    <div>
                        <p className="account-card-form__eyebrow">{msg("sessionsEyebrow")}</p>
                        <h2 className="account-card-form__title">{msg("sessionsHtmlTitle")}</h2>
                        <p className="account-card-form__description">Review active sessions across browsers and devices, then revoke them in one action if needed.</p>
                    </div>

                    <div className="account-card-form__meta">
                        <span className="account-card-form__required-pill">{sessions.sessions.length} active</span>
                    </div>
                </div>

                <div className="account-data-section__body">
                    {sessions.sessions.length === 0 ? (
                        <div className="account-empty-state">
                            <i className="ki-filled ki-shield-tick" aria-hidden="true" />
                            <p>No active sessions are currently listed for this account.</p>
                        </div>
                    ) : (
                        <div className="account-table-shell">
                            <table className="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>{msg("ip")}</th>
                                        <th>{msg("started")}</th>
                                        <th>{msg("lastAccess")}</th>
                                        <th>{msg("expires")}</th>
                                        <th>{msg("clients")}</th>
                                    </tr>
                                </thead>
                                <tbody role="rowgroup">
                                    {sessions.sessions.map((session, index) => (
                                        <tr key={`${session.ipAddress}-${index}`}>
                                            <td>{session.ipAddress}</td>
                                            <td>{session.started ? new Date(session.started).toLocaleString() : ""}</td>
                                            <td>{session.lastAccess ? new Date(session.lastAccess).toLocaleString() : ""}</td>
                                            <td>{session.expires ? new Date(session.expires).toLocaleString() : ""}</td>
                                            <td>
                                                <div className="account-session-clients">
                                                    {session.clients.map((client, clientIndex) => (
                                                        <span key={`${client}-${clientIndex}`} className="account-session-client-pill">
                                                            {client}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <form action={url.sessionsUrl} method="post" className="account-card-form__actions">
                        <input type="hidden" id="stateChecker" name="stateChecker" value={stateChecker} />
                        <div className="account-card-form__actions-right">
                            <button id="logout-all-sessions" type="submit" className="kt-btn kt-btn-outline">
                                {msg("doLogOutAllSessions")}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </Template>
    );
}
