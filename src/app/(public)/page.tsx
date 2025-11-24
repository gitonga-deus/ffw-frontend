import FAQSection from "@/components/home/faq-section";
import HeroSection from "@/components/home/hero-section";
import SignupSteps from "@/components/home/signup-section";
import TestimonialCarousel from "@/components/home/testimonial-carousel";

export default function Home() {
	return (
		<>
			<HeroSection />
			<SignupSteps />
			<section className="max-w-none mx-auto px-4 sm:px-6 lg:px-8 md:px-6 py-16 md:py-24">
				<div className="text-center mb-12">
					<h2 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">What People Say About Financially Fit for Life, The Seven Steps</h2>
				</div>
				<TestimonialCarousel
					testimonials={[
						{
							quote:
								"I was skeptical about joining the Financially Fit for Life program at first, but it turned out to be one of the best decisions I've ever made. The program not only taught me the fundamentals of money management but also provided me with practical tools to achieve my financial goals. Thanks to this program, I now feel empowered to make informed financial decisions and secure a brighter future for myself and my family.",
							author: "Audrey Tuya",
							rating: 5,
						},
						{
							quote:
								"I cannot recommend the Financially Fit for Life program enough! As someone who was always intimidated by the complexities of personal finance, this program provided me with clear, actionable steps to take control of my money. The coaches were incredibly supportive and knowledgeable, guiding me every step of the way. Since completing the program, I've seen a significant improvement in my financial health and feel empowered to make informed decisions",
							author: "Brian Koton",
							rating: 5,
						},
						{
							quote:
								"I cannot express enough gratitude for the Financially Fit for Life program. It's not just a course; it's a life-changing experience. The practical strategies and actionable advice have empowered me to take control of my finances and make smarter decisions. This program is a game-changer for anyone looking to achieve financial stability and security.",
							author: "Monicah Gitau",
							rating: 5,
						},
						{
							quote:
								"The Financially Fit for Life program exceeded my expectations in every way. Not only did it provide me with the knowledge and tools to improve my financial situation, but it also instilled in me a sense of discipline and accountability. The interactive lessons and personalized guidance helped me identify areas for improvement and take action towards achieving financial freedom. I'm truly grateful for this transformative experience.",
							author: "Erick Mungai",
							rating: 5,
						},
						{
							quote:
								"After years of struggling with managing my finances, I stumbled upon the Financially Fit for Life program. It completely transformed my perspective on money. Through their guidance, I learned practical strategies for budgeting, saving, and investing wisely. Thanks to this program, I now feel confident.",
							author: "Francisca Nkatha",
							rating: 5,
						},
					]}
				/>
			</section>
			<FAQSection />
		</>
	);
}