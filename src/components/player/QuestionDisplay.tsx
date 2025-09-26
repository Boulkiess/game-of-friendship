import React from 'react';
import { useGame } from '../../context/GameContext';
import { Timer } from '../shared/Timer';
import { PhotoDisplay } from '../shared/PhotoDisplay';
import { useQuestionDisplayStyles } from '../../hooks/useStyles';

export const QuestionDisplay: React.FC = () => {
  const { displayedQuestion, selectedAnswerer, answerMode } = useGame();
  const styles = useQuestionDisplayStyles();

  if (!displayedQuestion) {
    return (
      <div className={styles.waiting}>
        <h2 className={styles.waitingTitle}>Waiting for next question...</h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{displayedQuestion.title}</h1>
        <div className={styles.tagsContainer}>
          <span className={styles.difficultyTag}>
            Difficulty: {displayedQuestion.difficulty}
          </span>
          {displayedQuestion.tags.map(tag => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        <p className={styles.contentText}>{displayedQuestion.content}</p>
      </div>

      {displayedQuestion.photo && (
        <div className={styles.photoContainer}>
          <PhotoDisplay 
            photoUrl={displayedQuestion.photo}
            alt={displayedQuestion.title}
            className={styles.photoWrapper}
          />
        </div>
      )}

      {selectedAnswerer && (
        <div className={styles.answererInfo}>
          <strong>Answering:</strong> {selectedAnswerer} ({answerMode})
        </div>
      )}

      {displayedQuestion.timer && (
        <div className={styles.timerContainer}>
          <Timer />
        </div>
      )}
    </div>
  );
};
