import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/account/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function Account(props: PageProps<Extract<KcContext, { pageId: "account.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, classes, Template } = props;
    const { url, realm, account, stateChecker, referrer, messagesPerField } = kcContext;
    const { msg, msgStr } = i18n;

    type AccountField = {
        id: "username" | "email" | "firstName" | "lastName";
        label: string;
        value: string;
        required: boolean;
        disabled: boolean;
    };

    const fields = [
        !realm.registrationEmailAsUsername
            ? {
                  id: "username",
                  label: msgStr("username"),
                  value: account.username ?? "",
                  required: realm.editUsernameAllowed,
                  disabled: !realm.editUsernameAllowed
              }
            : null,
        {
            id: "email",
            label: msgStr("email"),
            value: account.email ?? "",
            required: true,
            disabled: false
        },
        {
            id: "firstName",
            label: msgStr("firstName"),
            value: account.firstName ?? "",
            required: true,
            disabled: false
        },
        {
            id: "lastName",
            label: msgStr("lastName"),
            value: account.lastName ?? "",
            required: true,
            disabled: false
        }
    ].filter((field): field is AccountField => field !== null);

    return (
        <Template {...{ kcContext, i18n, doUseDefaultCss, classes }} active="account">
            <section className="account-card-form">
                <div className="account-card-form__header">
                    <div>
                        <p className="account-card-form__eyebrow">{msg("accountEyebrow")}</p>
                        <h2 className="account-card-form__title">{msg("editAccountHtmlTitle")}</h2>
                        <p className="account-card-form__description">Update your profile details used across your Keycloak workspace and connected applications.</p>
                    </div>

                    <div className="account-card-form__meta">
                        <span className="account-card-form__required-pill">
                            <span className="required">*</span>
                            <span>{msg("requiredFields")}</span>
                        </span>
                    </div>
                </div>

                <form action={url.accountUrl} method="post" className="account-card-form__body">
                    <input type="hidden" id="stateChecker" name="stateChecker" value={stateChecker} />

                    <div className="account-card-form__grid">
                        {fields.map(field => {
                            const hasError = messagesPerField.exists(field.id);
                            const errorId = `${field.id}-error`;

                            return (
                                <div key={field.id} className={clsx("account-card-form__field", hasError && "has-error")}>
                                    <label htmlFor={field.id} className="kt-form-label account-card-form__label">
                                        <span>{field.label}</span>
                                        {field.required && <span className="required">*</span>}
                                    </label>

                                    <input
                                        id={field.id}
                                        name={field.id}
                                        type={field.id === "email" ? "email" : "text"}
                                        className="kt-input account-card-form__input"
                                        defaultValue={field.value}
                                        disabled={field.disabled}
                                        autoComplete={field.id === "email" ? "email" : field.id === "username" ? "username" : field.id === "firstName" ? "given-name" : "family-name"}
                                        aria-invalid={hasError}
                                        aria-describedby={hasError ? errorId : undefined}
                                    />

                                    {hasError && (
                                        <span id={errorId} className="account-field-error" aria-live="polite">
                                            <i className="ki-filled ki-information-2 text-sm" aria-hidden="true" />
                                            <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.get(field.id)) }} />
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="account-card-form__actions">
                        {referrer?.url && (
                            <a href={referrer.url} className="kt-btn kt-btn-outline">
                                {msg("backToApplication")}
                            </a>
                        )}

                        <div className="account-card-form__actions-right">
                            <button type="submit" className="kt-btn kt-btn-outline" name="submitAction" value="Cancel" formNoValidate>
                                {msg("doCancel")}
                            </button>
                            <button type="submit" className="kt-btn kt-btn-primary" name="submitAction" value="Save">
                                {msg("doSave")}
                            </button>
                        </div>
                    </div>
                </form>
            </section>
        </Template>
    );
}
