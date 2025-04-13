'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Questionnaire } from '@/components/Questionnaire';
import { OnboardingCard } from '@/components/OnboardingCard';
import { Loading } from '@/components/Loading';

import { fetchQuestions } from '@/services/database';

import { Dictionary } from '@/types/dictionary';

type TestContentProps = {
  dict: Dictionary;
  lang: string;
};

export default function TestContent({ dict, lang }: TestContentProps) {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleOnboardingComplete = () => {
    setShowQuestionnaire(true);
  };

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const fetchedQuestions = await fetchQuestions(lang);
        setQuestions(fetchedQuestions);
      } catch (error) {
        setError(`${error}`);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [lang]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    throw new Error(error);
  }

  if (!questions.length && !loading) {
    throw new Error(dict.error.noQuestions);
  }

  return (
    <AnimatePresence mode="wait">
      {!showQuestionnaire ? (
        <OnboardingCard
          key="onboarding"
          dictionary={dict}
          onComplete={handleOnboardingComplete}
          questionsCount={questions.length}
        />
      ) : (
        <motion.div
          key="questionnaire"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full"
        >
          <Questionnaire
            dictionary={dict}
            questions={questions}
            onSubmit={(answers) => console.log(answers)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
