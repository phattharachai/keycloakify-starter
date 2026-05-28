const leadingActionMarkerPattern =
    /^\s*(?:(?:&laquo;|&raquo;|&#171;|&#187;)|[«»‹›←→↔⟵⟶])+\s*/u;

export function stripLeadingActionMarker(label: string): string {
    return label.replace(leadingActionMarkerPattern, "");
}