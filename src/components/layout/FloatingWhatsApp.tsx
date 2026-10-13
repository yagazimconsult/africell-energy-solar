import { whatsappLink } from "@/config/site";
import { WhatsAppIcon } from "@/components/icons";

export function FloatingWhatsApp() {
  return (
    <a
      href={whatsappLink("Hello Africell Solar Aba, I'd like to make an enquiry.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-[#1faa59] text-white shadow-[0_12px_30px_-8px_rgb(31_170_89/0.7)] transition-transform hover:scale-105"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
