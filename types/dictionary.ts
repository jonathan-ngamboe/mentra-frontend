export interface Dictionary {
    welcome: string;
    pageUnderConstruction: string;
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
      careerMatching: {
        title: string;
        subtitle: string;
        description: string;
        duration: string;
        cta: string;
        question: string;
        next: string;
        previous: string;
        finish: string;
        results: {
          title: string;
          description: string;
        };
      };
    };
    error: {
      default: string;
      access_denied: string;
      otp_expired: string;
      email_link_invalid: string;
      email_not_confirmed: string;
      user_not_found: string;
      invalid_credentials: string;
      access_denied_description: string;
      rateLimitExceeded: string;
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
  }
  