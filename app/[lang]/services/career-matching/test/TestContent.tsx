'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

import { useIsMobile } from '@/hooks/useIsMobile';

import { Questionnaire } from '@/components/Questionnaire';
import { OnboardingCard } from '@/components/OnboardingCard';
import { Loading } from '@/components/Loading';
import { RiasecResults } from '@/components/RiasecResults';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

import { fetchQuestions } from '@/services/database';
import {
  calculateRiasecResults,
  saveUserRiasecResults,
  getUserRiasecResults,
} from '@/services/riasec';

import { Dictionary } from '@/types/dictionary';
import { ProfessionMatch, RiasecScores } from '@/types/riasec';

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
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [questionsError, setQuestionsError] = useState<string | null>(null);
  const [userError, setUserError] = useState<string | null>(null);

  const [riasecProfile, setRiasecProfile] = useState<RiasecScores | null>(null);
  const [professionMatches, setProfessionMatches] = useState<ProfessionMatch[]>([]);

  const isMobile = useIsMobile();

  // Load the user
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
  }, [dict.error.accessDenied]);

  // Load existing profile if user is available
  useEffect(() => {
    if (!user) return;

    const userId = user.id;

    const loadProfile = async () => {
      try {
        const results = await getUserRiasecResults(userId);
        if (results) {
          setRiasecProfile(results.profile);
          setProfessionMatches(results.professions);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [user]);

  // Load questions
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
  }, [isMobile, lang]);

  const handleOnboardingComplete = () => {
    setShowQuestionnaire(true);
  };

  const handleSubmit = async (responses: (number | null)[]) => {
    setLoadingQuestions(true);
    try {
      const results = await calculateRiasecResults(responses);
      if (results) {
        if (results.profile) {
          setRiasecProfile(results.profile);
          await saveUserRiasecResults(user?.id!, results.profile);
        }
        if (results.professions) {
          setProfessionMatches(results.professions);
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

  const handleRestart = async () => {
    setRiasecProfile(null);
    setProfessionMatches([]);
    setShowQuestionnaire(false);
  };

  if (loadingUser || loadingQuestions || loadingProfile) {
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
      {riasecProfile && Object.keys(riasecProfile).length > 0 ? (
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
          <div className="mt-6 flex justify-center">
            <Button variant="outline" onClick={handleRestart} className="cursor-pointer gap-2">
              <RotateCcw className="w-4 h-4" />
              {dict.services.careerMatching.newTest}
            </Button>
          </div>
        </motion.div>
      ) : !showQuestionnaire ? (
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
