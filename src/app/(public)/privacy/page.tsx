import type React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

function formatContent(text: string) {
  const lines = text.split("\n");
  const result: React.ReactNode[] = [];
  let listItems: string[] = [];

  lines.forEach((line, index) => {
    if (line.trim().startsWith("•")) {
      listItems.push(line.trim().substring(1).trim());
    } else if (line.trim() === "") {
      if (listItems.length > 0) {
        result.push(
          <ul
            key={`list-${index}`}
            className="list-disc list-inside mb-4 space-y-2"
          >
            {listItems.map((item, itemIndex) => {
              const colonIndex = item.indexOf(":");
              const beforeColon =
                colonIndex > -1 ? item.substring(0, colonIndex) : item;
              const afterColon =
                colonIndex > -1 ? item.substring(colonIndex) : "";

              return (
                <li key={itemIndex} className="text-muted-foreground">
                  <span className="font-semibold">{beforeColon}</span>
                  {afterColon}
                </li>
              );
            })}
          </ul>
        );
        listItems = [];
      }
      if (line.trim() !== "") {
        result.push(
          <div key={index} className="mb-4">
            {line}
          </div>
        );
      }
    } else {
      if (listItems.length > 0) {
        result.push(
          <ul
            key={`list-${index}`}
            className="list-disc list-inside mb-4 space-y-2"
          >
            {listItems.map((item, itemIndex) => {
              const colonIndex = item.indexOf(":");
              const beforeColon =
                colonIndex > -1 ? item.substring(0, colonIndex) : item;
              const afterColon =
                colonIndex > -1 ? item.substring(colonIndex) : "";

              return (
                <li key={itemIndex} className="text-muted-foreground">
                  <span className="font-semibold">{beforeColon}</span>
                  {afterColon}
                </li>
              );
            })}
          </ul>
        );
        listItems = [];
      }
      result.push(
        <div key={index} className="mb-4">
          {line}
        </div>
      );
    }
  });

  if (listItems.length > 0) {
    result.push(
      <ul key="final-list" className="list-disc list-inside mb-4 space-y-2">
        {listItems.map((item, itemIndex) => {
          const colonIndex = item.indexOf(":");
          const beforeColon =
            colonIndex > -1 ? item.substring(0, colonIndex) : item;
          const afterColon = colonIndex > -1 ? item.substring(colonIndex) : "";

          return (
            <li key={itemIndex} className="text-muted-foreground">
              <span className="font-semibold">{beforeColon}</span>
              {afterColon}
            </li>
          );
        })}
      </ul>
    );
  }

  return result;
}

