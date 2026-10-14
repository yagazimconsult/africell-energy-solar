import { WhatsAppIcon } from "@/components/icons";
import { WhatsAppChooser } from "@/components/WhatsAppChooser";

export function FloatingWhatsApp() {
  return (
    <WhatsAppChooser
      ariaLabel="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-[#1faa59] text-white shadow-[0_12px_30px_-8px_rgb(31_170_89/0.7)] transition-transform hover:scale-105"
    >
      <WhatsAppIcon className="size-7" />
    </WhatsAppChooser>
  );
}
