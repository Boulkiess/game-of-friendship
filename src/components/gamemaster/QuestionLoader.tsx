import React from 'react';
import { useGame } from '../../context/GameContext';
import { useQuestionSelectorStyles } from '../../hooks/useStyles';
import { loadQuestionsFromFile } from '../../utils/yamlLoader';

export const QuestionLoader: React.FC = () => {
    const { loadQuestions } = useGame();
    const styles = useQuestionSelectorStyles();

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const loadedQuestions = await loadQuestionsFromFile(file);
                loadQuestions(loadedQuestions);
            } catch (error) {
                alert(`Error loading questions: ${error}`);
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Load Questions</h3>
                <input
                    type="file"
                    accept=".yaml,.yml"
                    onChange={handleFileUpload}
                    className={styles.fileInput}
                />
                <p className={styles.helpText}>
                    Upload a YAML file containing questions. The file should have a 'questions' array with question objects.
                </p>
            </div>
        </div>
    );
};
