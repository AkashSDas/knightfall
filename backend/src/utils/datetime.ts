/** Check if the date is in the future */
export function dateInFuture(v: Date): boolean {
    return v > new Date(Date.now());
}
