import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Question } from '../../types';
import { useScoreControlStyles } from '../../hooks/useStyles';
import { TimerControl } from './TimerControl';

interface ScoreScoringModalProps {
    question: Question;
    onClose: () => void;
}

export const ScoreScoringModal: React.FC<ScoreScoringModalProps> = ({ question, onClose }) => {
    const {
        players,
        teams,
        updateScore,
        answerMode,
        selectedAnswerer,
        selectedOpponent1,
        selectedOpponent2,
        selectedChampions
    } = useGame();
    const styles = useScoreControlStyles();

    const [customPoints, setCustomPoints] = useState(1);
    const [selectedPlayer, setSelectedPlayer] = useState('');

    const awardPoints = (playerOrTeamName: string, points: number) => {
        updateScore(playerOrTeamName, points);
    };

    const renderDuelScoring = () => {
        const isDuelMode = answerMode === 'duel' || answerMode === 'teams-duel';
        if (!isDuelMode) return null;

        return (
            <div>
                <h4 className={styles.sectionTitle}>Award Points to Winner:</h4>

                <div className={styles.pointsContainer}>
                    <input
                        type="number"
                        value={customPoints}
                        onChange={(e) => setCustomPoints(parseInt(e.target.value) || 0)}
                        className={styles.pointsInput}
                        min="0"
                    />
                    <span>points</span>
                </div>

                <div className={styles.actionButtons}>
                    <div className={styles.buttonRow}>
                        <button
                            onClick={() => selectedOpponent1 && awardPoints(selectedOpponent1, question.difficulty)}
                            disabled={!selectedOpponent1}
                            className={styles.correctButton}
                        >
                            {selectedOpponent1} Wins (+{question.difficulty})
                        </button>
                        <button
                            onClick={() => selectedOpponent2 && awardPoints(selectedOpponent2, question.difficulty)}
                            disabled={!selectedOpponent2}
                            className={styles.correctButton}
                        >
                            {selectedOpponent2} Wins (+{question.difficulty})
                        </button>
                    </div>

                    <div className={styles.buttonRow}>
                        <button
                            onClick={() => selectedOpponent1 && awardPoints(selectedOpponent1, customPoints)}
                            disabled={!selectedOpponent1}
                            className={styles.customButton}
                        >
                            {selectedOpponent1} Custom (+{customPoints})
                        </button>
                        <button
                            onClick={() => selectedOpponent2 && awardPoints(selectedOpponent2, customPoints)}
                            disabled={!selectedOpponent2}
                            className={styles.customButton}
                        >
                            {selectedOpponent2} Custom (+{customPoints})
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderChampionsScoring = () => {
        if (answerMode !== 'champions') return null;

        const teamChampionCounts = teams.map(team => {
            const teamChampions = selectedChampions?.get(team.name) || [];
            return {
                teamName: team.name,
                count: teamChampions.length,
                champions: teamChampions
            };
        });

        const teamsWithChampions = teamChampionCounts.filter(team => team.count > 0);

        return (
            <div>
                <h4 className={styles.sectionTitle}>Award Points to Team:</h4>

                <div className={styles.pointsContainer}>
                    <input
                        type="number"
                        value={customPoints}
                        onChange={(e) => setCustomPoints(parseInt(e.target.value) || 0)}
                        className={styles.pointsInput}
                        min="0"
                    />
                    <span>points</span>
                </div>

                <div className={styles.actionButtons}>
                    <div className="grid grid-cols-1 gap-2">
                        {teamsWithChampions.map(team => (
                            <div key={team.teamName} className="flex space-x-2">
                                <button
                                    onClick={() => awardPoints(team.teamName, question.difficulty)}
                                    className={styles.correctButton}
                                >
                                    {team.teamName} Correct (+{question.difficulty})
                                </button>
                                <button
                                    onClick={() => awardPoints(team.teamName, -1)}
                                    className={styles.wrongButton}
                                >
                                    {team.teamName} Wrong (-1)
                                </button>
                                <button
                                    onClick={() => awardPoints(team.teamName, customPoints)}
                                    className={styles.customButton}
                                >
                                    {team.teamName} Custom (+{customPoints})
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderRegularScoring = () => {
        const isRegularMode = answerMode === 'individual' || answerMode === 'teams';
        if (!isRegularMode) return null;

        return (
            <div>
                <h4 className={styles.sectionTitle}>Award Points:</h4>

                <div className={styles.pointsContainer}>
                    <input
                        type="number"
                        value={customPoints}
                        onChange={(e) => setCustomPoints(parseInt(e.target.value) || 0)}
                        className={styles.pointsInput}
                        min="0"
                    />
                    <span>points</span>
                </div>

                <div className={styles.actionButtons}>
                    <div className={styles.buttonRow}>
                        <button
                            onClick={() => selectedAnswerer && awardPoints(selectedAnswerer, question.difficulty)}
                            disabled={!selectedAnswerer}
                            className={styles.correctButton}
                        >
                            Correct (+{question.difficulty})
                        </button>
                        <button
                            onClick={() => selectedAnswerer && awardPoints(selectedAnswerer, -1)}
                            disabled={!selectedAnswerer}
                            className={styles.wrongButton}
                        >
                            Wrong (-1)
                        </button>
                    </div>

                    <button
                        onClick={() => selectedAnswerer && awardPoints(selectedAnswerer, customPoints)}
                        disabled={!selectedAnswerer}
                        className={styles.customButton}
                    >
                        Custom Points (+{customPoints})
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-semibold">Score Question</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                <div className="p-6">
                    {/* Question Info & Timer */}
                    <div className={styles.questionInfo}>
                        <h4 className={styles.questionTitle}>{question.title}</h4>
                        <div className={styles.answerBox}>
                            <strong>Answer:</strong> {question.answer}
                        </div>
                    </div>
                    <div className="mt-4">
                        <TimerControl mode="compact" />
                    </div>

                    {/* Scoring based on mode */}
                    {renderRegularScoring()}
                    {renderDuelScoring()}
                    {renderChampionsScoring()}

                    {/* Manual Score Adjustment */}
                    <div className="pt-4 border-t mt-6">
                        <h4 className={styles.sectionTitle}>Manual Score Adjustment:</h4>
                        <div className={styles.manualAdjustment}>
                            <select
                                value={selectedPlayer}
                                onChange={(e) => setSelectedPlayer(e.target.value)}
                                className={styles.select}
                            >
                                <option value="">Select player/team</option>
                                {players.map(p => (
                                    <option key={p.name} value={p.name}>{p.name} (Player)</option>
                                ))}
                                {teams.map(t => (
                                    <option key={t.id} value={t.name}>{t.name} (Team)</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                value={customPoints}
                                onChange={(e) => setCustomPoints(parseInt(e.target.value) || 0)}
                                className={styles.manualInput}
                            />
                            <button
                                onClick={() => selectedPlayer && awardPoints(selectedPlayer, customPoints)}
                                disabled={!selectedPlayer}
                                className={styles.applyButton}
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end p-6 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
