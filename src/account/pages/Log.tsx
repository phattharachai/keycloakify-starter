import type { PageProps } from "keycloakify/account/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function Log(props: PageProps<Extract<KcContext, { pageId: "log.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, classes, Template } = props;
    const { log } = kcContext;
    const { msg } = i18n;

    const events = log.events ?? [];

    return (
        <Template {...{ kcContext, i18n, doUseDefaultCss, classes }} active="log">
            <section className="account-data-section">
                <div className="account-card-form__header">
                    <div>
                        <p className="account-card-form__eyebrow">{msg("logEyebrow")}</p>
                        <h2 className="account-card-form__title">{msg("accountLogHtmlTitle")}</h2>
                        <p className="account-card-form__description">
                            Recent authentication and account events recorded for this user. Useful for spotting unfamiliar activity.
                        </p>
                    </div>

                    <div className="account-card-form__meta">
                        <span className="account-card-form__required-pill">{events.length} events</span>
                    </div>
                </div>

                <div className="account-data-section__body">
                    {events.length === 0 ? (
                        <div className="account-empty-state">
                            <i className="ki-filled ki-time" aria-hidden="true" />
                            <p>No account activity has been recorded yet.</p>
                        </div>
                    ) : (
                        <div className="account-table-shell">
                            <table className="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>{msg("date")}</th>
                                        <th>{msg("event")}</th>
                                        <th>{msg("ip")}</th>
                                        <th>{msg("client")}</th>
                                        <th>{msg("details")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.map((event, index) => (
                                        <tr key={`${event.date}-${index}`}>
                                            <td>{event.date ? new Date(event.date).toLocaleString() : ""}</td>
                                            <td>
                                                <span className="account-permission-pill">{event.event}</span>
                                            </td>
                                            <td>{event.ipAddress}</td>
                                            <td>
                                                {event.client ? (
                                                    <span className="account-application-link">{event.client}</span>
                                                ) : (
                                                    <span className="account-empty-inline">-</span>
                                                )}
                                            </td>
                                            <td>
                                                {event.details.length > 0 ? (
                                                    <div className="account-permission-list">
                                                        {event.details.map((detail, detailIndex) => (
                                                            <span key={`${detail.key}-${detailIndex}`} className="account-permission-pill">
                                                                <strong>{detail.key}</strong>
                                                                <span aria-hidden="true">=</span>
                                                                <span>{detail.value}</span>
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="account-empty-inline">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>
        </Template>
    );
}
