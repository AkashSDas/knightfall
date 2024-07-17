import { Notification } from "../../services/notification";
import { DefaultNotificationCard } from "./DefaultNotificationCard";
import { ReceivedFriendRequestNotificationCard } from "./ReceivedFriendRequestNotificationCard";

export function NotificationCard(props: { notification: Notification }) {
    switch (props.notification.type) {
        case "default":
            return (
                <DefaultNotificationCard notification={props.notification} />
            );
        case "loginWelcomeBack":
            return (
                <DefaultNotificationCard notification={props.notification} />
            );
        case "signupWelcome":
            return (
                <DefaultNotificationCard notification={props.notification} />
            );
        case "receivedFriendRequest":
            return (
                <ReceivedFriendRequestNotificationCard
                    notification={props.notification}
                />
            );
        case "acceptedFriendRequest":
            return (
                <ReceivedFriendRequestNotificationCard
                    notification={props.notification}
                />
            );
        default:
            return null;
    }
}
