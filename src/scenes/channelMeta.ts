import type { Channel } from "../types/types";

export const channelMeta: Record<Channel, { icon: string; label: string }> = {
  email: { icon: "📧", label: "메일" },
  sms: { icon: "📱", label: "문자" },
  call: { icon: "📞", label: "전화" },
  sns: { icon: "💬", label: "메신저" },
  app: { icon: "🔔", label: "알림" },
};
