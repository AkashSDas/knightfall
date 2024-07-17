/** @example 'Jul 23, 2024 at 09:45 PM' */
export function formatNotificationDate(date: Date): string {
    let time = date.toLocaleTimeString();

    if (time.includes(":")) {
        const [hours, minutes] = time.split(":");
        let hoursInt = parseInt(hours, 10);
        const ampm = hoursInt >= 12 ? "PM" : "AM";
        hoursInt = hoursInt % 12 || 12;
        time = `${hoursInt}:${minutes} ${ampm}`;
    }

    return `${date.toDateString()} at ${time}`;
}
