export const sv = {
  brand: "Chart2Signals by BetSpread",
  tagline: "Från chart till signal på sekunder",
  uploadTitle: "Ladda upp din prisgraf",
  uploadHint: "Dra och släpp en bild eller CSV med OHLC-data",
  analyzeButton: "Analysera",
  indicatorTitle: "Välj indikatorer",
  resultTitle: "Resultat",
  summaryTitle: "Sammanfattning",
  pricingTitle: "Prismodell",
  freePlan: {
    title: "Gratis",
    price: "0 kr",
    features: ["3 analyser per dag", "Grundindikatorer", "Export i CSV"],
  },
  proPlan: {
    title: "Pro",
    price: "499 kr/mån",
    features: ["Obegränsade analyser", "Avancerad signalmotor", "Webhook & API"],
  },
  faq: [
    {
      question: "Hur fungerar Chart2Signals?",
      answer:
        "Vi extraherar prisdata ur din graf, kör teknisk analys och levererar tydliga köp-/sälj-signaler.",
    },
    {
      question: "Behöver jag OpenAI-nyckel?",
      answer:
        "Nej, men utan nyckel använder vi en heuristisk fallback som ger enklare resultat.",
    },
    {
      question: "Kan jag integrera med Stripe?",
      answer: "Ja, webhook-endpointen är förberedd för Stripe/Memberstack med HMAC-verifiering.",
    },
  ],
  trust: ["AI-driven", "Byggd i Sverige", "Redo för Vercel"],
  footerCta: "Redo att ta nästa steg? Uppgradera till Pro idag!",
  contact: "support@betspread.se",
};
