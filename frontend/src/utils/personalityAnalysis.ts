import { PERSONALITY_TYPES } from './constants';
import { PersonalityResult } from '../types';

export function analyzePersonality(answers: number[]): PersonalityResult {
  // Scoring system based on answer patterns
  let introvertScore = 0;
  let analyticalScore = 0;
  let collaborativeScore = 0;
  let leadershipScore = 0;

  // Question 1: How do you prefer to spend your free time?
  switch (answers[0]) {
    case 0: // Reading alone at home
      introvertScore += 2;
      analyticalScore += 1;
      break;
    case 1: // Hanging out with close friends
      collaborativeScore += 1;
      break;
    case 2: // Attending large social gatherings
      leadershipScore += 1;
      collaborativeScore += 1;
      break;
    case 3: // Exploring new places solo
      introvertScore += 1;
      break;
  }

  // Question 2: When making important decisions, you:
  switch (answers[1]) {
    case 0: // Follow your gut feeling
      leadershipScore += 1;
      break;
    case 1: // Analyze all available data
      analyticalScore += 2;
      introvertScore += 1;
      break;
    case 2: // Ask friends for advice
      collaborativeScore += 2;
      break;
    case 3: // Consider long-term consequences
      analyticalScore += 1;
      break;
  }

  // Question 3: In a work environment, you thrive when:
  switch (answers[2]) {
    case 0: // Working independently
      introvertScore += 2;
      break;
    case 1: // Collaborating in small teams
      collaborativeScore += 2;
      break;
    case 2: // Leading large projects
      leadershipScore += 2;
      break;
  }

  // Question 4: When facing stress, you typically:
  switch (answers[3]) {
    case 0: // Take time to reflect quietly
      introvertScore += 2;
      analyticalScore += 1;
      break;
    case 1: // Talk it through with others
      collaborativeScore += 2;
      break;
    case 2: // Take immediate action
      leadershipScore += 2;
      break;
    case 3: // Plan methodically
      analyticalScore += 2;
      break;
  }

  // Question 5: You learn best through:
  switch (answers[4]) {
    case 0: // Hands-on experience
      leadershipScore += 1;
      break;
    case 1: // Reading and research
      analyticalScore += 2;
      introvertScore += 1;
      break;
    case 2: // Group discussions
      collaborativeScore += 2;
      break;
    case 3: // Visual demonstrations
      analyticalScore += 1;
      break;
  }

  // Determine personality type based on highest scores
  const scores = {
    introvert: introvertScore,
    analytical: analyticalScore,
    collaborative: collaborativeScore,
    leadership: leadershipScore
  };

  // Check for balanced profile first
  const maxScore = Math.max(...Object.values(scores));
  const topScores = Object.entries(scores).filter(([_, score]) => score === maxScore);

  if (topScores.length > 2 || maxScore < 3) {
    return PERSONALITY_TYPES.BALANCED_ADAPTOR;
  }

  // Determine specific type based on dominant traits
  if (introvertScore >= analyticalScore && introvertScore > collaborativeScore && introvertScore > leadershipScore) {
    if (analyticalScore > 2) {
      return PERSONALITY_TYPES.INTROVERT_ANALYTICAL;
    } else {
      return PERSONALITY_TYPES.INTROVERT_INTUITIVE;
    }
  }

  if (leadershipScore > collaborativeScore && leadershipScore > introvertScore) {
    return PERSONALITY_TYPES.EXTROVERT_LEADER;
  }

  if (collaborativeScore > leadershipScore && collaborativeScore > introvertScore) {
    return PERSONALITY_TYPES.EXTROVERT_COLLABORATIVE;
  }

  if (analyticalScore > leadershipScore && analyticalScore > collaborativeScore) {
    return PERSONALITY_TYPES.INTROVERT_ANALYTICAL;
  }

  // Default to balanced if no clear winner
  return PERSONALITY_TYPES.BALANCED_ADAPTOR;
}

export function getPersonalityInsights(personalityType: PersonalityResult): string[] {
  const insights = [
    `Your personality type is: ${personalityType.type}`,
    personalityType.description,
    `Key traits: ${personalityType.traits.join(', ')}`
  ];

  // Add specific insights based on type
  switch (personalityType.type) {
    case 'Thoughtful Analyst':
      insights.push('You excel in roles requiring deep analysis and strategic thinking.');
      insights.push('Consider careers in research, data analysis, or strategic planning.');
      break;
    case 'Creative Visionary':
      insights.push('You bring unique perspectives and innovative solutions.');
      insights.push('Explore creative fields or roles requiring innovation and vision.');
      break;
    case 'Team Player':
      insights.push('You strengthen teams and facilitate collaboration.');
      insights.push('Look for roles in project management, HR, or team coordination.');
      break;
    case 'Natural Leader':
      insights.push('You inspire others and drive results.');
      insights.push('Consider leadership positions, entrepreneurship, or management roles.');
      break;
    case 'Flexible Adaptor':
      insights.push('Your versatility is your greatest strength.');
      insights.push('You can succeed in various roles and environments.');
      break;
  }

  return insights;
}