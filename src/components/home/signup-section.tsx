import Image from "next/image";

import { ClipboardCheck } from "lucide-react"

export default function SignupSteps() {
    return (
        <div className="py-10">
            {/* <div className="flex flex-col md:flex-row max-w-6xl px-4 mx-auto justify-between items-center"> */}
            <div className="max-w-5xl mx-auto px-4 items-center sm:px-6 lg:px-8 grid grid-cols-5 gap-10">
                
                <div className="col-span-3">
                    <h2 className="text-left py-8 text-2xl font-semibold px-1">
                        Follow these three steps to get started
                    </h2>
                    <div className="flex relative items-center pb-12">
                        <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                            <div className="h-full w-0.5 bg-gray-300 pointer-events-none"></div>
                        </div>
                        <div className="shrink-0 w-10 h-10 rounded-sm bg-[#049AD1] inline-flex items-center justify-center text-white relative z-10">
                            <ClipboardCheck />
                        </div>
                        <div className="grow pl-4">
                            <h2 className="font-medium text-lg text-gray-900 mb-1">STEP 1: Create Your Account</h2>
                            <p className="leading-relaxed text-muted-foreground text-base">Go to sign up page and create your account.</p>
                        </div>
                    </div>
                    <div className="flex relative items-center pb-12">
                        <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                            <div className="h-full w-0.5 bg-gray-300 pointer-events-none"></div>
                        </div>
                        <div className="shrink-0 w-10 h-10 rounded-sm bg-[#049AD1] inline-flex items-center justify-center text-white relative z-10">
                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <div className="grow pl-4">
                            <h2 className="font-medium text-lg text-gray-900 mb-1">STEP 2: Login to your Account</h2>
                            <p className="leading-relaxed text-muted-foreground">Login to your account to begin your journey.</p>
                        </div>
                    </div>
                    <div className="flex relative items-center">
                        <div className="shrink-0 w-10 h-10 rounded-sm bg-[#049AD1] inline-flex items-center justify-center text-white relative z-10">
                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                                <path d="M22 4L12 14.01l-3-3"></path>
                            </svg>
                        </div>
                        <div className="grow pl-4">
                            <h2 className="font-medium title-font text-lg text-gray-900 mb-1">Finish: Start Financially Fit For Life Journey</h2>
                            <p className="leading-relaxed text-muted-foreground">Start learning the seven steps of Financial Fitness.</p>
                        </div>
                    </div>
                </div>

                <div className="col-span-2">
                    <Image className="object-cover object-center rounded-lg md:mt-0 mt-12 border border-dashed shadow-sm hover:shadow-md p-2" src="/book.jpg" width={360} height={200} alt="step" />
                </div>
            </div>
        </div>
    )
}
