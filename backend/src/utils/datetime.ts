export function dateInFuture(v: Date): boolean {
    return v > new Date(Date.now());
}
