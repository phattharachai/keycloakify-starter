const base = `${import.meta.env.BASE_URL}metronic`;

export const logoSrc = `${base}/media/app/default-logo.svg`;
export const illustrationSrc = (n: number) => `${base}/media/illustrations/${n}.svg`;

export type SocialIcon = { src?: string; faClass?: string };

export function resolveSocialIcon(
    providerId: string | undefined,
    iconClasses: string | undefined
): SocialIcon {
    const brandLogos = `${base}/media/brand-logos`;
    switch (providerId) {
        case "google": return { src: `${brandLogos}/google.svg` };
        case "apple":  return { src: `${brandLogos}/apple-black.svg` };
        default:       return { faClass: iconClasses };
    }
}
