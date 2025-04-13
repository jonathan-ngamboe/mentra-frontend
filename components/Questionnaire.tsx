'use client';

import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TypingAnimation } from '@/components/magicui/typing-animation';
import { ProgressiveBorder } from '@/components/ProgressiveBorder';
import { Dictionary } from '@/types/dictionary';
import { Check, Send } from 'lucide-react';

import sadAnimation from '@/public/emojis/rage.json';
import slightlySadAnimation from '@/public/emojis/exhale.json';
import neutralAnimation from '@/public/emojis/neutral-face.json';
import slightlyHappyAnimation from '@/public/emojis/smile.json';
import happyAnimation from '@/public/emojis/heart-eyes.json';

type QuestionnaireProps = {
  dictionary: Dictionary;
  questions: string[];
  onSubmit: (responses: (number | null)[]) => void;
};

export function Questionnaire({ dictionary, questions, onSubmit }: QuestionnaireProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedEmojis, setSelectedEmojis] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );
  const [maxVisitedIndex, setMaxVisitedIndex] = useState(0);
  const [hoveredEmoji, setHoveredEmoji] = useState<number | null>(null);
  const [selectionInProgress, setSelectionInProgress] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Calculate completion percentage
  const completedCount = selectedEmojis.filter((emoji) => emoji !== null).length;
  const completionPercentage = Math.round((completedCount / questions.length) * 100);

  // Review
  const [reviewMode, setReviewMode] = useState(false);

  const toggleReviewMode = () => {
    setReviewMode(!reviewMode);
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    if (reviewMode) {
      setReviewMode(false);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < maxVisitedIndex) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 300);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      }, 300);
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      const mappedResponses = selectedEmojis.map((emojiIndex) =>
        emojiIndex !== null ? emojiIndex : null
      );
      onSubmit(mappedResponses);
    }
  };

  const handleEmojiSelect = (emojiIndex: number) => {
    if (selectionInProgress) return; // Prevent multiple selections during animation

    setSelectionInProgress(true);
    setSelectedIndex(emojiIndex);

    // Update the selected emoji for the current question
    const newSelectedEmojis = [...selectedEmojis];
    newSelectedEmojis[currentQuestionIndex] = emojiIndex;
    setSelectedEmojis(newSelectedEmojis);

    // Subtle animation sequence before moving to next question
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setSelectionInProgress(false);
        setSelectedIndex(null);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // If it's the last question, just reset the selection state
        setSelectionInProgress(false);
        setSelectedIndex(null);
      }
    }, 850); // Subtle delay before moving to next question
  };

  // Lottie Animations
  const emojiAnimations = [
    sadAnimation,
    slightlySadAnimation,
    neutralAnimation,
    slightlyHappyAnimation,
    happyAnimation,
  ];

  const emojiLabels = [
    dictionary.services.careerMatching.answerOptions.hate,
    dictionary.services.careerMatching.answerOptions.dislike,
    dictionary.services.careerMatching.answerOptions.neutral,
    dictionary.services.careerMatching.answerOptions.like,
    dictionary.services.careerMatching.answerOptions.love,
  ];

  useEffect(() => {
    setMaxVisitedIndex((prev) => Math.max(prev, currentQuestionIndex));
  }, [currentQuestionIndex]);

  const currentSelectedEmoji = selectedEmojis[currentQuestionIndex];
  const allQuestionsAnswered = selectedEmojis.every((emoji) => emoji !== null);
  const showNextButton = currentQuestionIndex < maxVisitedIndex;
  const showPreviousButton = currentQuestionIndex > 0;
  const showSubmitButton = allQuestionsAnswered;

  return (
    <Card className="relative w-full max-w-lg mx-auto">
      <ProgressiveBorder progress={completionPercentage} />
      <CardHeader className="relative z-10">
        <CardTitle className="text-2xl font-bold">
          {dictionary.services.careerMatching.title}
        </CardTitle>
        <CardDescription className="text-sm mt-2 text-muted-foreground">
          {reviewMode
            ? dictionary.services.careerMatching.reviewDescription
            : dictionary.services.careerMatching.questionnaireDescription}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col justify-center relative z-10">
        {!reviewMode ? (
          <>
            <div className="text-xs font-medium text-muted-foreground tracking-wider uppercase mb-6 flex items-center">
              <span>
                {dictionary.services.careerMatching.question} {currentQuestionIndex + 1}
              </span>
              <div className="ml-auto flex items-center gap-1.5">
                <span>
                  {completionPercentage}% {dictionary.common.completed}
                </span>
              </div>
            </div>

            <TypingAnimation duration={30} delay={200} className="text-lg font-semibold mb-6">
              {questions[currentQuestionIndex] || ''}
            </TypingAnimation>

            <div className="flex justify-between items-start w-full mt-4">
              {emojiAnimations.map((animationData, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center relative w-1/5 px-1"
                  onMouseEnter={() => !selectionInProgress && setHoveredEmoji(index)}
                  onMouseLeave={() => !selectionInProgress && setHoveredEmoji(null)}
                >
                  <div
                    onClick={() => !selectionInProgress && handleEmojiSelect(index)}
                    className={`w-10 h-10 sm:w-14 sm:h-14 cursor-pointer transition-all duration-300 relative ${
                      selectionInProgress && selectedIndex === index
                        ? 'opacity-100 scale-115'
                        : selectionInProgress
                          ? 'opacity-40'
                          : currentSelectedEmoji === index
                            ? 'opacity-100 scale-110'
                            : 'opacity-60 hover:opacity-90 hover:scale-105'
                    }`}
                    aria-label={emojiLabels[index]}
                  >
                    <Lottie
                      animationData={animationData}
                      loop={
                        hoveredEmoji === index ||
                        currentSelectedEmoji === index ||
                        (selectionInProgress && selectedIndex === index)
                      }
                      autoplay={
                        hoveredEmoji === index ||
                        currentSelectedEmoji === index ||
                        (selectionInProgress && selectedIndex === index)
                      }
                      style={{ width: '100%', height: '100%' }}
                    />

                    {(selectionInProgress && selectedIndex === index) ||
                    (!selectionInProgress && currentSelectedEmoji === index) ? (
                      <div className="absolute -right-1 -top-1 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center animate-in fade-in zoom-in duration-300">
                        <Check className="w-4 h-4" />
                      </div>
                    ) : null}
                  </div>

                  <div className="h-12 flex items-start justify-center mt-1 w-full">
                    <span
                      className={`text-xs text-center transition-all duration-300 line-clamp-3 ${
                        selectionInProgress && selectedIndex === index
                          ? 'text-primary font-medium'
                          : selectionInProgress
                            ? 'text-muted-foreground/50'
                            : currentSelectedEmoji === index
                              ? 'text-foreground'
                              : 'text-muted-foreground'
                      }`}
                    >
                      {emojiLabels[index]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-4 cursor-pointer">
              {dictionary.services.careerMatching.reviewAnswers}
            </h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {questions.map((question, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-md border transition-all cursor-pointer hover:bg-muted ${
                    selectedEmojis[index] === null
                      ? 'border-destructive/50 bg-destructive/10'
                      : 'border-border'
                  }`}
                  onClick={() => goToQuestion(index)}
                >
                  <div className="flex items-start gap-3">
                    <div className="min-w-[24px] h-6 flex items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-2">{question}</p>
                      <div className="flex items-center mt-2">
                        {selectedEmojis[index] !== null ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6">
                              <Lottie
                                animationData={emojiAnimations[selectedEmojis[index] as number]}
                                loop={false}
                                autoplay={true}
                                style={{ width: '100%', height: '100%' }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {emojiLabels[selectedEmojis[index] as number]}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-destructive">
                            {dictionary.services.careerMatching.noAnswer}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        {!reviewMode ? (
          <>
            <div className="flex justify-between w-full">
              <div>
                {showPreviousButton && (
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={selectionInProgress}
                    className="transition-all duration-200 cursor-pointer"
                  >
                    {dictionary.common.previous}
                  </Button>
                )}
              </div>

              <div>
                {showNextButton ? (
                  <Button
                    onClick={handleNext}
                    disabled={selectionInProgress}
                    className="transition-all duration-200 cursor-pointer"
                  >
                    {dictionary.common.next}
                  </Button>
                ) : (
                  showSubmitButton && (
                    <Button
                      onClick={handleSubmit}
                      disabled={selectionInProgress}
                      className="transition-all duration-200 cursor-pointer bg-primary hover:bg-primary/90"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {dictionary.common.submit}
                    </Button>
                  )
                )}
              </div>
            </div>

            {showSubmitButton && showNextButton && (
              <Button
                onClick={handleSubmit}
                disabled={selectionInProgress}
                className="transition-all duration-200 cursor-pointer bg-primary hover:bg-primary/90 w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                {dictionary.common.submit}
              </Button>
            )}

            {allQuestionsAnswered && (
              <div className="text-center mt-2">
                <button
                  onClick={toggleReviewMode}
                  className="text-sm text-primary hover:underline focus:outline-none cursor-pointer"
                >
                  {dictionary.services.careerMatching.reviewAnswers}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-3 w-full">
            <Button
              onClick={handleSubmit}
              disabled={!allQuestionsAnswered}
              className="transition-all duration-200 cursor-pointer bg-primary hover:bg-primary/90 w-full"
            >
              <Send className="w-4 h-4 mr-2" />
              {dictionary.common.submit}
            </Button>

            <div className="text-center">
              <button
                onClick={toggleReviewMode}
                className="text-sm text-muted-foreground hover:text-foreground hover:underline focus:outline-none cursor-pointer"
              >
                {dictionary.services.careerMatching.backToQuestions}
              </button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
