import { Suspense, lazy } from "react";
import type { ClassKey } from "keycloakify/login";
import type { KcContext } from "./KcContext";
import { useI18n } from "./i18n";
import DefaultPage from "keycloakify/login/DefaultPage";
import Template from "./Template";

const UserProfileFormFields = lazy(() => import("./UserProfileFormFields"));

// Registration
const Register = lazy(() => import("./pages/Register"));

// Core login pages
const Login = lazy(() => import("./pages/Login"));
const LoginPassword = lazy(() => import("./pages/LoginPassword"));
const LoginUsername = lazy(() => import("./pages/LoginUsername"));

// Password management
const LoginResetPassword = lazy(() => import("./pages/LoginResetPassword"));
const LoginUpdatePassword = lazy(() => import("./pages/LoginUpdatePassword"));

// Email verification
const LoginVerifyEmail = lazy(() => import("./pages/LoginVerifyEmail"));
const UpdateEmail = lazy(() => import("./pages/UpdateEmail"));

// OTP / MFA
const LoginOtp = lazy(() => import("./pages/LoginOtp"));
const LoginResetOtp = lazy(() => import("./pages/LoginResetOtp"));
const LoginRecoveryAuthnCodeInput = lazy(() => import("./pages/LoginRecoveryAuthnCodeInput"));

// WebAuthn / Passkeys
const WebauthnAuthenticate = lazy(() => import("./pages/WebauthnAuthenticate"));
const WebauthnError = lazy(() => import("./pages/WebauthnError"));
const WebauthnRegister = lazy(() => import("./pages/WebauthnRegister"));

// Identity provider linking
const LinkIdpAction = lazy(() => import("./pages/LinkIdpAction"));
const IdpReviewUserProfile = lazy(() => import("./pages/IdpReviewUserProfile"));
const LoginIdpLinkConfirm = lazy(() => import("./pages/LoginIdpLinkConfirm"));
const LoginIdpLinkConfirmOverride = lazy(() => import("./pages/LoginIdpLinkConfirmOverride"));
const LoginIdpLinkEmail = lazy(() => import("./pages/LoginIdpLinkEmail"));

// OAuth2 / Device
const LoginOauth2DeviceVerifyUserCode = lazy(() => import("./pages/LoginOauth2DeviceVerifyUserCode"));
const Code = lazy(() => import("./pages/Code"));
const SamlPostForm = lazy(() => import("./pages/SamlPostForm"));

// Info / error
const Error = lazy(() => import("./pages/Error"));
const Info  = lazy(() => import("./pages/Info"));
const LoginPageExpired = lazy(() => import("./pages/LoginPageExpired"));
const FrontchannelLogout = lazy(() => import("./pages/FrontchannelLogout"));
const DeleteAccountConfirm = lazy(() => import("./pages/DeleteAccountConfirm"));
const DeleteCredential = lazy(() => import("./pages/DeleteCredential"));
const LogoutConfirm = lazy(() => import("./pages/LogoutConfirm"));

// MFA setup & recovery
const LoginConfigTotp = lazy(() => import("./pages/LoginConfigTotp"));
const LoginRecoveryAuthnCodeConfig = lazy(() => import("./pages/LoginRecoveryAuthnCodeConfig"));

// Passkeys
const LoginPasskeysConditionalAuthenticate = lazy(() => import("./pages/LoginPasskeysConditionalAuthenticate"));
const SelectAuthenticator = lazy(() => import("./pages/SelectAuthenticator"));
const SelectOrganization = lazy(() => import("./pages/SelectOrganization"));

// OAuth consent & certificate
const LoginOauthGrant = lazy(() => import("./pages/LoginOauthGrant"));
const LoginX509Info   = lazy(() => import("./pages/LoginX509Info"));

// Profile
const LoginUpdateProfile = lazy(() => import("./pages/LoginUpdateProfile"));
const Terms = lazy(() => import("./pages/Terms"));

const doMakeUserConfirmPassword = true;
const doUseDefaultCss = false;

