import { Button } from "@/components/ui/button";

import { Info } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-12">
      <div className="max-w-none relative mx-auto px-4 md:px-6">
        {/* Text Content First */}
        <div className="mb-10">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div>
          <h1 className="text-6xl text-center uppercase font-bold text-[#049AD1] mb-4">
            Financially Fit World
          </h1>

          <p className="text-xl text-center text-muted-foreground font-semibold leading-relaxed text-balance mb-4">
            Changing the way you feel, think, act and speak about money.
          </p>

          <p className="text-2xl md:text-3xl text-center font-semibold leading-relaxed text-balance mb-4">
            Principle Centered Wealth
          </p>

          <p className="text-xl text-center font-medium leading-relaxed text-balance mb-4">
            Financially Fit for Life, The Seven Steps, will empower you to:
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              "Create Cash Flow for Life",
              "Create Security for Life",
              "Become Debt Free for Life",
              "Create Wealth for Life",
              "Become a Giver for Life",
            ].map((step, i) => {
              let firstPart;
              let italicizedPart;

              if (step === "Become a Giver for Life") {
                // For this specific phrase, split it differently
                firstPart = "Become a";
                italicizedPart = "Giver for Life";
              } else {
                // For all other phrases, use the original split logic
                const parts = step.split(" ");
                firstPart = parts[0];
                italicizedPart = parts.slice(1).join(" ");
              }

              return (
                <div
                  key={i}
                  className="flex flex-col items-center text-center p-2 mb-4 rounded bg-white border-gray-200"
                >
                  {/* Triple concentric circles with different opacities */}
                  <div className="relative flex items-center justify-center mb-4">
                    {/* Outer circle - 80% opacity */}
                    <div className="absolute h-8 w-8 rounded-full bg-[#049AD1]/60"></div>
                    {/* Middle circle - 90% opacity */}
                    <div className="absolute h-12 w-12 rounded-full bg-[#049AD1]/50"></div>
                    {/* Inner circle - 100% opacity with number */}
                    <div className="relative flex h-18 w-18 items-center justify-center rounded-full bg-[#049AD1]/10">
                      <span className="text-lg font-bold text-primary">
                        {i + 1}
                      </span>
                    </div>
                  </div>
                  <span className="text-lg text-black font-semibold">
                    {firstPart}{" "}
                    {italicizedPart && <span>{italicizedPart}</span>}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-lg text-center leading-relaxed font-semibold text-balance mb-8">
            Financially Fit for Life begins with you!
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Button className="px-16! h-12 bg-[#049AD1] hover:bg-[#049AD1]/80 text-white rounded">
              <Link href={"/register"}>Get Started</Link>
            </Button>
          </div>
        </div>

        {/* Video Section Below */}
        <div className="mx-auto max-w-6xl mb-16 px-4 sm:px-6 lg:px-8">
          <div className="relative pb-[56.25%] h-0 overflow-hidden roundeded-md">
            <iframe
              src="https://player.vimeo.com/video/1087044015?autoplay=0&loop=0&autopause=0" // This is the correct Vimeo embed URL format
              title="Financial Fitness Program Introduction"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-md"
            ></iframe>
          </div>

          <div className="px-4 py-10 text-center text-pretty mt-6">
            <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-4xl">
              World Class Personal Wealth Education and more!
            </h2>

            <p className="text-base leading-relaxed text-muted-foreground">
              Financially Fit Programme employs an online program that utilizes
              the LMS (Learning Management System) which entails lessons,
              instructional videos, audio, transcripts and community engagement
              to create tailor-made financial solutions for people from all
              walks of life. It is by these principles to learn, understand, and
              apply in their lives. As a financial literacy roadmap, Financially
              Fit offers principles and education in a curriculum, to help shape
              your perception and relationship with money and wealth.
            </p>
          </div>

          <div className="bg-white pt-8">
            <div className="">
              <div className="mb-10 md:mb-16">
                <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
                  Financially Fit for Life , The Seven Steps
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 md:gap-8 mb-6">
                {[
                  {
                    step: "Wealth Awakening",
                    content:
                      "After you have listed your needs, desires and dreams, you are ready to set your Wealth Goals. Break down your goals into immediate, short-range, mid-range and lifetime goals.",
                  },
                  {
                    step: "Psychology of Wealth",
                    content:
                      "Understand the mindset that leads to financial success. Transform your thinking and pave the way for a wealthier life! by understanding the psychology of wealth.",
                  },
                  {
                    step: "Cash Flow for Life",
                    content:
                      "Learn the art of sustainable income and ensure a lifetime of financial abundance. Join us on the path to financial freedom",
                  },
                  {
                    step: "Secure for Life",
                    content:
                      "Explore strategies to safeguard your wealth and create a financial fortress. Take control of your financial destiny! Sign up today and get secure for life.",
                  },
                  {
                    step: "Debt Free for Life",
                    content:
                      "Explore strategies to safeguard your wealth and create a financial fortress. Take control of your financial destiny! Sign up today and get secure for life.",
                  },
                  {
                    step: "Wealth for Life",
                    content:
                      "Explore strategies to safeguard your wealth and create a financial fortress. Take control of your financial destiny! Sign up today and get secure for life.",
                  },
                  {
                    step: "Living the seven steps",
                    content:
                      "Explore strategies to safeguard your wealth and create a financial fortress. Take control of your financial destiny! Sign up today and get secure for life.",
                  },
                ].map((item, index) => (
                  <div
                    className={`rounded p-4 border shadow-xs hover:shadow-md ${
                      index === 6 ? "sm:col-span-2" : ""
                    }`}
                    key={index}
                  >
                    <div className="mb-4 flex items-center justify-between gap-4 border-b pb-4">
                      <h3 className="font-semibold text-[#049AD1] sm:text-lg md:text-xl">{`Step ${index + 1}: ${item.step}`}</h3>

                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500">
                        <Info />
                      </span>
                    </div>

                    <p className="text-gray-500">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
