import { HeartIcon, HomeIcon } from 'lucide-react';
import { Icons } from '@/components/Icons';

const baseURL = 'mentra.ch';
const siteName = 'Mentra';

// default metadata
const metaByLang = {
  fr: {
    title: 'Mentra',
    description: 'Construisez sereinement votre avenir professionnel',
    og: {
      title: 'Mentra',
      description: 'Construisez sereinement votre avenir professionnel',
      type: 'website',
      image: '/images/cover.jpg',
    },
  },
  en: {
    title: 'Mentra',
    description: 'Build your professional future with peace of mind',
    og: {
      title: 'Mentra',
      description: 'Build your professional future with peace of mind',
      type: 'website',
      image: '/images/cover.jpg',
    },
  },
};

// Navbar links
const navbar = [
  { href: '/', icon: HomeIcon, labelKey: 'navigation.home' },
  { href: '/services', icon: HeartIcon, labelKey: 'navigation.services' },
];

// default schema data
const schema = {
  logo: '',
  type: 'Organization',
  name: 'Mentra',
  description: 'Construisez sereinement votre avenir professionnel',
  email: 'hello@mentra.ch',
};

// Contact information
const contact = {
  email: 'hello@example.com',
  social: {
    GitHub: {
      name: 'GitHub',
      url: 'https://github.com/jonathan-ngamboe',
      icon: Icons?.github || null,
      navbar: true,
    },
  },
};

// Services data
const services = [
  {
    labelKey: 'services.careerMatching.action',
    link: '/services/career-matching',
  },
  {
    labelKey: 'services.events.action',
    link: '',
    badge: 'badges.comingSoon',
  },
  // Always keep doIt as the last item
  {
    labelKey: 'services.doIt.action',
    link: '',
  },
];

// Public routes for SEO
const routes = ['/', '/services', '/services/career-matching'];

export { baseURL, metaByLang, schema, contact, navbar, siteName, services, routes };
