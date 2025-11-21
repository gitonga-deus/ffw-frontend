"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What is financial literacy?",
    answer:
      "Financial literacy is the ability to understand and effectively use various financial skills, including personal financial management, budgeting, and investing. Our course covers essential topics to help you make informed financial decisions and build a secure financial future.",
  },
  {
    question: "How long does the course take to complete?",
    answer:
      "The course is self-paced, allowing you to learn at your own speed. Most students complete the entire program in 4-8 weeks, depending on their schedule and learning pace. You'll have lifetime access to all course materials, so you can revisit content whenever you need.",
  },
  {
    question: "Do I get a certificate upon completion?",
    answer:
      "Yes! Upon successfully completing all course modules and assessments, you'll receive a digital certificate of completion. This certificate can be shared on your LinkedIn profile, resume, or with potential employers to demonstrate your financial literacy knowledge.",
  },
  {
    question: "Is there a money-back guarantee?",
    answer:
      "Absolutely. We offer a 30-day money-back guarantee. If you're not satisfied with the course for any reason within the first 30 days of enrollment, simply contact our support team for a full refund. We're confident you'll find tremendous value in our program.",
  },
  {
    question: "Can I access the course on mobile devices?",
    answer:
      "Yes, our platform is fully responsive and optimized for mobile devices. You can access all course content, videos, and exercises on your smartphone or tablet. Learn on the go, whether you're commuting, traveling, or relaxing at home.",
  },
  {
    question: "What topics are covered in the course?",
    answer:
      "Our comprehensive financial literacy course covers budgeting, saving strategies, debt management, investing basics, retirement planning, credit scores, insurance, and tax fundamentals. Each module includes practical exercises and real-world examples to help you apply what you learn.",
  },
];

export function FAQSection() {
  return (
    <section className="w-full py-16 md:py-24 bg-gray-50" aria-labelledby="faq-heading">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Find answers to common questions about our financial literacy course
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
