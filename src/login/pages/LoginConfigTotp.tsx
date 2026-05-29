import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { logoSrc } from "../assets";

export default function LoginConfigTotp(props: PageProps<Extract<KcContext, { pageId: "login-config-totp.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, isAppInitiatedAction, totp, mode, messagesPerField } = kcContext;
    const { msg, msgStr, advancedMsg } = i18n;

    const [isSubmitting, setIsSubmitting] = useState(false);

    const hasOtpError      = messagesPerField.existsError("totp");
    const hasLabelError    = messagesPerField.existsError("userLabel");
    const isManual         = mode === "manual";


    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("loginTotpTitle")}
            displayMessage={!hasOtpError && !hasLabelError}
        >
            <div className="flex flex-col gap-6">
                {/* Logo */}
                <div className="flex justify-center">
                    <img src={logoSrc} alt="Logo" className="h-8" />
                </div>

                {/* Title */}
                <div className="text-center">
                    <h3 className="text-lg font-medium text-mono leading-none mb-1">
                        {msg("loginTotpTitle")}
                    </h3>
                </div>

                {/* Step 1 — Install app */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center size-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">1</span>
                        <p className="text-sm font-medium text-mono">{msg("loginTotpStep1")}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 ms-8">
                        {totp.supportedApplications.map(app => (
                            <span key={app} className="inline-flex items-center px-2.5 py-1 rounded-md bg-muted text-xs font-medium text-secondary-foreground border border-border">
                                {advancedMsg(app)}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Step 2 — QR code or manual key */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center size-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">2</span>
                        <p className="text-sm font-medium text-mono">
                            {isManual ? msg("loginTotpManualStep2") : msg("loginTotpStep2")}
                        </p>
                    </div>

                    {isManual ? (
                        /* Manual secret key */
                        <div className="ms-8 flex flex-col gap-2">
                            <div className="rounded-lg border border-border bg-muted/60 p-3 text-center">
                                <span id="kc-totp-secret-key" className="font-mono text-sm font-medium text-mono tracking-widest break-all">
                                    {totp.totpSecretEncoded}
                                </span>
                            </div>
                            <a href={totp.qrUrl} id="mode-barcode" className="text-xs kt-link text-center">
                                {msg("loginTotpScanBarcode")}
                            </a>
                        </div>
                    ) : (
                        /* QR code */
                        <div className="ms-8 flex flex-col items-center gap-2">
                            <div className="rounded-xl border border-border p-3 bg-white inline-block">
                                <img
                                    id="kc-totp-secret-qr-code"
                                    src={`data:image/png;base64, ${totp.totpSecretQrCode}`}
                                    alt="QR Code"
                                    className="size-36"
                                />
                            </div>
                            <a href={totp.manualUrl} id="mode-manual" className="text-xs kt-link">
                                {msg("loginTotpUnableToScan")}
                            </a>
                        </div>
                    )}
                </div>

                {/* Step 3 (manual only) — policy details */}
                {isManual && (
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center size-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">3</span>
                            <p className="text-sm font-medium text-mono">{msg("loginTotpManualStep3")}</p>
                        </div>
                        <div className="ms-8 rounded-lg border border-border divide-y divide-border text-sm">
                            <div className="flex justify-between px-3 py-2">
                                <span className="text-secondary-foreground">{msg("loginTotpType")}</span>
                                <span id="kc-totp-type" className="font-medium text-mono">{msg(`loginTotp.${totp.policy.type}` as Parameters<typeof msg>[0])}</span>
                            </div>
                            <div className="flex justify-between px-3 py-2">
                                <span className="text-secondary-foreground">{msg("loginTotpAlgorithm")}</span>
                                <span id="kc-totp-algorithm" className="font-medium text-mono">{totp.policy.getAlgorithmKey()}</span>
                            </div>
                            <div className="flex justify-between px-3 py-2">
                                <span className="text-secondary-foreground">{msg("loginTotpDigits")}</span>
                                <span id="kc-totp-digits" className="font-medium text-mono">{totp.policy.digits}</span>
                            </div>
                            {totp.policy.type === "totp" ? (
                                <div className="flex justify-between px-3 py-2">
                                    <span className="text-secondary-foreground">{msg("loginTotpInterval")}</span>
                                    <span id="kc-totp-period" className="font-medium text-mono">{totp.policy.period}s</span>
                                </div>
                            ) : (
                                <div className="flex justify-between px-3 py-2">
                                    <span className="text-secondary-foreground">{msg("loginTotpCounter")}</span>
                                    <span id="kc-totp-counter" className="font-medium text-mono">{totp.policy.initialCounter}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Form — enter code + device name */}
                <form
                    action={url.loginAction}
                    id="kc-totp-settings-form"
                    method="post"
                    className="flex flex-col gap-4"
                    onSubmit={() => { setIsSubmitting(true); return true; }}
                >
                    <div className="flex items-center gap-2 -mb-1">
                        <span className="flex items-center justify-center size-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
                            {isManual ? "4" : "3"}
                        </span>
                        <p className="text-sm font-medium text-mono">{msg("loginTotpStep3")}</p>
                    </div>

                    {/* OTP code */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="totp" className="kt-form-label font-normal text-mono">
                            {msg("authenticatorCode")} <span className="text-destructive">*</span>
                        </label>
                        <input
                            id="totp"
                            name="totp"
                            type="text"
                            autoComplete="off"
                            autoFocus
                            inputMode="numeric"
                            placeholder="• • • • • •"
                            className="kt-input text-center tracking-[0.5em] text-lg font-medium"
                            aria-invalid={hasOtpError}
                            aria-describedby={hasOtpError ? "input-error-otp-code" : undefined}
                        />
                        {hasOtpError && (
                            <span
                                id="input-error-otp-code"
                                className="auth-error flex items-start gap-1.5 text-xs text-destructive mt-1"
                                role="alert"
                                aria-live="polite"
                            >
                                <i className="ki-filled ki-information-2 text-sm shrink-0 mt-px" />
                                <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.get("totp")) }} />
                            </span>
                        )}
                        <input type="hidden" id="totpSecret" name="totpSecret" value={totp.totpSecret} />
                        {mode && <input type="hidden" id="mode" name="mode" value={mode} />}
                    </div>

                    {/* Device name */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="userLabel" className="kt-form-label font-normal text-mono">
                            {msg("loginTotpDeviceName")}
                            {totp.otpCredentials.length >= 1 && <span className="text-destructive ms-1">*</span>}
                        </label>
                        <input
                            id="userLabel"
                            name="userLabel"
                            type="text"
                            autoComplete="off"
                            placeholder={msgStr("loginTotpDeviceName")}
                            className="kt-input"
                            aria-invalid={hasLabelError}
                            aria-describedby={hasLabelError ? "input-error-otp-label" : undefined}
                        />
                        {hasLabelError && (
                            <span
                                id="input-error-otp-label"
                                className="auth-error flex items-start gap-1.5 text-xs text-destructive mt-1"
                                role="alert"
                                aria-live="polite"
                            >
                                <i className="ki-filled ki-information-2 text-sm shrink-0 mt-px" />
                                <span dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.get("userLabel")) }} />
                            </span>
                        )}
                    </div>

                    {/* Logout other sessions */}
                    <label className="kt-label flex items-center gap-2 cursor-pointer rounded-md px-0.5 py-1">
                        <input
                            type="checkbox"
                            id="logout-sessions"
                            name="logout-sessions"
                            value="on"
                            defaultChecked
                            className="kt-checkbox kt-checkbox-sm"
                        />
                        <span className="kt-checkbox-label text-sm">{msg("logoutOtherSessions")}</span>
                    </label>

                    {/* Submit */}
                    <div className="auth-action-row">
                        <button
                            type="submit"
                            id="saveTOTPBtn"
                            className="kt-btn kt-btn-primary flex justify-center grow transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                            aria-busy={isSubmitting}
                        >
                            {isSubmitting && <i className="ki-filled ki-loading animate-spin me-2" />}
                            {msgStr("doSubmit")}
                        </button>
                        {isAppInitiatedAction && (
                            <button
                                type="submit"
                                id="cancelTOTPBtn"
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
