'use client';

import { ErrorBoundary } from '@/components/error-boundary';
import { SectionErrorBoundary } from '@/components/home/SectionErrorBoundary';
import HeroSection from '@/components/home/HeroSection';
import { ModulesSection } from '@/components/home/ModulesSection';
import { GettingStartedSection } from '@/components/home/GettingStartedSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { FAQSection } from '@/components/home/FAQSection';
import Script from 'next/script';

export default function HomePage() {
	// Structured Data - Organization Schema
	const organizationSchema = {
		"@context": "https://schema.org",
		"@type": "Organization",
		"name": "Financially Fit World",
		"url": "https://financiallyfitworld.com",
		"logo": "https://financiallyfitworld.com/logo/logo.png",
		"description": "Comprehensive financial literacy education platform helping individuals master their financial future",
		"sameAs": [
			"https://facebook.com/financiallyfitworld",
			"https://twitter.com/financiallyfitworld",
			"https://linkedin.com/company/financiallyfitworld"
		],
		"contactPoint": {
			"@type": "ContactPoint",
			"contactType": "Customer Service",
			"email": "support@financiallyfitworld.com"
		}
	};

	// Structured Data - Course Schema
	const courseSchema = {
		"@context": "https://schema.org",
		"@type": "Course",
		"name": "Financial Literacy Course",
		"description": "Master your financial future with our comprehensive financial literacy course. Learn essential money management skills, investing strategies, budgeting techniques, and achieve your financial goals.",
		"provider": {
			"@type": "Organization",
			"name": "Financially Fit World",
			"url": "https://financiallyfitworld.com"
		},
		"courseCode": "FIN-101",
		"educationalLevel": "Beginner to Intermediate",
		"inLanguage": "en",
		"availableLanguage": "en",
		"teaches": [
			"Money Management",
			"Budgeting",
			"Investing Basics",
			"Financial Planning",
			"Debt Management",
			"Savings Strategies"
		],
		"hasCourseInstance": {
			"@type": "CourseInstance",
			"courseMode": "online",
			"courseWorkload": "PT8H"
		},
		"offers": {
			"@type": "Offer",
			"category": "Paid",
			"priceCurrency": "USD",
			"price": "99.00"
		}
	};

	// Structured Data - Aggregate Rating Schema (for reviews)
	const aggregateRatingSchema = {
		"@context": "https://schema.org",
		"@type": "Product",
		"name": "Financial Literacy Course",
		"description": "Comprehensive financial literacy education",
		"brand": {
			"@type": "Brand",
			"name": "Financially Fit World"
		},
		"aggregateRating": {
			"@type": "AggregateRating",
			"ratingValue": "4.8",
			"reviewCount": "150",
			"bestRating": "5",
			"worstRating": "1"
		}
	};

	return (
		<>
			{/* Structured Data Scripts */}
			<Script
				id="organization-schema"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
			/>
			<Script
				id="course-schema"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
			/>
			<Script
				id="aggregate-rating-schema"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingSchema) }}
			/>

			<div className="min-h-screen flex flex-col">
				{/* Main Content */}
				<main className="flex-1">
					{/* Hero Section */}
					<SectionErrorBoundary sectionName="Hero Section">
						<HeroSection />
					</SectionErrorBoundary>

					{/* Modules Section */}
					<SectionErrorBoundary sectionName="Course Modules">
						<ModulesSection />
					</SectionErrorBoundary>

					{/* Getting Started Section */}
					<SectionErrorBoundary sectionName="Getting Started">
						<GettingStartedSection />
					</SectionErrorBoundary>

					{/* Testimonials Section */}
					<SectionErrorBoundary sectionName="Testimonials">
						<TestimonialsSection />
					</SectionErrorBoundary>

					{/* FAQ Section */}
					<SectionErrorBoundary sectionName="FAQ">
						<FAQSection />
					</SectionErrorBoundary>
				</main>
			</div>
		</>
	);
}