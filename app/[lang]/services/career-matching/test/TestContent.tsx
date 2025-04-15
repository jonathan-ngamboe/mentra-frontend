'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

import { useIsMobile } from '@/hooks/useIsMobile';

import { Questionnaire } from '@/components/Questionnaire';
import { OnboardingCard } from '@/components/OnboardingCard';
import { Loading } from '@/components/Loading';
import { RiasecResults } from '@/components/RiasecResults';

import { fetchQuestions } from '@/services/database';
import { calculateRiasecResults, saveUserRiasecResults, getUserRiasecProfile } from '@/services/riasec';

import { Dictionary } from '@/types/dictionary';

import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

type TestContentProps = {
  dict: Dictionary;
  lang: string;
};

export default function TestContent({ dict, lang }: TestContentProps) {
  const [user, setUser] = useState<User | null>(null);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  const [questions, setQuestions] = useState<string[]>([]);

  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  const [questionsError, setQuestionsError] = useState<string | null>(null);
  const [userError, setUserError] = useState<string | null>(null);

  const [riasecProfile, setRiasecProfile] = useState<any>(null);
  const [professionMatches, setProfessionMatches] = useState<any[]>([]);

  const isMobile = useIsMobile();

  useEffect(() => {
    async function getUser() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) {
          throw new Error(dict.error.accessDenied);
        } else {
          setUser(data.user);
        }
      } catch (error) {
        setUserError(`${error}`);
      } finally {
        setLoadingUser(false);
      }
    }
    getUser();
  }, []);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const fetchedQuestions = await fetchQuestions(lang, isMobile ? 30 : undefined);
        setQuestions(fetchedQuestions);
      } catch (error) {
        setQuestionsError(`${error}`);
      } finally {
        setLoadingQuestions(false);
      }
    }
    loadQuestions();
  }, []);

  const handleOnboardingComplete = () => {
    setShowQuestionnaire(true);
  };

  const handleSubmit = async (responses: (number | null)[]) => {
    setLoadingQuestions(true);
    try {
      const results = await calculateRiasecResults(responses);
      if (results) {
        console.log(results);
        if (results.profile) {
          setRiasecProfile(results.profile);
          await saveUserRiasecResults(user?.id!, results.profile);
        }
        if (results.correlations) {
          setProfessionMatches(results.correlations);
        }
        setShowQuestionnaire(false);
      } else {
        setQuestionsError(dict.error.invalidResults);
      }
    } catch (error) {
      setQuestionsError(`${error}`);
    } finally {
      setLoadingQuestions(false);
    }
  };

  if (loadingQuestions || loadingUser) {
    return <Loading text={dict.common.loading} />;
  }

  if (userError) {
    throw new Error(userError);
  }

  if (questionsError) {
    throw new Error(questionsError);
  }

  if (!questions.length && !loadingQuestions) {
    throw new Error(dict.error.noQuestions);
  }

  return (
    <AnimatePresence mode="wait">
      {riasecProfile ? (
        // Show the results if available
        <motion.div
          key="results"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <RiasecResults
            profile={riasecProfile}
            professionMatches={professionMatches}
            dictionary={dict}
          />
        </motion.div>
      ) : !showQuestionnaire ? (
        // Show the onboarding card if the questionnaire is not yet displayed
        <motion.div
          key="onboarding"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <OnboardingCard
            dictionary={dict}
            onComplete={handleOnboardingComplete}
            questionsCount={questions.length}
          />
        </motion.div>
      ) : (
        <motion.div
          key="questionnaire"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full"
        >
          <Questionnaire dictionary={dict} questions={questions} onSubmit={handleSubmit} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
