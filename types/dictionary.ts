export interface Dictionary {
  welcome: string;
  pageUnderConstruction: string;
  common: {
    discover: string;
    contact: string;
    loading: string;
    clickToKnowMore: string;
    next: string;
    previous: string;
    submit: string;
    completed: string;
    grid: string;
    list: string;
    chart: string;
    score: string;
  };
  badges: {
    new: string;
    comingSoon: string;
  };
  navigation: {
    home: string;
    services: string;
  };
  notFound: {
    title: string;
    description: string;
  };
  home: {
    headline: string;
    subline: string;
    cta: string;
    backHome: string;
  };
  footer: {
    rights: string;
  };
  settings: {
    title: string;
    description: string;
    save: string;
    language: {
      title: string;
      description: string;
      [key: string]: string;
    };
    theme: {
      title: string;
      description: string;
      light: string;
      dark: string;
    };
  };
  services: {
    title: string;
    action: string;
    description: string;
    prefix: string;
    end: string;
    careerMatching: {
      title: string;
      action: string;
      subtitle: string;
      description: string;
      riasecDescription: string;
      whatIsRiasec: string;
      questionnaireDescription: string;
      duration: string;
      cta: string;
      question: string;
      reviewDescription: string;
      reviewAnswers: string;
      noAnswer: string;
      backToQuestions: string;
      newTest: string;
      onboarding: {
        step1: {
          title: string;
          description: string;
        };
        step2: {
          title: string;
          description: string;
        };
        step3: {
          title: string;
          description: string;
        };
        startButton: string;
      };
      answerOptions: {
        hate: string;
        dislike: string;
        neutral: string;
        like: string;
        love: string;
      };
      results: {
        title: string;
        description: string;
        matchesDescription: string;
        topMatches: string;
        noMatches: string;
        footer: string;
      };
      dimensions: {
        R: {
          name: string;
          description: string;
        };
        I: {
          name: string;
          description: string;
        };
        A: {
          name: string;
          description: string;
        };
        S: {
          name: string;
          description: string;
        };
        E: {
          name: string;
          description: string;
        };
        C: {
          name: string;
          description: string;
        };
      };
    };
    events: {
      action: string;
    };
    doIt: {
      action: string;
    };
  };
  error: {
    default: string;
    accessDenied: string;
    otpExpired: string;
    emailLinkInvalid: string;
    emailNotConfirmed: string;
    userNotFound: string;
    invalidCredentials: string;
    rateLimitExceeded: string;
    noQuestions: string;
    invalidResults: string;
  };
  login: {
    welcome: string;
    email: string;
    invalidEmail: string;
    connect: string;
    noSpam: string;
    checkEmail: string;
    checkSpamFirst: string;
    resendWait: string;
    resendEmail: string;
    submitting: string;
    emailRequired: string;
    magicLink: {
      cta: string;
      description: string;
      sentDescription: string;
      linkResent: string;
      linkResendError: string;
    };
    otp: {
      cta: string;
      description: string;
      sentDescription: string;
      enterCode: string;
      verifying: string;
      verify: string;
      invalidCode: string;
      successMessage: string;
      codeResent: string;
      codeResendError: string;
      notReceived: string;
      otpLength: string;
      otpOnlyDigits: string;
    };
  };
  user: {
    firstname: string;
  };
  form: {
    submit: string;
    submitting: string;
    validation: {
      required: string;
      userNameLength: string;
      onlyLetters: string;
    };
  };
}
