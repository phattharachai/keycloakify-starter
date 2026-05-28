# Theme Coverage Audit

Updated: 2026-05-28 (rev 2)

## Summary

- Theme types wired in [src/kc.gen.tsx](./src/kc.gen.tsx): `login`, `account`
- Storybook runtime index: `145` stories
- Unique themed pages covered by stories: `45`
- Runtime audit result: no page-level runtime failures detected across the 45 unique pages

## Coverage Checklist

### Login Theme

Status: complete custom page coverage

- Routing: 38 explicit `pageId` cases in [src/login/KcPage.tsx](./src/login/KcPage.tsx)
- Stories: 38 page stories in [src/login/pages](./src/login/pages)
- Helper-only file: [src/login/pages/PasswordInput.tsx](./src/login/pages/PasswordInput.tsx)

Pages:

- `register.ftl`
- `login.ftl`
- `login-password.ftl`
- `login-reset-password.ftl`
- `login-verify-email.ftl`
- `update-email.ftl`
- `login-update-password.ftl`
- `login-otp.ftl`
- `login-username.ftl`
- `login-reset-otp.ftl`
- `login-recovery-authn-code-input.ftl`
- `webauthn-authenticate.ftl`
- `webauthn-error.ftl`
- `webauthn-register.ftl`
- `link-idp-action.ftl`
- `idp-review-user-profile.ftl`
- `login-idp-link-confirm.ftl`
- `login-idp-link-confirm-override.ftl`
- `login-idp-link-email.ftl`
- `login-oauth2-device-verify-user-code.ftl`
- `code.ftl`
- `saml-post-form.ftl`
- `error.ftl`
- `info.ftl`
- `login-page-expired.ftl`
- `frontchannel-logout.ftl`
- `delete-account-confirm.ftl`
- `delete-credential.ftl`
- `logout-confirm.ftl`
- `login-config-totp.ftl`
- `login-recovery-authn-code-config.ftl`
- `login-passkeys-conditional-authenticate.ftl`
- `select-authenticator.ftl`
- `select-organization.ftl`
- `login-oauth-grant.ftl`
- `login-x509-info.ftl`
- `login-update-profile.ftl`
- `terms.ftl`

Classification:

- `38/38` login pages: custom page implementation
- `38/38` login pages: Storybook coverage

### Account Theme

Status: complete custom page coverage

- Routing: 7 explicit `pageId` cases in [src/account/KcPage.tsx](./src/account/KcPage.tsx)
- Rendering strategy: local [src/account/Template.tsx](./src/account/Template.tsx) + local [src/account/account.css](./src/account/account.css) + 7 custom page components
- `ClassKey` mapping: Metronic (`kt-btn`, `kt-input`, `kt-form-label`) replacing legacy Bootstrap (`btn`, `form-control`, `control-label`)
- Stories: 7 page stories in [src/account/pages](./src/account/pages)

Pages:

- `account.ftl`
- `password.ftl`
- `totp.ftl`
- `sessions.ftl`
- `applications.ftl`
- `log.ftl`
- `federatedIdentity.ftl`

Classification:

- `7/7` account pages: custom page implementation
- `7/7` account pages: Storybook coverage

## Runtime Audit

Method:

- Storybook `index.json` used as the canonical runtime source
- One runtime pass across all unique page titles
- Additional spot checks on representative login and account pages

Result:

- `45/45` unique pages rendered without detected runtime error strings
- No page remained stuck in loading state

Validated spot checks:

- `account/account.ftl`
- `account/password.ftl`
- `account/totp.ftl`
- `account/sessions.ftl`
- `account/applications.ftl`
- `login/login.ftl`
- `login/register.ftl`
- `login/login-otp.ftl`
- `login/login-config-totp.ftl`
- `login/error.ftl`
- `login/select-authenticator.ftl`

## Findings

### Good

- Login theme has full page-by-page custom implementation instead of broad fallback usage.
- Account theme is fully reachable and themed consistently at the shell/layout level.
- Storybook currently serves all 45 unique pages successfully.
- `applications.ftl` Storybook failure was fixed by adding local mock data in [src/account/KcPageStory.tsx](./src/account/KcPageStory.tsx).

### Risks

- None outstanding at this revision.

## UX Audit Notes

### Login UX

- Overall quality is high and intentionally themed.
- Form hierarchy is clear on the checked flows.
- Critical auth journeys appear production-ready from a structural standpoint.

### Account UX

- Shell quality is strong: branding, navigation, locale switcher, sign-out, and workspace framing are consistent.
- All 7 pages now have bespoke Metronic-styled implementations (cards, pills, tables, action layouts) instead of legacy Bootstrap markup.
- Inline buttons / inputs / labels use `kt-btn`, `kt-input`, `kt-form-label` consistently across the theme.

## Recommended Next Steps

1. ~~Localize hardcoded English eyebrow labels~~ — done via `withCustomTranslations` in [src/account/i18n.ts](./src/account/i18n.ts); keys: `accountEyebrow`, `passwordEyebrow`, `totpEyebrow`, `sessionsEyebrow`, `applicationsEyebrow`, `logEyebrow`, `federatedIdentityEyebrow`.
2. ~~Format `sessions.ftl` timestamps~~ — done; `started`, `lastAccess`, `expires` all use `new Date(...).toLocaleString()` matching `log.ftl`.
3. Add a screenshot / visual regression pass against representative login and account pages after structural changes.