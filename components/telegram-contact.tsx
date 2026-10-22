import { telegramGroup } from "@/lib/navigation";

export function TelegramContact() {
  return (
    <a
      className="telegram-float"
      href={telegramGroup}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactează-ne pe Telegram (se deschide într-o filă nouă)"
      title="Contactează-ne pe Telegram"
    >
      <i className="ph ph-telegram-logo" aria-hidden="true" />
    </a>
  );
}
