import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/account/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function Totp(props: PageProps<Extract<KcContext, { pageId: "totp.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, classes, Template } = props;
    const { totp, mode, url, messagesPerField, stateChecker } = kcContext;
    const { msg, advancedMsg } = i18n;

    return (
        <Template {...{ kcContext, i18n, doUseDefaultCss, classes }} active="totp">
            <section className="account-data-section">
                <div className="account-card-form__header">
                    <div>
                        <p className="account-card-form__eyebrow">{msg("totpEyebrow")}</p>
                        <h2 className="account-card-form__title">{msg("authenticatorTitle")}</h2>
                        <p className="account-card-form__description">
                            Register a one-time password app for stronger sign-in protection and device-based verification.
                        </p>
                    </div>

                    {!totp.enabled && (
                        <div className="account-card-form__meta">
                            <span className="account-card-form__required-pill">
                                <span className="required">*</span>
                                <span>{msg("requiredFields")}</span>
                            </span>
                        </div>
                    )}
                </div>

                {totp.enabled ? (
                    <div className="account-data-section__body">
                        <div className="account-data-section__summary">
                            <p className="account-data-section__description">Configured authenticators remain available until you remove them from this account.</p>
                        </div>

                        <div className="account-credential-list">
                            {totp.otpCredentials.map((credential, index) => (
                                <article key={credential.id} className="account-credential-card">
                                    <div className="account-credential-card__body">
                                        <h3 className="account-credential-card__title">{credential.userLabel || msg("mobile")}</h3>
                                        <dl className="account-credential-card__meta">
                                            <div>
                                                <dt>{msg("mobile")}</dt>
                                                <dd>{msg("mobile")}</dd>
                                            </div>
                                            {totp.otpCredentials.length > 1 && (
                                                <div>
                                                    <dt>ID</dt>
                                                    <dd>{credential.id}</dd>
                                                </div>
                                            )}
                                        </dl>
                                    </div>

                                    <form action={url.totpUrl} method="post" className="account-credential-card__actions">
                                        <input type="hidden" id={`stateChecker-${credential.id}`} name="stateChecker" value={stateChecker} />
                                        <input type="hidden" id={`submitAction-${credential.id}`} name="submitAction" value="Delete" />
                                        <input type="hidden" id={`credentialId-${credential.id}`} name="credentialId" value={credential.id} />
                                        <button id={`remove-mobile-${index}`} type="submit" className="kt-btn kt-btn-outline">
                                            {msg("doRemove")}
                                        </button>
                                    </form>
                                </article>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="account-data-section__body">
                        <ol className="account-totp-steps">
                            <li>
                                <p>{msg("totpStep1")}</p>
                                <ul className="account-totp-app-list">
                                    {totp.supportedApplications?.map(application => <li key={application}>{advancedMsg(application)}</li>)}
                                </ul>
                            </li>

                            {mode === "manual" ? (
                                <>
                                    <li>
                                        <p>{msg("totpManualStep2")}</p>
                                        <code className="account-totp-secret">{totp.totpSecretEncoded}</code>
                                        <a href={totp.qrUrl} id="mode-barcode" className="kt-link">
                                            {msg("totpScanBarcode")}
                                        </a>
                                    </li>

                                    <li>
                                        <p>{msg("totpManualStep3")}</p>
                                        <ul className="account-totp-detail-list">
                                            <li id="kc-totp-type">
                                                <strong>{msg("totpType")}</strong>: {msg(`totp.${totp.policy.type}`)}
                                            </li>
                                            <li id="kc-totp-algorithm">
                                                <strong>{msg("totpAlgorithm")}</strong>: {totp.policy.getAlgorithmKey()}
                                            </li>
                                            <li id="kc-totp-digits">
                                                <strong>{msg("totpDigits")}</strong>: {totp.policy.digits}
                                            </li>
                                            {totp.policy.type === "totp" ? (
                                                <li id="kc-totp-period">
                                                    <strong>{msg("totpInterval")}</strong>: {totp.policy.period}
                                                </li>
                                            ) : (
                                                <li id="kc-totp-counter">
                                                    <strong>{msg("totpCounter")}</strong>: {totp.policy.initialCounter}
                                                </li>
                                            )}
                                        </ul>
                                    </li>
                                </>
                            ) : (
                                <li>
                                    <p>{msg("totpStep2")}</p>
                                    <img
                                        id="kc-totp-secret-qr-code"
                                        src={`data:image/png;base64, ${totp.totpSecretQrCode}`}
                                        alt="Authenticator QR code"
                                        className="account-totp-qr"
                                    />
                                    <a href={totp.manualUrl} id="mode-manual" className="kt-link">
                                        {msg("totpUnableToScan")}
                                    </a>
                                </li>
                            )}

                            <li>
                                <p>{msg("totpStep3")}</p>
                                <p>{msg("totpStep3DeviceName")}</p>
                            </li>
                        </ol>

                        <form action={url.totpUrl} method="post" className="account-card-form__body">
                            <input type="hidden" id="stateChecker" name="stateChecker" value={stateChecker} />
                            <input type="hidden" id="totpSecret" name="totpSecret" value={totp.totpSecret} />
                            {mode && <input type="hidden" id="mode" name="mode" value={mode} />}

                            <div className="account-card-form__grid">
                                <div className={clsx("account-card-form__field", messagesPerField.existsError("totp") && "has-error")}>
                                    <label htmlFor="totp" className="kt-form-label account-card-form__label">
                                        <span>{msg("authenticatorCode")}</span>
                                        <span className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="totp"
                                        name="totp"
                                        autoComplete="off"
                                        className="kt-input account-card-form__input"
                                        aria-invalid={messagesPerField.existsError("totp")}
                                    />
                                    {messagesPerField.existsError("totp") && (
                                        <span className="account-field-error" aria-live="polite">
                                            <i className="ki-filled ki-information-2 text-sm" aria-hidden="true" />
                                            <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.get("totp")) }} />
                                        </span>
                                    )}
                                </div>

                                <div className={clsx("account-card-form__field", messagesPerField.existsError("userLabel") && "has-error")}>
                                    <label htmlFor="userLabel" className="kt-form-label account-card-form__label">
                                        <span>{msg("totpDeviceName")}</span>
                                        {totp.otpCredentials.length >= 1 && <span className="required">*</span>}
                                    </label>
                                    <input
                                        type="text"
                                        id="userLabel"
                                        name="userLabel"
                                        autoComplete="off"
                                        className="kt-input account-card-form__input"
                                        aria-invalid={messagesPerField.existsError("userLabel")}
                                    />
                                    {messagesPerField.existsError("userLabel") && (
                                        <span className="account-field-error" aria-live="polite">
                                            <i className="ki-filled ki-information-2 text-sm" aria-hidden="true" />
                                            <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.get("userLabel")) }} />
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="account-card-form__actions">
                                <div className="account-card-form__actions-right">
                                    <button type="submit" className="kt-btn kt-btn-outline" id="cancelTOTPBtn" name="submitAction" value="Cancel">
                                        {msg("doCancel")}
                                    </button>
                                    <button type="submit" className="kt-btn kt-btn-primary" id="saveTOTPBtn">
                                        {msg("doSave")}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </section>
        </Template>
    );
}