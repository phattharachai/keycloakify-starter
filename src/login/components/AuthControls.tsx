import { useCallback, useEffect, useId, useRef, useState } from "react";
import { clsx } from "keycloakify/tools/clsx";
import type { I18n } from "../i18n";

type ThemeMode = "light" | "dark" | "system";
type ThemeItem = {
    value: ThemeMode;
    icon: string;
    label: string;
};

const THEME_STORAGE_KEY = "keycloakify-theme";
const AUTH_CONTROLS_STYLE_ID = "auth-controls-styles";
const THEME_ITEMS: ThemeItem[] = [
    { value: "light", icon: "ki-sun", label: "Light" },
    { value: "dark", icon: "ki-moon", label: "Dark" },
    { value: "system", icon: "ki-laptop", label: "System" }
];

function applyTheme(mode: ThemeMode) {
    const root = document.documentElement;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = mode === "dark" || (mode === "system" && prefersDark);
    root.classList.toggle("dark", isDark);
}

function readStoredTheme(): ThemeMode {
    try {
        const value = localStorage.getItem(THEME_STORAGE_KEY);
        if (value === "light" || value === "dark" || value === "system") return value;
    } catch {
        // ignore (e.g. SSR or storage disabled)
    }
    return "system";
}

function getResolvedTheme(mode: ThemeMode): Exclude<ThemeMode, "system"> {
    if (mode !== "system") return mode;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getThemeIcon(mode: ThemeMode) {
    return THEME_ITEMS.find(item => item.value === mode)?.icon ?? "ki-laptop";
}

function useDropdown<T extends HTMLElement>() {
    const [open, setOpen] = useState(false);
    const ref = useRef<T | null>(null);

    useEffect(() => {
        if (!open) return;
        const onPointerDown = (event: MouseEvent | TouchEvent) => {
            if (!ref.current) return;
            if (ref.current.contains(event.target as Node)) return;
            setOpen(false);
        };
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onPointerDown);
        document.addEventListener("touchstart", onPointerDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onPointerDown);
            document.removeEventListener("touchstart", onPointerDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    return { open, setOpen, ref };
}

function AuthControlsStyles() {
    useEffect(() => {
        if (document.getElementById(AUTH_CONTROLS_STYLE_ID)) return;

        const style = document.createElement("style");
        style.id = AUTH_CONTROLS_STYLE_ID;
        style.textContent = `
            .auth-controls{position:fixed;top:max(1rem,env(safe-area-inset-top));right:max(1rem,env(safe-area-inset-right));left:auto;z-index:60;display:flex;align-items:center;gap:.5rem;direction:ltr;}
            .auth-control{position:relative;display:inline-flex;}
            .auth-control-trigger{appearance:none;display:inline-flex;align-items:center;justify-content:center;gap:.35rem;height:2.25rem;min-width:2.25rem;border:0;border-radius:999px;background:transparent;color:var(--foreground);font:inherit;font-size:.8125rem;font-weight:600;line-height:1;padding:0 .55rem;cursor:pointer;transition:background-color .16s ease,color .16s ease,box-shadow .16s ease;}
            .auth-control-trigger:hover{background:color-mix(in oklab,var(--accent) 72%,transparent);color:var(--accent-foreground);}
            .auth-control-trigger:focus-visible{outline:0;box-shadow:0 0 0 3px color-mix(in oklab,var(--ring) 35%,transparent);}
            .auth-language-trigger{text-transform:uppercase;}
            .auth-theme-trigger{width:2.25rem;padding:0;}
            .auth-theme-trigger[data-mode="system"]{color:var(--muted-foreground);}
            .auth-menu{position:absolute;top:calc(100% + .5rem);right:0;left:auto;z-index:70;min-width:8rem;max-height:min(70vh,38rem);overflow:auto;border:1px solid var(--border);border-radius:.5rem;background:var(--popover);color:var(--popover-foreground);box-shadow:0 16px 40px rgba(15,23,42,.14),0 2px 8px rgba(15,23,42,.08);padding:.35rem;}
            .dark .auth-menu{box-shadow:0 16px 40px rgba(0,0,0,.38),0 2px 8px rgba(0,0,0,.22);}
            .auth-menu-language{width:10.5rem;}
            .auth-menu-theme{width:9rem;}
            .auth-menu-item{appearance:none;display:flex;align-items:center;gap:.65rem;width:100%;min-height:2.25rem;border:0;border-radius:.375rem;background:transparent;color:inherit;font:inherit;font-size:.875rem;line-height:1.25;padding:.5rem .65rem;text-align:left;text-decoration:none;white-space:nowrap;cursor:pointer;}
            .auth-menu-item:hover,.auth-menu-item:focus-visible{outline:0;background:var(--accent);color:var(--accent-foreground);}
            .auth-menu-item-active{font-weight:600;color:var(--foreground);background:color-mix(in oklab,var(--accent) 58%,transparent);}
            .auth-menu-icon{display:inline-flex;align-items:center;justify-content:center;width:1rem;min-width:1rem;font-size:1rem;line-height:1;color:var(--muted-foreground);}
            .auth-menu-item:hover .auth-menu-icon,.auth-menu-item:focus-visible .auth-menu-icon{color:var(--accent-foreground);}
            .auth-menu-label{min-width:0;flex:1 1 auto;}
            .auth-menu-check{display:inline-flex;align-items:center;justify-content:center;width:1rem;min-width:1rem;font-size:.875rem;line-height:1;color:var(--primary);opacity:0;}
            .auth-menu-item-active .auth-menu-check{opacity:1;}
            .auth-theme-icon{font-size:1rem;line-height:1;}
            @media (max-width:420px){.auth-controls{top:.75rem;right:.75rem;gap:.25rem}.auth-menu-language{width:9.75rem}.auth-menu{max-height:min(72vh,30rem)}}
            @media (prefers-reduced-motion:reduce){.auth-control-trigger{transition:none;}}
        `;
        document.head.append(style);
    }, []);

    return null;
}

function LocaleSwitch({ i18n }: { i18n: I18n }) {
    const { currentLanguage, enabledLanguages, msgStr } = i18n;
    const { open, setOpen, ref } = useDropdown<HTMLDivElement>();
    const menuId = useId();

    if (enabledLanguages.length <= 1) return null;

    return (
        <div ref={ref} className="auth-control">
            <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={open}
                aria-controls={menuId}
                aria-label={msgStr("languages")}
                onClick={() => setOpen(o => !o)}
                className="auth-control-trigger auth-language-trigger"
            >
                <span>{currentLanguage.languageTag.toUpperCase()}</span>
            </button>
            {open && (
                <div
                    id={menuId}
                    role="menu"
                    className="auth-menu auth-menu-language"
                >
                    {enabledLanguages.map(({ languageTag, label, href }, index) => {
                        const isActive = languageTag === currentLanguage.languageTag;
                        return (
                            <a
                                key={languageTag}
                                role="menuitem"
                                id={`language-${index + 1}`}
                                href={href}
                                className={clsx(
                                    "auth-menu-item",
                                    isActive && "auth-menu-item-active"
                                )}
                            >
                                {label}
                            </a>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function ThemeToggle() {
    const { open, setOpen, ref } = useDropdown<HTMLDivElement>();
    const menuId = useId();
    const [mode, setMode] = useState<ThemeMode>(() => readStoredTheme());
    const [resolvedMode, setResolvedMode] = useState<Exclude<ThemeMode, "system">>(() => getResolvedTheme(readStoredTheme()));

    useEffect(() => {
        applyTheme(mode);
        setResolvedMode(getResolvedTheme(mode));
        try {
            localStorage.setItem(THEME_STORAGE_KEY, mode);
        } catch {
            // ignore
        }
    }, [mode]);

    useEffect(() => {
        if (mode !== "system") return;
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const onChange = () => {
            applyTheme("system");
            setResolvedMode(getResolvedTheme("system"));
        };
        media.addEventListener("change", onChange);
        return () => media.removeEventListener("change", onChange);
    }, [mode]);

    const select = useCallback((next: ThemeMode) => {
        setMode(next);
        setOpen(false);
    }, [setOpen]);

    const triggerIcon = mode === "system" ? getThemeIcon(resolvedMode) : getThemeIcon(mode);

    return (
        <div ref={ref} className="auth-control">
            <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={open}
                aria-controls={menuId}
                aria-label="Toggle theme"
                onClick={() => setOpen(o => !o)}
                className="auth-control-trigger auth-theme-trigger"
                data-mode={mode}
                title={`Theme: ${mode === "system" ? `System (${resolvedMode})` : mode}`}
            >
                <i className={clsx("ki-filled", triggerIcon, "auth-theme-icon")} aria-hidden="true" />
            </button>
            {open && (
                <div
                    id={menuId}
                    role="menu"
                    className="auth-menu auth-menu-theme"
                >
                    {THEME_ITEMS.map(item => (
                        <button
                            key={item.value}
                            type="button"
                            role="menuitemradio"
                            aria-checked={mode === item.value}
                            onClick={() => select(item.value)}
                            className={clsx(
                                "auth-menu-item",
                                mode === item.value && "auth-menu-item-active"
                            )}
                        >
                            <i className={clsx("ki-filled", item.icon, "auth-menu-icon")} aria-hidden="true" />
                            <span className="auth-menu-label">{item.label}</span>
                            <i className="ki-filled ki-check auth-menu-check" aria-hidden="true" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export function AuthControls({ i18n }: { i18n: I18n }) {
    return (
        <div className="auth-controls">
            <AuthControlsStyles />
            <LocaleSwitch i18n={i18n} />
            <ThemeToggle />
        </div>
    );
}
