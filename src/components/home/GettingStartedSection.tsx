'use client';

import { UserPlus, BookOpen, GraduationCap, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Create Account',
    description: 'Sign up for free and get instant access to our financial literacy platform.',
    icon: <UserPlus className="h-8 w-8" aria-hidden="true" />,
  },
  {
    number: 2,
    title: 'Explore Modules',
    description: 'Browse through our comprehensive course modules covering essential financial topics.',
    icon: <BookOpen className="h-8 w-8" aria-hidden="true" />,
  },
  {
    number: 3,
    title: 'Start Learning',
    description: 'Engage with interactive content, videos, and exercises at your own pace.',
    icon: <GraduationCap className="h-8 w-8" aria-hidden="true" />,
  },
  {
    number: 4,
    title: 'Earn Certificate',
    description: 'Complete the course and receive your financial literacy certificate.',
    icon: <Award className="h-8 w-8" aria-hidden="true" />,
  },
];

export function GettingStartedSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50" aria-labelledby="getting-started-heading">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 id="getting-started-heading" className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Getting Started
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Begin your financial literacy journey in four simple steps
          </p>
        </div>

        {/* Steps Grid - Vertical on mobile, Horizontal on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step) => (
            <Card 
              key={step.number} 
              className="relative overflow-hidden transition-all hover:shadow-lg"
            >
              <CardContent className="pt-6">
                {/* Number Indicator */}
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl" />
                    <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl">
                      {step.number}
                    </div>
                  </div>
                </div>

                {/* Icon */}
                <div className="flex items-center justify-center mb-4 text-primary">
                  {step.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-center mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground text-center">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