export default function KcPage(props: { kcContext: KcContext }) {
    const { kcContext } = props;
    const { i18n } = useI18n({ kcContext });

    return (
        <Suspense>
            {(() => {
                switch (kcContext.pageId) {
                    case "register.ftl":
                        return <Register kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} UserProfileFormFields={UserProfileFormFields} doMakeUserConfirmPassword={doMakeUserConfirmPassword} />;
                    case "login.ftl":
                        return <Login kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} />;
                    case "login-password.ftl":
                        return <LoginPassword kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} />;
                    case "login-reset-password.ftl":
                        return <LoginResetPassword kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} />;
                    case "login-verify-email.ftl":
                        return <LoginVerifyEmail kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} />;
                    case "update-email.ftl":
                        return <UpdateEmail kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} UserProfileFormFields={UserProfileFormFields} doMakeUserConfirmPassword={doMakeUserConfirmPassword} />;
                    case "login-update-password.ftl":
                        return <LoginUpdatePassword kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} />;
                    case "login-otp.ftl":
                        return <LoginOtp kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} />;
                    case "login-username.ftl":
                        return <LoginUsername kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} />;
                    case "login-reset-otp.ftl":
                        return <LoginResetOtp kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} />;
                    case "login-recovery-authn-code-input.ftl":
                        return <LoginRecoveryAuthnCodeInput kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} />;
                    case "webauthn-authenticate.ftl":
                        return <WebauthnAuthenticate kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} />;
                    case "webauthn-error.ftl":
                        return <WebauthnError kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} />;
                    case "webauthn-register.ftl":
                        return <WebauthnRegister kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} />;
                    case "link-idp-action.ftl":
                        return <LinkIdpAction kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} />;
                    case "idp-review-user-profile.ftl":
                        return <IdpReviewUserProfile kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} UserProfileFormFields={UserProfileFormFields} doMakeUserConfirmPassword={doMakeUserConfirmPassword} />;
                    case "login-idp-link-confirm.ftl":
                        return <LoginIdpLinkConfirm kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} />;
                    case "login-idp-link-confirm-override.ftl":
                        return <LoginIdpLinkConfirmOverride kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} />;
                    case "login-idp-link-email.ftl":
                        return <LoginIdpLinkEmail kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} />;
                    case "login-oauth2-device-verify-user-code.ftl":
                        return <LoginOauth2DeviceVerifyUserCode kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} />;
                    case "code.ftl":
                        return <Code kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} />;
                    case "saml-post-form.ftl":
                        return <SamlPostForm kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} />;
                    case "error.ftl":
                        return <Error kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} />;
                    case "info.ftl":
                        return <Info kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} />;
                    case "login-page-expired.ftl":
                        return <LoginPageExpired kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} />;
                    case "frontchannel-logout.ftl":
                        return <FrontchannelLogout kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} />;
                    case "delete-account-confirm.ftl":
                        return <DeleteAccountConfirm kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} />;
                    case "delete-credential.ftl":
                        return <DeleteCredential kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} />;
                    case "logout-confirm.ftl":
                        return <LogoutConfirm kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} />;
                    case "login-config-totp.ftl":
                        return <LoginConfigTotp kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} />;
                    case "login-recovery-authn-code-config.ftl":
                        return <LoginRecoveryAuthnCodeConfig kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} />;
                    case "login-passkeys-conditional-authenticate.ftl":
                        return <LoginPasskeysConditionalAuthenticate kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} />;
                    case "select-authenticator.ftl":
                        return <SelectAuthenticator kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} />;
                    case "select-organization.ftl":
                        return <SelectOrganization kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} />;
                    case "login-oauth-grant.ftl":
                        return <LoginOauthGrant kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} />;
                    case "login-x509-info.ftl":
                        return <LoginX509Info kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} />;
                    case "login-update-profile.ftl":
                        return <LoginUpdateProfile kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} UserProfileFormFields={UserProfileFormFields} doMakeUserConfirmPassword={doMakeUserConfirmPassword} />;
                    case "terms.ftl":
                        return <Terms kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={doUseDefaultCss} />;
                    default:
                        return (
                            <DefaultPage
                                kcContext={kcContext}
                                i18n={i18n}
                                classes={classes}
                                Template={Template}
                                doUseDefaultCss={doUseDefaultCss}
                                UserProfileFormFields={UserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        );
                }
            })()}
        </Suspense>
    );
}

const classes = {} satisfies { [key in ClassKey]?: string };
