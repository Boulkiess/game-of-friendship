import yaml from 'js-yaml';
import { Question, Player, Team } from '../types';

export interface GameData {
  questions: Question[];
  players?: Player[];
  teams?: Team[];
}

export const loadQuestionsFromYAML = async (yamlContent: string): Promise<Question[]> => {
  try {
    const data = yaml.load(yamlContent) as any;

    if (!data.questions || !Array.isArray(data.questions)) {
      throw new Error('Invalid YAML format: questions array not found');
    }

    const questions: Question[] = data.questions.map((q: any) => ({
      title: q.title,
      content: q.content,
      answer: q.answer,
      difficulty: q.difficulty,
      tags: q.tags || [],
      targets: q.targets,
      timer: q.timer,
      image: q.image ? processImagePath(q.image) : undefined
    }));

    return questions;
  } catch (error) {
    throw new Error(`Failed to parse YAML: ${error}`);
  }
};

const processImagePath = (imagePath: string): string => {
  // Check if it's already a full URL (starts with http:// or https://)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Check if it's an absolute path (starts with /)
  if (imagePath.startsWith('/')) {
    return imagePath;
  }

  // Otherwise, treat as local file and add the /images/questions/ prefix
  return `/images/questions/${imagePath}`;
};

export const loadGameDataFromYAML = async (yamlContent: string): Promise<GameData> => {
  try {
    const data = yaml.load(yamlContent) as any;

    if (!data.questions || !Array.isArray(data.questions)) {
      throw new Error('Invalid YAML format: questions array not found');
    }

    const questions: Question[] = data.questions.map((q: any) => ({
      title: q.title,
      content: q.content,
      answer: q.answer,
      difficulty: q.difficulty,
      tags: q.tags || [],
      targets: q.targets,
      timer: q.timer,
      image: q.image ? processImagePath(q.image) : undefined
    }));

    const players: Player[] = data.players
      ? data.players.map((p: any) => {
        if (typeof p === 'string') {
          return { name: p };
        } else {
          return {
            name: p.name,
            profilePicture: p.profilePicture ? `/images/players/${p.profilePicture}` : undefined
          };
        }
      })
      : [];

    const teams: Team[] = data.teams
      ? data.teams.map((t: any) => ({
        id: t.id || `team-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: t.name,
        color: t.color || '#3B82F6',
        players: Array.isArray(t.players) ? t.players : []
      }))
      : [];

    return { questions, players, teams };
  } catch (error) {
    throw new Error(`Failed to parse YAML: ${error}`);
  }
};

export const loadQuestionsFromFile = async (file: File): Promise<Question[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const yamlContent = event.target?.result as string;
        const data = yaml.load(yamlContent) as any;

        if (!data.questions || !Array.isArray(data.questions)) {
          throw new Error('Invalid YAML format: questions array not found');
        }

        const questions = data.questions.map((q: any) => {
          const imageField = q.image ? processImagePath(q.image) : undefined;
          console.log('Processing question:', q.title, 'image field:', q.image, 'processed path:', imageField);

          return {
            title: q.title,
            content: q.content,
            answer: q.answer || '', // Provide default empty answer
            difficulty: q.difficulty,
            tags: q.tags || [],
            targets: q.targets,
            timer: q.timer,
            image: imageField
          };
        });

        resolve(questions);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const getImageFilename = (imagePath?: string): string | undefined => {
  if (!imagePath) return undefined;
  return imagePath.split('/').pop();
};
