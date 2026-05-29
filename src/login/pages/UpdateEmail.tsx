import { useState } from "react";
import type { JSX } from "keycloakify/tools/JSX";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { logoSrc } from "../assets";

type Props = PageProps<Extract<KcContext, { pageId: "update-email.ftl" }>, I18n> & {
    UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
    doMakeUserConfirmPassword: boolean;
};

const profileClasses = {
    kcFormGroupClass:                       "flex flex-col gap-1.5 mb-4",
    kcFormGroupHeader:                      "text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border pb-2 mb-1",
    kcContentWrapperClass:                  "",
    kcLabelWrapperClass:                    "flex items-baseline gap-0.5",
    kcLabelClass:                           "kt-form-label font-medium text-mono",
    kcInputWrapperClass:                    "flex flex-col gap-1",
    kcInputClass:                           "kt-input",
    kcInputGroup:                           "auth-password-input",
    kcTextareaClass:                        "kt-input min-h-[80px] resize-y",
    kcInputErrorMessageClass:               "auth-error flex items-start gap-1.5 text-xs text-destructive mt-1",
    kcInputHelperTextBeforeClass:           "auth-helper text-xs mb-1",
    kcInputHelperTextAfterClass:            "auth-helper text-xs mt-0.5",
    kcFormPasswordVisibilityButtonClass:    "auth-password-toggle",
    kcFormPasswordVisibilityIconHide:       "ki-filled ki-eye-slash text-muted-foreground",
    kcFormPasswordVisibilityIconShow:       "ki-filled ki-eye text-muted-foreground",
    kcInputClassCheckbox:                   "flex items-center gap-2 rounded-md py-1",
    kcInputClassCheckboxInput:              "kt-checkbox kt-checkbox-sm",
    kcInputClassCheckboxLabel:              "text-sm text-mono",
    kcInputClassRadio:                      "flex items-center gap-2 rounded-md py-1",
    kcInputClassRadioInput:                 "kt-radio",
    kcInputClassRadioLabel:                 "text-sm text-mono",
    kcInputClassRadioCheckboxLabelDisabled: "opacity-60 cursor-not-allowed"
} as const;

export default function UpdateEmail(props: Props) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes, UserProfileFormFields, doMakeUserConfirmPassword } = props;
    const { msg, msgStr } = i18n;
    const { url, messagesPerField, isAppInitiatedAction } = kcContext;
    const [isFormSubmittable, setIsFormSubmittable] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes: { ...profileClasses, ...classes } });

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={messagesPerField.exists("global")}
            headerNode={msg("updateEmailTitle")}
        >
            <div className="flex flex-col gap-4">
                <div className="flex justify-center">
                    <img src={logoSrc} alt="Logo" className="auth-logo" />
                </div>

                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex items-center justify-center size-16 rounded-full bg-primary/10">
                        <i className="ki-filled ki-sms text-primary text-3xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-mono leading-none mb-1">{msg("updateEmailTitle")}</h3>
                        <p className="text-sm text-secondary-foreground">{msg("updateEmailTitle")}</p>
                    </div>
                </div>

                <form
                    id="kc-update-email-form"
                    action={url.loginAction}
                    method="post"
                    onSubmit={() => {
                        setIsSubmitting(true);
                        return true;
                    }}
                >
                    <UserProfileFormFields
                        kcContext={kcContext}
                        i18n={i18n}
                        kcClsx={kcClsx}
                        onIsFormSubmittableValueChange={setIsFormSubmittable}
                        doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                    />

                    <label className="kt-label mt-1 inline-flex items-start gap-2">
                        <input type="checkbox" id="logout-sessions" name="logout-sessions" value="on" defaultChecked className="kt-checkbox kt-checkbox-sm mt-0.5" />
                        <span className="kt-checkbox-label text-sm">{msg("logoutOtherSessions")}</span>
                    </label>

                    <div className="auth-action-row mt-3">
                        <button
                            type="submit"
                            disabled={!isFormSubmittable || isSubmitting}
                            aria-busy={isSubmitting}
                            className="kt-btn kt-btn-primary flex justify-center grow transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSubmitting && <i className="ki-filled ki-loading animate-spin me-2" />}
                            {msgStr("doSubmit")}
                        </button>
                        {isAppInitiatedAction && (
                            <button
                                type="submit"
                                name="cancel-aia"
                                value="true"
                                className="kt-btn kt-btn-outline flex justify-center grow transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                {msg("doCancel")}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </Template>
    );
}
