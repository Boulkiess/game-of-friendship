import React from 'react';
import { Question } from '../../types';
import { PhotoDisplay } from '../shared/PhotoDisplay';
import { useQuestionDisplayStyles } from '../../hooks/useStyles';

interface QuestionDisplayProps {
    question: Question | null;
    className?: string;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
    question,
    className = ''
}) => {
    const styles = useQuestionDisplayStyles();

    if (!question) {
        return (
            <div className={`${styles.waiting} ${className}`}>
                <h2 className={styles.waitingTitle}>Waiting for question...</h2>
            </div>
        );
    }

    return (
        <div className={`${styles.container} ${className}`}>
            <div className={styles.header}>
                <h2 className={styles.title}>{question.title}</h2>

                <div className={styles.tagsContainer}>
                    <span className={styles.difficultyTag}>
                        Difficulty: {question.difficulty}
                    </span>
                    {question.timer && (
                        <span className={styles.tag}>
                            Timer: {question.timer}s
                        </span>
                    )}
                    {question.tags.map(tag => (
                        <span key={tag} className={styles.tag}>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className={styles.content}>
                <p className={styles.contentText}>{question.content}</p>
            </div>

            {question.photo && (
                <div className={styles.photoContainer}>
                    <div className={styles.photoWrapper}>
                        <PhotoDisplay photoUrl={question.photo} alt={question.title} />
                    </div>
                </div>
            )}
        </div>
    );
};