const privacyData = [
  {
    id: "data-collection",
    title: "1. What Data We Get",
    content: `We collect data directly from you, automatically through your use of our Services, and from third parties.

• Account Data: To use certain features, you must create a user account. We collect your email, password, and account settings. Instructor accounts may also include name, occupation, ID verification details, date of birth, and other optional information.
• Profile Data: You may provide additional details such as a profile photo, bio, website, or social links. Your profile data may be publicly visible.
• Shared Content: When you post reviews, participate in discussions, or share work, this content may be publicly visible depending on your settings.
• Educational Content Data: We collect information on the courses and content you engage with, including your submissions, progress, and completion records.
• Payment Data: We collect limited data (e.g., billing name, ZIP code) and use third-party payment processors for secure transactions. Instructor Payments: We collect payment account information (e.g., PayPal email, tax data) to issue payments. Sensitive bank information is handled securely by third-party processors.
• Connected Accounts: If you log in via third-party platforms (e.g., Facebook), we may access certain information per your permissions and the platform's policies.
• Promotions, Surveys, and Sweepstakes: We collect participation data such as your name, email, or address to administer promotions or surveys.
• Communications and Support: When you contact us, we collect information necessary to respond to your requests, including name, email, and message details.`,
  },
  {
    id: "automated-collection",
    title: "2. Data We Collect Through Automated Means",
    content: `When you access our Services, we automatically collect:

• System Data: IP address, browser type, device info, and operating system.
• Usage Data: Pages visited, time spent, content accessed, and click activity.
• Approximate Geographic Data: Country or city derived from your IP address.

These are collected via cookies and other tracking technologies (see Section 6). You may opt out of some types of tracking.`,
  },
  {
    id: "cookies",
    title: "3. Cookies and Data Collection Tools",
    content: `Cookies are small text files stored by your browser to remember your preferences and improve your experience.

We and our service providers (e.g., Google Analytics) use cookies and tracking tools to collect system and usage data.

Types of Data Collection Tools:
• Strictly Necessary: Essential for site functionality and security.
• Functional: Remember user preferences and enhance usability.
• Performance: Provide analytics on usage and site performance.
• Advertising: Deliver personalized ads based on user interests.
• Social Media: Enable sharing via social platforms.

You can control cookie settings via your browser or device (see Section 12).`,
  },
  {
    id: "data-usage",
    title: "4. What We Use Your Data For",
    content: `We use your data to:

• Provide and manage Services.
• Process payments and transactions.
• Communicate with you about updates and promotions.
• Troubleshoot technical issues.
• Verify instructor identities.
• Personalize content and advertising.
• Ensure legal compliance and prevent fraud.`,
  },
  {
    id: "data-sharing",
    title: "5. Who We Share Your Data With",
    content: `We may share your data with:

• Instructors and other users (where relevant).
• Service providers and contractors (e.g., payment processors).
• Affiliates and business partners.
• Analytics and advertising vendors.
• Social media platforms.
• Legal and government authorities (when required by law).
• Successor organizations (in case of mergers or acquisitions).
• Other third parties with your consent.`,
  },
  {
    id: "security",
    title: "6. Security",
    content: `We implement security measures appropriate to data sensitivity. However, no system is entirely secure—protect your password and account information carefully.

We use industry-standard encryption and security protocols to protect your personal data. However, we cannot guarantee absolute security of your information transmitted over the internet.`,
  },
  {
    id: "your-rights",
    title: "7. Your Rights",
    content: `You can opt out of marketing emails, manage cookie preferences, or request access, correction, or deletion of your personal data.

Parents may request deletion of data collected from children under applicable age limits.

You can:
• Opt out of promotional emails.
• Control cookies via your browser.
• Manage advertising preferences via ad network opt-out tools.
• Contact us at privacy@financiallyfitworld.com for data-related requests.`,
  },
  {
    id: "data-access",
    title: "8. Accessing, Updating, and Deleting Your Data",
    content: `You may update your account data anytime by logging into your profile or contacting support. Account deletion requests can be submitted via our online form or by email.

You can:
• Update your account data anytime by logging into your profile or contacting support.
• Submit account deletion requests via our online form or by email to privacy@financiallyfitworld.com.`,
  },
  {
    id: "children",
    title: "9. Our Policy Concerning Children",
    content: `Users under the legal age of consent (e.g., under 13 in the U.S.) may not create accounts. If we learn we've collected data from a minor, we will delete it promptly.

If you are a parent or guardian and believe we have collected information from a child under the age of consent, please contact us immediately at privacy@financiallyfitworld.com.`,
  },
  {
    id: "jurisdiction",
    title: "10. Jurisdiction-Specific Rules",
    content: `Depending on your location, additional rights may apply (e.g., California, Australia, EEA, UK).

• Users in California: Rights under the California Consumer Privacy Act (CCPA) include access, correction, deletion, and opt-out of data sale.
• Users in Nevada: Residents can request that their data not be sold by emailing privacy@financiallyfitworld.com.
• Users in Australia: Complaints may be filed with the Office of the Australian Information Commissioner (OAIC) or by contacting us directly at privacy@financiallyfitworld.com.
• Users in the EEA and UK: Users may request access, correction, deletion, or restriction of their data. Complaints can be lodged with the relevant data protection authority.
• Users Outside the U.S.: By using our Services, you consent to the transfer and processing of your data in the United States and other jurisdictions.`,
  },
  {
    id: "contact",
    title: "11. Updates and Contact Information",
    content: `We will notify you of material changes to this Privacy Policy via email or in-product notices.

For any questions or concerns, contact: privacy@financiallyfitworld.com Financially Fit World – Privacy Team

For questions, concerns, or disputes regarding this Privacy Policy, contact our Privacy Team (including our Data Protection Officer) at: privacy@financiallyfitworld.com

Any capitalized terms not defined herein have meanings stated in our Terms of Use. In case of translation discrepancies, the English version prevails.`,
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-foreground px-1 mb-6">
          Privacy Policy
        </h1>
        {/* Last Updated */}
        <div className="mb-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Last Updated:</strong> November 25th , 2025
          </p>
        </div>

        {/* Introduction */}
        <div className="mb-12">
          <p className="text-lg text-foreground leading-relaxed mb-4">
            Thank you for joining Financially Fit World. We at Financially Fit
            World ("Financially Fit World," "we," "us") respect your privacy and
            want you to understand how we collect, use, and share data about
            you.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            This Privacy Policy covers our data collection practices and
            describes your rights regarding your personal data. Unless otherwise
            stated, this Privacy Policy applies when you visit or use the
            Financially Fit World website, mobile applications, APIs, or related
            services (the "Services"). It also applies to prospective customers
            of our business and enterprise products.
          </p>

          <p className="text-muted-foreground leading-relaxed">
            By using the Services, you agree to this Privacy Policy. If you do
            not agree, please discontinue use of the Services.
          </p>
        </div>

        {/* Accordion Sections */}
        <Accordion
          type="single"
          collapsible
          defaultValue="data-collection"
          className="w-full space-y-4"
        >
          {privacyData.map((section) => (
            <AccordionItem key={section.id} value={section.id} className="px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-base text-left font-semibold text-foreground">
                  {section.title}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                {formatContent(section.content)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            For questions or concerns about this Privacy Policy, please contact
            us at {" "}
            <span className="underline underline-offset-4 text-gray-800 font-medium">
              privacy@financiallyfitworld.com
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}
