import { clsx } from "keycloakify/tools/clsx";
import { useIsPasswordRevealed } from "keycloakify/tools/useIsPasswordRevealed";
import type { I18n } from "../i18n";

interface PasswordInputProps {
    id: string;
    name: string;
    placeholder?: string;
    autoFocus?: boolean;
    autoComplete?: string;
    hasError?: boolean;
    errorId?: string;
    i18n: I18n;
}

export function PasswordInput({ id, name, placeholder, autoFocus, autoComplete, hasError, errorId, i18n }: PasswordInputProps) {
    const { msgStr } = i18n;
    const { isPasswordRevealed, toggleIsPasswordRevealed } = useIsPasswordRevealed({ passwordInputId: id });

    return (
        <div className="auth-password-input">
            <input
                id={id}
                name={name}
                type={isPasswordRevealed ? "text" : "password"}
                placeholder={placeholder}
                autoFocus={autoFocus}
                autoComplete={autoComplete}
                aria-invalid={hasError}
                aria-describedby={hasError && errorId ? errorId : undefined}
            />
            <button
                type="button"
                className="auth-password-toggle"
                aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
                aria-controls={id}
                onClick={toggleIsPasswordRevealed}
            >
                <i className={clsx("ki-filled", isPasswordRevealed ? "ki-eye-slash" : "ki-eye")} />
            </button>
        </div>
    );
}
