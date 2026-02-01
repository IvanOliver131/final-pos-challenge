import {
  BaggageClaim,
  BookOpen,
  BriefcaseBusiness,
  CarFront,
  Dumbbell,
  Gift,
  HeartPulse,
  House,
  Mailbox,
  PawPrint,
  PiggyBank,
  ReceiptText,
  ShoppingCart,
  Ticket,
  ToolCase,
  Utensils,
} from "lucide-react";
import { JSX } from "react/jsx-runtime";

interface IconRenderProps {
  categoryIconName?: string;
  categoryColor?: string;
  size?: number;
}

export function IconRender({
  categoryIconName,
  categoryColor,
  size = 4,
}: IconRenderProps) {
  const icon: Record<string, JSX.Element> = {
    "briefcase-business": (
      <BriefcaseBusiness
        style={{ color: categoryColor }}
        className={`w-${size} h-${size}`}
      />
    ),
    "car-front": (
      <CarFront
        style={{ color: categoryColor }}
        className={`w-${size} h-${size}`}
      />
    ),
    "heart-pulse": (
      <HeartPulse
        style={{ color: categoryColor }}
        className={`w-${size} h-${size}`}
      />
    ),
    "piggy-bank": (
      <PiggyBank
        style={{ color: categoryColor }}
        className={`w-${size} h-${size}`}
      />
    ),
    "shopping-cart": (
      <ShoppingCart
        style={{ color: categoryColor }}
        className={`w-${size} h-${size}`}
      />
    ),
    ticket: (
      <Ticket
        style={{ color: categoryColor }}
        className={`w-${size} h-${size}`}
      />
    ),
    "tool-case": (
      <ToolCase
        style={{ color: categoryColor }}
        className={`w-${size} h-${size}`}
      />
    ),
    utensils: (
      <Utensils
        style={{ color: categoryColor }}
        className={`w-${size} h-${size}`}
      />
    ),
    "paw-print": (
      <PawPrint
        style={{ color: categoryColor }}
        className={`w-${size} h-${size}`}
      />
    ),
    house: (
      <House
        style={{ color: categoryColor }}
        className={`w-${size} h-${size}`}
      />
    ),
    gift: (
      <Gift
        style={{ color: categoryColor }}
        className={`w-${size} h-${size}`}
      />
    ),
    dumbbell: (
      <Dumbbell
        style={{ color: categoryColor }}
        className={`w-${size} h-${size}`}
      />
    ),
    "book-open": (
      <BookOpen
        style={{ color: categoryColor }}
        className={`w-${size} h-${size}`}
      />
    ),
    "baggage-claim": (
      <BaggageClaim
        style={{ color: categoryColor }}
        className={`w-${size} h-${size}`}
      />
    ),
    mailbox: (
      <Mailbox
        style={{ color: categoryColor }}
        className={`w-${size} h-${size}`}
      />
    ),
    "receipt-text": (
      <ReceiptText
        style={{ color: categoryColor }}
        className={`w-${size} h-${size}`}
      />
    ),
  };

  if (!categoryIconName) return <></>;

  return <>{icon[categoryIconName]}</>;
}
