import yaml from 'js-yaml';
import { Question, Player } from '../types';

export interface GameData {
  questions: Question[];
  players?: Player[];
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
      photo: q.photo
    }));

    return questions;
  } catch (error) {
    throw new Error(`Failed to parse YAML: ${error}`);
  }
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
      photo: q.photo
    }));

    const players: Player[] = data.players
      ? data.players.map((p: any) => ({
        name: typeof p === 'string' ? p : p.name
      }))
      : [];

    return { questions, players };
  } catch (error) {
    throw new Error(`Failed to parse YAML: ${error}`);
  }
};

export const loadQuestionsFromFile = (file: File): Promise<Question[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const yamlContent = event.target?.result as string;
        const questions = await loadQuestionsFromYAML(yamlContent);
        resolve(questions);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
