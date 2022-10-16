import React from 'react';
import {
  ThumbUpIcon,
  CodeIcon,
  MapIcon,
} from '@heroicons/react/outline';
import { IconType } from '../components/Icons';

export type Feature = {
  name: string;
  description: React.ReactNode;
  Icon: IconType;
  page: 'all' | 'home' | 'docs';
};

export type Features = Feature[];

const FEATURES: Features = [
  {
    name: 'First-class TypeScript support',
    description: 'Spark supports TypeScript, with built-in type declarations that work in both TypeScript and JavaScript.',
    Icon: CodeIcon,
    page: 'all',
  },
  {
    name: 'Easy to use',
    description: 'Spark was designed for ease of use and convience in mind. Create a bot without the burden.',
    Icon: ThumbUpIcon,
    page: 'home',
  },
  {
    name: 'Easy to navigate',
    description: 'Use Spark with your own file structure — organize your code how you want to.',
    Icon: MapIcon,
    page: 'all',
  },
];

export const DOCS_FEATURES = FEATURES.filter(
  (f) => f.page === 'docs' || f.page === 'all',
);

export const HOME_FEATURES = FEATURES.filter(
  (f) => f.page === 'home' || f.page === 'all',
);

export default FEATURES;
