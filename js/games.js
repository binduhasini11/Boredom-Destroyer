/**
 * games.js — Data layer for Boredom Destroyer
 * Contains all game content: lyrics, roasts, mood messages, vibe profiles
 */

// ─── LYRICS GAME ────────────────────────────────────────────────────────────
const lyricsQuestions = [
  { hint: '"YOLO YOLO YO YO, I go ___"', answer: 'go' },
  { hint: '"Ayo ladies and gentlemen — put your hands up for ___"', answer: 'dope' },
  { hint: '"You can\'t stop me lovin\' myself" — from BTS song ___', answer: 'idol' },
  { hint: '"I want someone to love, I want someone like ___"', answer: 'you' },
  { hint: '"Boy with luv — what a small thing my heart asked for, ___ with luv"', answer: 'boy' },
  { hint: '"Life goes on, like an ___ in the road"', answer: 'arrow' },
  { hint: '"Burning up, fire! ___ fire!"', answer: 'fire' },
  { hint: '"Fake love, fake love, I was crazed enough to think it was ___"', answer: 'love' },
  { hint: '"DNA — from the dawn of ___, we were meant to be"', answer: 'time' },
  { hint: '"Mic Drop — no more ___, I\'m done done done"', answer: 'words' }
];

// ─── ROAST LINES ─────────────────────────────────────────────────────────────
const roastLines = [
  "Even Loki couldn't trick people into thinking that was a great move.",
  "Tony Stark would invent a machine just to avoid your plan.",
  "Thanos snapped and somehow your luck disappeared too.",
  "Your idea is so wild even Spider-Man would swing away.",
  "If this were a comic, the villain would pause to laugh.",
  "The Avengers assembled just to witness that decision.",
  "Even Doctor Strange can't rewind to fix that choice.",
  "Black Panther would raise a royal eyebrow and say, 'Try again.'",
  "Your plan looks like it was drafted on the back of a Stark Industries napkin.",
  "Nick Fury lost his other eye reading your strategy document.",
  "Thor looked at that and said, 'Even Asgard has standards.'",
  "Groot saw that and could only say one thing — and it wasn't approval.",
  "Captain America blushed. That hasn't happened since 1945.",
  "Natasha Romanoff has filed that under 'Unclassified Chaos.'",
  "Vision calculated the odds of that working and politely deleted the result.",
  "Wong closed the Sanctum Sanctorum door just hearing your pitch.",
  "Peter Parker's spidey sense went off — not from danger, just secondhand embarrassment.",
  "Hawkeye had his eyes closed and still saw that coming.",
  "Bruce Banner stayed calm. That's how you know it was truly beyond hope.",
  "Nebula rated that plan 2 out of infinity stones.",
  "Rocket Raccoon built a better gadget in a trash heap. Just saying.",
  "Sam Wilson radioed the others and said, 'We're gonna need a bigger plan.'",
  "Wanda used her powers to rewrite that timeline. Twice.",
  "The Guardians of the Galaxy heard your idea and flew in the opposite direction.",
  "Even the Time Variance Authority sent a warning.",
  "Your confidence is Avengers-level. Your execution needs a few more upgrades.",
  "Shuri looked at the blueprints and laughed for three full minutes.",
  "Okoye sparred harder training sessions than that plan put up.",
  "That bold move just earned you a spot on Fury's 'We'll Talk Later' list.",
  "Even the tesseract didn't see that one coming."
];

// ─── MOOD BOOSTER MESSAGES ───────────────────────────────────────────────────
const moodBoostMessages = [
  "Keep your purple energy shining bright today! 💜",
  "Your smile is the kind of sparkle that changes the whole room. ✨",
  "You are capable of magic and midnight dreams. 🌙",
  "The universe just made space for your next big move. 🚀",
  "You have the glow of a star and the heart of a hero. 🌟",
  "Every small step today is part of your legendary story. 📖",
  "Let that fearless energy lead you into a playful adventure. 🎉",
  "You are exactly the kind of bright spark this world needs. ⚡",
  "Your vibe makes the purple lights shine even brighter. 🔮",
  "Dream big, dance loud, and let the good moments find you. 🕺",
  "Today is a canvas painted with your boldest colors. 🎨",
  "Your curiosity is your superpower — unleash it. 🦸",
  "Even on quiet days, your heart is full of rhythm. 🎵",
  "You make the ordinary feel absolutely epic. 🌈",
  "The best surprises are waiting just around the next beat. 🎶",
  "You are a moving story, and every chapter is worth celebrating. 💫",
  "Your energy is enough to light up the whole room. 🌟",
  "A little adventure is the perfect mood booster — you got this. 🔥",
  "You are worthy of kind words, bold dreams, and bright days. 💖",
  "There is a spark in you that can turn any moment magical. ✨",
  "Let your next step be playful, brave, and full of shine. 🌸",
  "You are the kind of person who turns purple into a celebration. 💜",
  "Your spirit is powerful, and your smile is unstoppable. 😊",
  "The world is ready for the energy you bring today. 🌏",
  "Your good ideas are already on their way to a glow-up. 💡"
];
