import type React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
      <ul className="list-disc list-inside mb-4 space-y-2">
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

const termsData = [
  {
    id: "accounts",
    title: "1. Accounts",
    content: `You need an account for most activities on our platform. Keep your password somewhere safe, because you're responsible for all activity associated with your account. If you suspect someone else is using your account, let us know by contacting our Support Team. support@financiallyfitworld.com. You must have reached the age of consent for online services in your country to use Financially Fit World Learning management system.

You need an account for most activities on our platform, including to purchase and access content or to submit content for forum discussions. When setting up and maintaining your account, you must provide and continue to provide accurate and complete information, including a valid email address. You have complete responsibility for your account and everything that happens on your account, including for any harm or damage (to us or anyone else) caused by someone using your account without your permission. This means you need to be careful with your password. You may not transfer your account to someone else or use someone else's account. If you contact us to request access to an account, we will not grant you such access unless you can provide us with the information that we need to prove you are the owner of that account. In the event of the death of a user, the account of that user will be closed.

You may not share your account login credentials with anyone else. You are responsible for what happens with your account and Financially Fit World will not intervene in disputes between students who have shared account login credentials. You must notify us immediately upon learning that someone else may be using your account without your permission (or if you suspect any other breach of security) by contacting our Support Team. support@financiallyfitworld.com. We may request some information from you to confirm that you are indeed the owner of your account.

Students must be at least 18 years of age to create an account on Financially Fit World and use the Services. If you are younger than 18 but above the required age for consent to use online services where you live (for example, 13 in the US or 16 in Ireland), you may not set up an account, but we encourage you to invite a parent or guardian to open an account and help you access content that is appropriate for you. If you are below this age of consent to use online services, you may not create a Financially Fit World account. If we discover that you have created an account that violates these rules, we will terminate your account.

You can terminate your account at any time by following the steps here. Check our Privacy Policy to see what happens when you terminate your account.`,
  },
  {
    id: "content-enrollment",
    title: "2. Content Enrollment and Lifetime Access",
    content: `When you enroll in a course or other content, you get a license from us to view it via the Financially Fit World platform and no other use. Don't try to transfer or resell content in any way. We generally grant you a lifetime access license, except when we must disable the content because of legal or policy reasons or for enrollments via Subscription Plans.

As a student, when you enroll in a course or other content, whether it's free or paid content, you are getting a license from Financially Fit World to view the content via the Financially Fit World platform and services, and Financially Fit World is the licensor of record. Content is licensed, and not sold, to you. This license does not give you any right to resell the content in any manner (including by sharing account information with a purchaser or illegally downloading the content and sharing it on torrent sites).

In legal, more complete terms, Financially Fit World grants you (as a student) a limited, non-exclusive, non-transferable license to access and view the content for which you have paid all required fees, solely for your personal, non-commercial, educational purposes through the Services, in accordance with these Terms and any conditions or restrictions associated with the particular content or feature of our Services. All other uses are expressly prohibited. You may not reproduce, redistribute, transmit, assign, sell, broadcast, rent, share, lend, modify, adapt, edit, create derivative works of, sublicense, or otherwise transfer or use any content unless we give you explicit permission to do so in a written agreement signed by a Financially Fit World authorized representative. This also applies to content you can access via any of our APIs.

We generally give a lifetime access license to our students when they enroll in a course or other content. However, we reserve the right to revoke any license to access and use any content at any point in time in the event where we decide or are obligated to disable access to the content due to legal or policy reasons, for example, if the course or other content you enrolled in is the object of a copyright complaint, or if we determine it violates our Trust and Safety Guidelines. This lifetime access license does not apply to enrollments via Subscription Plans or to add-on features and services associated with the course or other content you enroll in. For example, instructors may decide at any time to no longer provide teaching assistance or Q&A services in association with the content. To be clear, the lifetime access is to the course content but not to the instructor.`,
  },
  {
    id: "payments",
    title: "3. Payments, Credits, and Refunds",
    content: `When you make a payment, you agree to use a valid payment method. If you aren't happy with your content, Financially Fit World offers a 30-day refund or credit for most content purchases.

• Pricing: The prices of content on Financially Fit World are determined based on the terms of the company and our Promotions Policy. In some instances, the price of content offered on the Financially Fit World website may not be exactly the same as the price offered on our mobile or TV applications, due to mobile platform providers' pricing systems and their policies around implementing sales and promotions.

• Payments: You agree to pay the fees for content that you purchase, and you authorize us to charge your debit or credit card or process other means of payment (such as Paypal, direct debit, or mobile money) for those fees. Financially Fit World works with payment service providers to offer you the most convenient payment methods in your country and to keep your payment information secure. We may update your payment methods using information provided by our payment service providers.

• Refunds and Refund Credits: If the content you purchased is not what you were expecting, you can request, within 30 days of your purchase of the content, that Financially Fit World apply a refund to your account. This refund option does not apply to Subscription Plan purchases. We reserve the right to apply your refund as a refund credit or a refund to your original payment method, at our discretion. No refund is due to you if you request it after the 30-day guarantee time limit has passed.`,
  },
  {
    id: "content-behavior",
    title: "4. Content and Behavior Rules",
    content: `You can only use Financially Fit World for lawful purposes. You're responsible for all the content that you post on our platform. You should keep the reviews, questions, posts, courses and other content you upload in line with our Trust & Safety Guidelines and the law, and respect the intellectual property rights of others. We can ban your account for repeated or major offenses. If you think someone is infringing your copyright on our platform, let us know.

You may not access or use the Services or create an account for unlawful purposes. Your use of the Services and behavior on our platform must comply with applicable local or national laws or regulations of your country. You are solely responsible for the knowledge of and compliance with such laws and regulations that are applicable to you.

If you are a student, the Services enable you to ask questions to the instructors of courses or other content you are enrolled in, and to post reviews of content. For certain content, the instructor may invite you to submit content as "homework" or tests. Don't post or submit anything that is not yours.

You must abide by the law and respect the rights of others: you cannot post any course, question, answer, review or other content that violates applicable local or national laws or regulations of your country. You are solely responsible for any courses, content, and actions you post or take via the platform and Services and their consequences.

If we are put on notice that your course or content violates the law or the rights of others (for example, if it is established that it violates intellectual property or image rights of others, or is about an illegal activity), if we discover that your content or behavior violates our Trust & Safety Guidelines, or if we believe your content or behavior is unlawful, inappropriate, or objectionable (for example if you impersonate someone else), we may remove your content from our platform. Financially Fit World complies with copyright laws. Check out our Intellectual Property Policy for more details.

Financially Fit World has discretion in enforcing these Terms and our Trust & Safety Guidelines. We may restrict or terminate your permission to use our platform and Services or ban your account at any time, with or without notice, for any or no reason, including for any violation of these Terms, if you fail to pay any fees when due, for fraudulent chargeback requests, upon the request of law enforcement or government agencies, for extended periods of inactivity, for unexpected technical issues or problems, if we suspect that you engage in fraudulent or illegal activities, or for any other reason in our sole discretion.`,
  },
  {
    id: "user-content",
    title: "5. Financially Fit World's Rights to Content You Post",
    content: `You retain ownership of content you post to our platform, including your courses. We're allowed to share your content to anyone through any media, including promoting it via advertising on other websites.

The content you post as a student or instructor (including courses) remains yours. By posting courses and other content, you allow Financially Fit World to reuse and share it but you do not lose any ownership rights you may have over your content. If you are an instructor, be sure to understand the content licensing terms that are detailed in the Instructors Terms.

When you post content, comments, questions, reviews, and when you submit to us ideas and suggestions for new features or improvements, you authorize Financially Fit World to use and share this content with anyone, distribute it and promote it on any platform and in any media, and to make modifications or edits to it as we see fit.

In legal language, by submitting or posting content on or through the platforms, you grant us a worldwide, non-exclusive, royalty-free license (with the right to sublicense) to use, copy, reproduce, process, adapt, modify, publish, transmit, display, and distribute your content (including your name and image) in any and all media or distribution methods (existing now or later developed). This includes making your content available to other companies, organizations, or individuals who partner with Financially Fit World for the syndication, broadcast, distribution, or publication of content on other media, as well as using your content for marketing purposes. You also waive any rights of privacy, publicity, or other rights of a similar nature applicable to all these uses, to the extent permissible under applicable law. You represent and warrant that you have all the rights, power, and authority necessary to authorize us to use any content that you submit. You also agree to all such uses of your content with no compensation paid to you.`,
  },
  {
    id: "platform-rights",
    title: "6. Financially Fit World's Rights",
    content: `We own the Financially Fit World platform and Services, including the website, present or future apps and services, and things like our logos, API, code, and content created by our employees. You can't tamper with those or use them without authorization.

All right, title, and interest in and to the Financially Fit World platform and Services, including our website, our existing or future applications, our APIs, databases, and the content our employees or partners submit or provide through our Services (but excluding content provided by instructors and students) are and will remain the exclusive property of Financially Fit World and its licensors. Our platforms and services are protected by copyright, trademark, and other laws of both the United States and foreign countries. Nothing gives you a right to use the Financially Fit World name or any of the Financially Fit World trademarks, logos, domain names, and other distinctive brand features. Any feedback, comments, or suggestions you may provide regarding Financially Fit World or the Services is entirely voluntary and we will be free to use such feedback, comments, or suggestions as we see fit and without any obligation to you.

You may not do any of the following while accessing or using the Financially Fit World platform and Services:

• Access, tamper with, or use non-public areas of the platform (including content storage), Financially Fit World's computer systems, or the technical delivery systems of Financially Fit World's service providers.
• Disable, interfere with, or try to circumvent any of the features of the platforms related to security or probe, scan, or test the vulnerability of any of our systems.
• Copy, modify, create a derivative work of, reverse engineer, reverse assemble, or otherwise attempt to discover any source code of or content on the Financially Fit World platform or Services.
• Access or search or attempt to access or search our platform by any means (automated or otherwise) other than through our currently available search functionalities that are provided via our website, mobile apps, or API (and only pursuant to those API terms and conditions). You may not scrape, spider, use a robot, or use other automated means of any kind to access the Services.
• In any way use the Services to send altered, deceptive, or false source-identifying information (such as sending email communications falsely appearing as Financially Fit World); or interfere with, or disrupt, (or attempt to do so), the access of any user, host, or network, including, without limitation, sending a virus, overloading, flooding, spamming, or mailbombing the platforms or services, or in any other manner interfering with or creating an undue burden on the Services.`,
  },
  {
    id: "subscription",
    title: "7. Subscription Plans",
    content: `This section covers additional terms that apply to your use of our subscription-based collections as a student ("Subscription Plans"). By using a Subscription Plan, you agree to the additional terms in this section. Note that use of Financially Fit World Business is not subject to these Terms, but is instead governed by the agreement between Financially Fit World and the subscribing organization.

• Subscription Plans: During your subscription to a Subscription Plan, you get a limited, non-exclusive, non-transferable license from us to access and view the content included in that Subscription Plan via the Services. With the exception of the lifetime access license grant, the terms included in the "Content Enrollment and Lifetime Access" section above apply to enrollments via Subscription Plans. The subscription that you purchase or renew determines the scope, features, and price of your access to a Subscription Plan. You may not transfer, assign, or share your subscription with anyone else.

• Account Management: You may cancel your subscription by following the steps outlined on our Support Page. If you cancel your subscription to a Subscription Plan, your access to that Subscription Plan will automatically end on the last day of your billing period. On cancellation, you will not be entitled to receive a refund or credit of any fees already paid for your subscription, unless otherwise required by applicable law. For clarity, cancellation of a subscription does not terminate your Financially Fit World account.

• Free Trials & Renewals: Your subscription may start with a free trial. The duration of the free trial period of your subscription will be specified during sign-up. Financially Fit World determines free trial eligibility at our sole discretion and may limit eligibility or duration. We will charge the subscription fee for your next billing cycle at the end of the free trial period. Your subscription will automatically renew according to your subscription settings (e.g., monthly or annually) unless you cancel your subscription prior to the end of the free trial period.

• Payments and Billing: The subscription fee will be listed at the time of your purchase. Payments are non-refundable and there are no refunds or credits for partially used periods, unless otherwise required by applicable law. If we are unable to process payment through the payment method we have on file for you, or if you file a chargeback disputing charges made to your payment method and the chargeback is granted, we may suspend or terminate your subscription.`,
  },
  {
    id: "disclaimers",
    title: "8. Disclaimers",
    content: `It may happen that our platform is down, either for planned maintenance or because something goes down with the site. It may happen that one of our instructors is making misleading statements in their content. It may also happen that we encounter security issues. These are just examples. You accept that you will not have any recourse against us in any of these types of cases where things don't work out right.

In legal, more complete language, the Services and their content are provided on an "as is" and "as available" basis. We (and our affiliates, suppliers, partners, and agents) make no representations or warranties about the suitability, reliability, availability, timeliness, security, lack of errors, or accuracy of the Services or their content, and expressly disclaim any warranties or conditions (express or implied), including implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement. We (and our affiliates, suppliers, partners, and agents) make no warranty that you will obtain specific results from use of the Services. Your use of the Services (including any content) is entirely at your own risk. Some jurisdictions don't allow the exclusion of implied warranties, so some of the above exclusions may not apply to you.

We may decide to cease making available certain features of the Services at any time and for any reason. Under no circumstances will Financially Fit World or its affiliates, suppliers, partners or agents be held liable for any damages due to such interruptions or lack of availability of such features.

We are not responsible for delay or failure of our performance of any of the Services caused by events beyond our reasonable control, like an act of war, hostility, or sabotage; natural disaster; electrical, internet, or telecommunication outage; or government restrictions.`,
  },
  {
    id: "liability",
    title: "9. Limitation of Liability",
    content: `There are risks inherent to using our Services. You fully accept these risks and you agree that you will have no recourse to seek damages against us even if you suffer loss or damage from using our platform and Services.

In legal, more complete language, to the extent permitted by law, we (and our group companies, suppliers, partners, and agents) will not be liable for any indirect, incidental, punitive, or consequential damages (including loss of data, revenue, profits, or business opportunities, or personal injury or death), whether arising in contract, warranty, tort, product liability, or otherwise, and even if we've been advised of the possibility of damages in advance. Our liability (and the liability of each of our group companies, suppliers, partners, and agents) to you or any third parties under any circumstance is limited to the greater of one hundred dollars ($100) or the amount you have paid us in the twelve (12) months before the event giving rise to your claims. Some jurisdictions don't allow the exclusion or limitation of liability for consequential or incidental damages, so some of the above may not apply to you.`,
  },
  {
    id: "dispute-resolution",
    title: "10. Dispute Resolution",
    content: `If there's a dispute, our Support Team is happy to help resolve the issue. If that doesn't work and you live in the United States or Canada, your options are to go to small claims court or bring a claim in binding arbitration; you may not bring that claim in another court or participate in a non-individual class action claim against us.

This Dispute Resolution section applies only if you live in the United States or Canada. Most disputes can be resolved, so before bringing a formal legal case, please first try contacting our Support Team.

• Small Claims: Either of us can bring a claim in small claims court in (a) Kenya, (b) the county where you live, or (c) another place we both agree on, as long as it qualifies to be brought in that court.

• Going to Arbitration: If we can't resolve our dispute amicably, you and Financially Fit World agree to resolve any claims related to these Terms (or our other legal terms) through final and binding arbitration, regardless of the type of claim or legal theory. If one of us brings a claim in court that should be arbitrated and the other party refuses to arbitrate it, the other party can ask a court to force us both to go to arbitration (compel arbitration).

• The Arbitration Process: Any disputes that involve a claim of less than USD 10,000 must be resolved exclusively through binding non-appearance-based arbitration. A party electing arbitration must initiate proceedings by filing an arbitration demand with the African Arbitration Association (AfAA). The arbitration proceedings shall be governed by the Chartered Institute of Arbitrators, Kenya Branch Rules, Consumer Due Process Protocol, and Supplementary Procedures for Resolution of Consumer-Related Disputes. You and we agree that the following rules will apply to the proceedings: (a) the arbitration will be conducted by telephone, online, or based solely on written submissions (at the choice of the party seeking relief); (b) the arbitration must not involve any personal appearance by the parties or witnesses (unless we and you agree otherwise); and (c) any judgment on the arbitrator’s rendered award may be entered in any court with competent jurisdiction. Disputes that involve a claim of more than USD 10,000 must be resolved per the AfAA’s rules about whether the arbitration hearing has to be in-person.

• No Class Actions: We both agree that we can each only bring claims against the other on an individual basis. This means: (a) neither of us can bring a claim as a plaintiff or class member in a class action, consolidated action, or representative action; (b) an arbitrator can't combine multiple people's claims into a single case (or preside over any consolidated, class, or representative action); and (c) an arbitrator's decision or award in one person's case can only impact that user, not other users, and can't be used to decide other users' disputes.

• Changes: Notwithstanding the “Updating these Terms” section below, if Financially Fit World changes this "Dispute Resolution" section after the date you last indicated acceptance to these Terms, you may reject any such change by providing Financially Fit World written notice of such rejection by email from the email address associated with your Account to ATT: Legal notices@financiallyfitworld.com , within 30 days of the date such change became effective, as indicated by the "last updated on" language above. To be effective, the notice must include your full name and clearly indicate your intent to reject changes to this "Dispute Resolution" section. By rejecting changes, you are agreeing that you will arbitrate any dispute between you and Financially Fit World in accordance with the provisions of this "Dispute Resolution" section as of the date you last indicated acceptance to these Terms. 
`,
  },
  {
    id: "additional-restrictions",
    title: "11. Additional Restrictions",
    content: "Without derogating from the generality of Section 6 above, except as may be expressly permitted by applicable law and/or as may be authorized expressly in writing by the Company, you will not, and will not permit anyone else to: (i) store, copy, modify, distribute, or resell any of the data, information, text, music, sound, photos, graphics, code or any other material (“Content”) made available on our Site whether such Content was provided by the Company or by a third party, including but not limited to other users or compile or collect any Content as part of a database or other work; (ii) use any automated tool (e.g., robots, spiders) to access or use the Site; (iii) circumvent or disable any digital rights or management, usage rules, or other security features of the Site, to the extent applicable; (iv) remove, alter, or obscure any proprietary notices (including copyright and trademark notices) on any portion of the Site; (v ) use the Site in any manner which could damage, disable, overburden or impair the Site; (vi ) transmit or create any worms, viruses or any code of a destructive nature; (vii ) display, transmit or share any Content that may be deemed hateful, threatening, pornographic, obscene, abusive, racially or ethnically offensive, libelous or defamatory, or any Content that encourages conduct that may be considered a criminal offense or bring forth civil liability; (viii) attempt to hack, destabilize or alter the Site, or alter another website so as to falsely imply that it is affiliated with the Company; (ix) use or access any of the Site by any means other than through the interface provided by the Company; and/or (x) “frame”, mirror” or otherwise incorporate any part of this Site into any other site and/or application without our prior written authorization."
  },
  {
    id: "updating-these-terms",
    title: "12. Updating These Terms",
    content: "From time to time, we may update these Terms to clarify our practices or to reflect new or different practices (such as when we add new features), and Financially Fit World reserves the right in its sole discretion to modify and/or make changes to these Terms at any time. If we make any material change, we will notify you using prominent means, such as by email notice sent to the email address specified in your account or by posting a notice through our Services. Modifications will become effective on the day they are posted unless stated otherwise. Your continued use of our Services after changes become effective shall mean that you accept those changes. Any revised Terms shall supersede all previous Terms."
  },
  {
    id: "how-to-contact-us",
    title: "13. How To Contact Us",
    content: "The best way to get in touch with us is to contact our Support Team. We’d love to hear your questions, concerns, and feedback about our Services."
  }
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-foreground px-1 mb-6">
          Terms of Service
        </h1>
        {/* Last Updated */}
        <div className="mb-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Last Updated:</strong> November 25, 2025
          </p>
        </div>

        {/* Introduction */}
        <div className="mb-12">
          <p className="text-lg text-foreground leading-relaxed mb-4">
            Financially Fit World’s mission is to improve lives through
            learning. We create and share educational content and enable anyone
            anywhere to access that educational content to learn (students). We
            consider our marketplace model the best way to offer valuable
            educational content to our users. We need rules to keep our platform
            and services safe for you, us, and our student and instructor
            community. These Terms apply to all your activities on the
            Financially Fit World’s website, the Financially Fit World mobile
            applications, our TV applications, our APIs, and other related
            services (“Services”).
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We also provide details regarding our processing of personal data of
            our students in our Privacy Policy. If you are using Financially Fit
            World LMS as part of your employer’s Financially Fit World Business
            learning and development program, you can consult our Financially
            Fit World’s Business Privacy Statement.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            If you live in the United States or Canada, by agreeing to these
            Terms, you agree to resolve disputes with Financially Fit World
            through binding arbitration (with very limited exceptions, not in
            court), and you waive certain rights to participate in class
            actions, as detailed in the Dispute Resolution section.
          </p>
        </div>

        {/* Accordion Sections */}
        <Accordion
          type="single"
          collapsible
          defaultValue="accounts"
          className="w-full space-y-4"
        >
          {termsData.map((section) => (
            <AccordionItem key={section.id} value={section.id} className="px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left text-base font-semibold text-foreground">
                  {section.title}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed text-pretty pb-4">
                {formatContent(section.content)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            For questions or concerns about these Terms, please contact us at{" "}
            <span className="underline underline-offset-4 text-gray-800 font-medium">
              support@financiallyfitworld.com
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}
