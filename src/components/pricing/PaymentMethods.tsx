import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { CONTAINER, LABEL } from "@/components/site/layout";
import { PRICING } from "@/content/pricing";
import { cn } from "@/lib/cn";

const { payments } = PRICING;

/** Secure-payment line, the card/wallet logos and the currency note. */
export function PaymentMethods() {
  return (
    <section
      aria-label={payments.label}
      className={cn(
        CONTAINER,
        "flex flex-col items-center gap-5 pt-24 pb-32 text-center max-[860px]:pt-16 max-[860px]:pb-24",
      )}
    >
      <p
        className={cn(
          LABEL,
          "flex flex-wrap items-center justify-center gap-2",
        )}
      >
        <ShieldCheck size={16} strokeWidth={1.5} aria-hidden />
        <span>{payments.head}</span>
        <Image
          src={payments.processor.logo}
          width={payments.processor.width}
          height={payments.processor.height}
          alt=""
          unoptimized
        />
        <span>{payments.processor.name}</span>
      </p>
      <ul className="flex flex-wrap items-start justify-center gap-x-10 gap-y-4 max-[560px]:gap-x-6">
        {payments.methods.map((m) => (
          <li key={m.name}>
            <Image
              src={m.src}
              width={m.width}
              height={56}
              alt={m.name}
              unoptimized
            />
          </li>
        ))}
      </ul>
      <p className="text-body-sm text-muted">{payments.note}</p>
    </section>
  );
}
