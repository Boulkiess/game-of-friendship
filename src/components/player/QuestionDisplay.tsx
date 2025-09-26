import React from 'react';
import { useGame } from '../../context/GameContext';
import { Timer } from '../shared/Timer';
import { PhotoDisplay } from '../shared/PhotoDisplay';
import { useQuestionDisplayStyles } from '../../hooks/useStyles';

export const QuestionDisplay: React.FC = () => {
  const { currentQuestion, selectedAnswerer, answerMode } = useGame();
  const styles = useQuestionDisplayStyles();

  if (!currentQuestion) {
    return (
      <div className={styles.waiting}>
        <h2 className={styles.waitingTitle}>Waiting for next question...</h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{currentQuestion.title}</h1>
        <div className={styles.tagsContainer}>
          <span className={styles.difficultyTag}>
            Difficulty: {currentQuestion.difficulty}
          </span>
          {currentQuestion.tags.map(tag => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        <p className={styles.contentText}>{currentQuestion.content}</p>
      </div>

      {currentQuestion.photo && (
        <div className={styles.photoContainer}>
          <PhotoDisplay 
            photoUrl={currentQuestion.photo} 
            alt={currentQuestion.title}
            className={styles.photoWrapper}
          />
        </div>
      )}

      {selectedAnswerer && (
        <div className={styles.answererInfo}>
          <strong>Answering:</strong> {selectedAnswerer} ({answerMode})
        </div>
      )}

      {currentQuestion.timer && (
        <div className={styles.timerContainer}>
          <Timer />
        </div>
      )}
    </div>
  );
};
