"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import TestimonialCard from "@/components/home/testimonial-card"

interface Testimonial {
    quote: string
    author: string
    rating: number
}

interface TestimonialCarouselProps {
    testimonials: Testimonial[]
}

export default function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)

    const goToNext = () => {
        if (isAnimating) return
        setIsAnimating(true)
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }

    const goToPrevious = () => {
        if (isAnimating) return
        setIsAnimating(true)
        setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
    }

    const goToSlide = (index: number) => {
        if (isAnimating || index === currentIndex) return
        setIsAnimating(true)
        setCurrentIndex(index)
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAnimating(false)
        }, 500)

        return () => clearTimeout(timer)
    }, [currentIndex])

    // Auto-advance the carousel every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            goToNext()
        }, 5000)

        return () => clearInterval(interval)
    }, [testimonials.length])

    return (
        <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="w-full shrink-0 px-4">
                            <TestimonialCard
                                quote={testimonial.quote}
                                author={testimonial.author}
                                rating={testimonial.rating}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full -ml-10 border-slate-200 hover:bg-white/90 z-10"
                onClick={goToPrevious}
                disabled={isAnimating}
                aria-label="Previous testimonial"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full -mr-10 border-slate-200 hover:bg-white/90 z-10"
                onClick={goToNext}
                disabled={isAnimating}
                aria-label="Next testimonial"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Indicators */}
            <div className="flex justify-center mt-6 gap-2">
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-2.5 w-2.5 rounded-full transition-colors ${index === currentIndex ? "bg-emerald-600" : "bg-slate-300"
                            }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                        aria-current={index === currentIndex ? "true" : "false"}
                    />
                ))}
            </div>
        </div>
    )
}
