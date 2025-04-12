'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Dictionary } from '@/types/dictionary';

type OnboardingCardProps = {
  dictionary: Dictionary;
  onComplete: () => void;
  questionsCount: number;
};

export function OnboardingCard({ dictionary, onComplete, questionsCount }: OnboardingCardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const replaceVariables = (text: string) => {
    return text.replace('{questions_count}', questionsCount.toString());
  };

  const processText = (text: string) => {
    const segments = text.split(/(<b>.*?<\/b>)/);

    return segments.map((segment, index) => {
      if (segment.startsWith('<b>') && segment.endsWith('</b>')) {
        const boldText = segment.substring(3, segment.length - 4);
        return <strong key={index}>{boldText}</strong>;
      }
      return <span key={index}>{segment}</span>;
    });
  };

  const emojiMap = {
    hate: '😡',
    dislike: '😮‍💨',
    neutral: '😐',
    like: '😀',
    love: '😍',
  };

  const onboardingSteps = [
    {
      title: dictionary.services.careerMatching.onboarding.step1.title,
      description: replaceVariables(
        dictionary.services.careerMatching.onboarding.step1.description
      ),
      icon: '👋',
    },
    {
      title: dictionary.services.careerMatching.onboarding.step2.title,
      description: replaceVariables(
        dictionary.services.careerMatching.onboarding.step2.description
      ),
      answerOptions: dictionary.services.careerMatching.answerOptions,
      icon: '🤔',
    },
    {
      title: dictionary.services.careerMatching.onboarding.step3.title,
      description: replaceVariables(
        dictionary.services.careerMatching.onboarding.step3.description
      ),
      icon: '🚀',
    },
  ];

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsTransitioning(true);
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderDescription = () => {
    return onboardingSteps[currentStep]?.description.split('\n\n').map((paragraph, pIndex) => {
      const lines = paragraph.split('\n');
      const hasBulletPoints = lines.some((line) => line.trim().startsWith('-'));

      if (hasBulletPoints) {
        return (
          <div key={`list-container-${pIndex}`} className="flex justify-center mb-4">
            <ul className="list-disc pl-6 text-left inline-block">
              {lines.map((line, lIndex) => {
                if (line.trim().startsWith('-')) {
                  const trimmedLine = line.trim();
                  const content = trimmedLine.slice(1).trim();
                  return (
                    <li key={`bullet-${pIndex}-${lIndex}`} className="mb-2">
                      {processText(content)}
                    </li>
                  );
                } else {
                  return (
                    <div key={`text-${pIndex}-${lIndex}`} className="mb-2 -ml-6">
                      {processText(line)}
                    </div>
                  );
                }
              })}
            </ul>
          </div>
        );
      } else {
        return (
          <p key={`p-${pIndex}`} className="text-center mb-4">
            {lines.map((line, lIndex) => (
              <span key={`line-${pIndex}-${lIndex}`} className="block mb-2">
                {processText(line)}
              </span>
            ))}
          </p>
        );
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4 text-4xl">
            {onboardingSteps[currentStep]?.icon}
          </div>
          <CardTitle className="text-2xl font-bold">
            {onboardingSteps[currentStep]?.title}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-base text-muted-foreground"
            >
              <CardDescription>
                {renderDescription()}

                {onboardingSteps[currentStep]?.answerOptions && (
                  <div className="mt-6 flex flex-col items-center">
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 max-w-xs mx-auto">
                      {Object.entries(onboardingSteps[currentStep].answerOptions).map(
                        ([key, value]) => (
                          <div key={`option-${key}`} className="contents">
                            <div className="text-2xl flex items-center justify-center">
                              {emojiMap[key as keyof typeof emojiMap]}
                            </div>
                            <div className="flex items-center font-medium">{value}</div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </CardDescription>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-2 mt-6">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep ? 'w-8 bg-primary' : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <div>
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isTransitioning}
                className="cursor-pointer"
              >
                {dictionary.common.previous}
              </Button>
            )}
          </div>

          <Button onClick={handleNext} disabled={isTransitioning} className="cursor-pointer">
            {currentStep < onboardingSteps.length - 1
              ? dictionary.common.next
              : dictionary.services.careerMatching.onboarding.startButton}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
