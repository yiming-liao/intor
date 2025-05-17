import type { MessageRecord } from "../../src/intor/types/message-structure-types";

export const mockMessageRecord: MessageRecord = {
  user: {
    profile: {
      greeting: "Hello, {user.profile.name}!",
      bio: "You are from {user.profile.country}.",
    },
    notifications: {
      unread: "You have {user.notifications.count} unread messages.",
    },
  },
  system: {
    error: {
      network: "Network error occurred. Please try again.",
      server: "Server error: {system.error.code}",
    },
  },
};
