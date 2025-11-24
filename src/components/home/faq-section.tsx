import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQSection() {
    const faqs = [
        {
            question: "Who is Steve Down?",
            answer:
                "Steve Down's business acumen and entrepreneurial talent led to the founding of Financially Fit, a wealth education company. This site is dedicated to the mission of the Financially Fit company, why Steve Down founded the company and the type of lessons taught by the unique Learning Management System that forms the backbone of this organization.",
        },
        {
            question: "What is Financially Fit for Life?",
            answer:
                "Financially fit for life. Is designed to change the way you think, feel and act-about-money, to empower you to achieve financial wealth and health in record  time.  Financially Fit World Limited is the global leader in personal wealth education and services-inspiring hope, vision, and direction for individuals, families, businesses, and nations - illuminating the planet through principle-centered wealth.The goal of this company is to teach you how to attain financial independence in the subsequent five years.",
        },
        {
            question: "What does it cost",
            answer:
                "Financially fit for life is an interactive online programme that costs only KSH 1,000 as a onetime subscription.",
        },
    ]

    return (
        <section className="relative py-16 md:py-24 overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-contain bg-no-repeat bg-center opacity-10 z-0"
                style={{ backgroundImage: "url('/finfit-bg.png')" }}
            ></div>

            {/* Content with Backdrop Blur */}
            <div className="container relative z-10 mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Frequently Asked Questions</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                        Find answers to common questions about our Financial Fitness Program.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border-b border-slate-200 last:border-0">
                                <AccordionTrigger className="text-left font-medium text-xl py-6 hover:text-[#049AD1] hover:no-underline">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-primary text-base pb-6">{faq.answer}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    )
}
