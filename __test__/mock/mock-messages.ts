import { Message } from "intor-translator";

export const mockMessage: Message =
  "Hello, {user.profile.name}. You have {user.notifications.count} new messages. Your last login was {user.activity.lastLogin.date} at {user.activity.lastLogin.time}.";
