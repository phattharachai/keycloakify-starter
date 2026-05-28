import { useState } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/account/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function Password(props: PageProps<Extract<KcContext, { pageId: "password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, classes, Template } = props;
    const { url, password, account, stateChecker } = kcContext;
    const { msg, msgStr } = i18n;

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [hasBlurredNewPassword, setHasBlurredNewPassword] = useState(false);
    const [hasBlurredConfirmPassword, setHasBlurredConfirmPassword] = useState(false);

    const validateNewPassword = (candidatePassword: string) => {
        if (!password.passwordSet) {
            setNewPasswordError("");
            return;
        }

        if (candidatePassword !== "" && candidatePassword === currentPassword) {
            setNewPasswordError(msgStr("newPasswordSameAsOld"));
            return;
        }

        setNewPasswordError("");
    };

    const validateConfirmPassword = (candidateConfirmPassword: string) => {
        if (candidateConfirmPassword === "") {
            setConfirmPasswordError("");
            return;
        }

        if (candidateConfirmPassword !== newPassword) {
            setConfirmPasswordError(msgStr("passwordConfirmNotMatch"));
            return;
        }

        setConfirmPasswordError("");
    };

    return (
        <Template {...{ kcContext, i18n, doUseDefaultCss, classes }} active="password">
            <section className="account-card-form">
                <div className="account-card-form__header">
                    <div>
                        <p className="account-card-form__eyebrow">{msg("passwordEyebrow")}</p>
                        <h2 className="account-card-form__title">{msg("changePasswordHtmlTitle")}</h2>
                        <p className="account-card-form__description">Keep your workspace secure by choosing a strong password and confirming it before saving.</p>
                    </div>

                    <div className="account-card-form__meta">
                        <span className="account-card-form__required-pill">{msg("allFieldsRequired")}</span>
                    </div>
                </div>

                <form action={url.passwordUrl} method="post" className="account-card-form__body">
                    <input type="hidden" id="stateChecker" name="stateChecker" value={stateChecker} />
                    <input type="text" id="username" name="username" value={account.username ?? ""} autoComplete="username" readOnly hidden />

                    <div className="account-card-form__grid">
                        {password.passwordSet && (
                            <div className="account-card-form__field">
                                <label htmlFor="password" className="kt-form-label account-card-form__label">
                                    <span>{msg("password")}</span>
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    className="kt-input account-card-form__input"
                                    value={currentPassword}
                                    onChange={event => {
                                        const nextValue = event.target.value;
                                        setCurrentPassword(nextValue);
                                        if (hasBlurredNewPassword) {
                                            validateNewPassword(newPassword);
                                        }
                                    }}
                                />
                            </div>
                        )}

                        <div className={clsx("account-card-form__field", newPasswordError !== "" && "has-error")}>
                            <label htmlFor="password-new" className="kt-form-label account-card-form__label">
                                <span>{msg("passwordNew")}</span>
                            </label>
                            <input
                                id="password-new"
                                name="password-new"
                                type="password"
                                autoComplete="new-password"
                                className="kt-input account-card-form__input"
                                value={newPassword}
                                onChange={event => {
                                    const nextValue = event.target.value;
                                    setNewPassword(nextValue);
                                    if (hasBlurredNewPassword) {
                                        validateNewPassword(nextValue);
                                    }
                                    if (hasBlurredConfirmPassword) {
                                        validateConfirmPassword(confirmPassword);
                                    }
                                }}
                                onBlur={() => {
                                    setHasBlurredNewPassword(true);
                                    validateNewPassword(newPassword);
                                }}
                            />
                            {newPasswordError !== "" && (
                                <span className="account-field-error" aria-live="polite">
                                    <i className="ki-filled ki-information-2 text-sm" aria-hidden="true" />
                                    <span dangerouslySetInnerHTML={{ __html: kcSanitize(newPasswordError) }} />
                                </span>
                            )}
                        </div>

                        <div className={clsx("account-card-form__field", confirmPasswordError !== "" && "has-error")}>
                            <label htmlFor="password-confirm" className="kt-form-label account-card-form__label">
                                <span>{msg("passwordConfirm")}</span>
                            </label>
                            <input
                                id="password-confirm"
                                name="password-confirm"
                                type="password"
                                autoComplete="new-password"
                                className="kt-input account-card-form__input"
                                value={confirmPassword}
                                onChange={event => {
                                    const nextValue = event.target.value;
                                    setConfirmPassword(nextValue);
                                    if (hasBlurredConfirmPassword) {
                                        validateConfirmPassword(nextValue);
                                    }
                                }}
                                onBlur={() => {
                                    setHasBlurredConfirmPassword(true);
                                    validateConfirmPassword(confirmPassword);
                                }}
                            />
                            {confirmPasswordError !== "" && (
                                <span className="account-field-error" aria-live="polite">
                                    <i className="ki-filled ki-information-2 text-sm" aria-hidden="true" />
                                    <span dangerouslySetInnerHTML={{ __html: kcSanitize(confirmPasswordError) }} />
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="account-card-form__actions">
                        <div className="account-card-form__actions-right">
                            <button
                                type="submit"
                                className="kt-btn kt-btn-primary"
                                name="submitAction"
                                value="Save"
                                disabled={newPasswordError !== "" || confirmPasswordError !== ""}
                            >
                                {msg("doSave")}
                            </button>
                        </div>
                    </div>
                </form>
            </section>
        </Template>
    );
}