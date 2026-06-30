/**
 * quiz.js — BTS Vibe Matcher quiz data
 */

const quizQuestions = [
  {
    prompt: 'What would you choose for a midnight adventure?',
    choices: [
      'Sneaking into a neon rooftop party',
      'Writing poetry by the city lights',
      'Training until the stars come out'
    ],
    match: ['Jimin', 'RM', 'Jungkook']
  },
  {
    prompt: 'Pick a vibe for a cozy night in:',
    choices: [
      'Warm laughter with close friends',
      'Deep focus on a creative project',
      'Full-energy dance practice alone'
    ],
    match: ['Jin', 'SUGA', 'jhope']
  },
  {
    prompt: 'Your dream stage has:',
    choices: [
      'A dramatic, cinematic atmosphere',
      'A raw spotlight on pure talent',
      'A massive festival crowd going wild'
    ],
    match: ['V', 'Jungkook', 'jhope']
  },
  {
    prompt: 'You bring people together by:',
    choices: [
      'Making everyone laugh with a warm joke',
      'Staying cool and quietly inspiring',
      'Bringing unstoppable positive energy'
    ],
    match: ['Jin', 'SUGA', 'jhope']
  },
  {
    prompt: 'What describes your personal vibe best?',
    choices: [
      'Sweet, graceful, and emotionally deep',
      'Confident, poetic, and introspective',
      'Unique, artistic, and warmly mysterious'
    ],
    match: ['Jimin', 'RM', 'V']
  }
];

const vibeProfiles = {
  RM: {
    name: 'RM — The Thoughtful Leader',
    emoji: '📚',
    description: 'Poetic vision, intellectual depth, and confident rhythm. You lead with both heart and mind.',
    color: '#7c3aed'
  },
  Jin: {
    name: 'Jin — The Radiant Warmth',
    emoji: '🌸',
    description: 'Pure joy, caring humor, and a laugh that heals. You are the light everyone needs.',
    color: '#ec4899'
  },
  SUGA: {
    name: 'SUGA — The Creative Strategist',
    emoji: '🎹',
    description: 'Calm exterior, relentless creator underneath. Your depth and focus are your superpower.',
    color: '#6366f1'
  },
  jhope: {
    name: 'j-hope — The Sunshine',
    emoji: '☀️',
    description: 'Unstoppable energy, bright smiles, and a spirit that lifts every room you walk into.',
    color: '#f59e0b'
  },
  Jimin: {
    name: 'Jimin — The Sweet Dreamer',
    emoji: '🌙',
    description: 'Graceful, emotional, and charming. You dream big and feel everything deeply.',
    color: '#a855f7'
  },
  V: {
    name: 'V — The Artistic Soul',
    emoji: '🎨',
    description: 'Unique creativity, warm mystery, and dramatic flair. You see beauty where others don\'t.',
    color: '#14b8a6'
  },
  Jungkook: {
    name: 'Jung Kook — The Golden One',
    emoji: '⚡',
    description: 'Determined, multi-talented, and boldly confident. You never stop growing.',
    color: '#3b82f6'
  }
};
