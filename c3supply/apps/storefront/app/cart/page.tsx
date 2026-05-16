import { createCartDTO } from "@stax/cart";
import { CartSummary } from "../../components/CartSummary";
import { HumanReviewRequiredBanner } from "../../components/HumanReviewRequiredBanner";

export default function CartPage() {
  const cart = createCartDTO({ id: "cart-placeholder", items: [] });
  return <main className="page"><p className="kicker">Commerce</p><h1>Cart intent</h1><p>Cart collects product intent. Quote-required items route to human review.</p><CartSummary cart={cart} /><HumanReviewRequiredBanner /></main>;
}
