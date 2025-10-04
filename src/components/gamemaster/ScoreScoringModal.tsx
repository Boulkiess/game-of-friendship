import React, { useState } from 'react';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { PlayerAvatar } from '../shared/PlayerAvatar';
import { TeamAvatar } from '../shared/TeamAvatar';
import { useGame } from '../../context/GameContext';
import { Question } from '../../types';
import { useScoreControlStyles } from '../../hooks/useStyles';
import { TimerControl } from './TimerControl';

interface ScoreScoringModalProps {
    question: Question;
    onClose: () => void;
}

export const ScoreScoringModal: React.FC<ScoreScoringModalProps> = ({ question, onClose }) => {
    // Track which avatar was last clicked for feedback
    const [activeAvatar, setActiveAvatar] = useState<string | null>(null);
    // Store pending points before validation
    const [pendingPoints, setPendingPoints] = useState<{ [name: string]: number }>({});

    // Add points to pending (not yet validated)
    const attributePoints = (name: string, points: number) => {
        setPendingPoints(prev => ({ ...prev, [name]: (prev[name] || 0) + points }));
    };

    // Validate all pending points
    const handleValidate = () => {
        Object.entries(pendingPoints).forEach(([name, points]) => {
            if (points !== 0) updateScore(name, points);
        });
        setPointsByName(prev => {
            const updated = { ...prev };
            Object.entries(pendingPoints).forEach(([name, points]) => {
                updated[name] = (updated[name] || 0) + points;
            });
            return updated;
        });
        setPendingPoints({});
        onClose();
    };
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
    const [pointsByName, setPointsByName] = useState<{ [name: string]: number }>({});

    const awardPoints = (playerOrTeamName: string, points: number) => {
        updateScore(playerOrTeamName, points);
        setPointsByName(prev => ({ ...prev, [playerOrTeamName]: (prev[playerOrTeamName] || 0) + points }));
    };

    // Columns layout for scoring
    const renderColumnsScoring = () => {
        let involved: Array<{ name: string, type: 'player' | 'team', avatar: React.ReactNode }> = [];
        if (answerMode === 'individual' && selectedAnswerer) {
            const player = players.find(p => p.name === selectedAnswerer);
            if (player) involved.push({ name: player.name, type: 'player', avatar: <PlayerAvatar player={player} size="large" /> });
        } else if ((answerMode === 'duel' || answerMode === 'teams-duel') && selectedOpponent1 && selectedOpponent2) {
            const p1 = players.find(p => p.name === selectedOpponent1);
            const p2 = players.find(p => p.name === selectedOpponent2);
            if (p1) involved.push({ name: p1.name, type: 'player', avatar: <PlayerAvatar player={p1} size="large" /> });
            if (p2) involved.push({ name: p2.name, type: 'player', avatar: <PlayerAvatar player={p2} size="large" /> });
        } else if (answerMode === 'teams') {
            teams.forEach(team => involved.push({ name: team.name, type: 'team', avatar: <TeamAvatar team={team} size="large" /> }));
        } else if (answerMode === 'champions' && selectedChampions) {
            teams.forEach(team => {
                const champs = selectedChampions.get(team.name);
                if (champs && champs.length > 0) {
                    involved.push({ name: team.name, type: 'team', avatar: <TeamAvatar team={team} size="large" /> });
                }
            });
        }

        if (involved.length === 0) return null;


        // Avatar click handler: set only clicked player's pending points, others to zero
        const handleAvatarClick = (name: string) => {
            setPendingPoints(prev => {
                const updated: { [name: string]: number } = {};
                involved.forEach(({ name: n }) => {
                    updated[n] = n === name ? question.difficulty : 0;
                });
                return updated;
            });
            setActiveAvatar(name);
            setTimeout(() => setActiveAvatar(null), 600); // Remove highlight after 600ms
        };

        return (
            <div className={styles.pointsAwardCard}>
                <div className="flex flex-row gap-6 justify-center">
                    {involved.map(({ name, type, avatar }) => (
                        <div
                            key={name}
                            className={
                                `${styles.pointsAwardColumn} transition-all duration-200 ` +
                                (activeAvatar === name ? styles.pointsAwardActive : '')
                            }
                        >
                            <div
                                className="mb-2 cursor-pointer"
                                onClick={() => handleAvatarClick(name)}
                                title={`Add ${question.difficulty} points`}
                            >
                                {avatar}
                            </div>
                            <div className={styles.pointsAwardName}>{name}</div>
                            <div className={styles.pointsAwardButtons}>
                                <button
                                    className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl"
                                    onClick={() => attributePoints(name, -customPoints)}
                                    aria-label="Remove points"
                                >
                                    <RemoveIcon fontSize="inherit" />
                                </button>
                                <button
                                    className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl"
                                    onClick={() => attributePoints(name, customPoints)}
                                    aria-label="Add points"
                                >
                                    <AddIcon fontSize="inherit" />
                                </button>
                            </div>
                            <div className={styles.pointsAwardPending}>
                                {pendingPoints[name] !== undefined && pendingPoints[name] !== 0 ? (
                                    <span className={pendingPoints[name] > 0 ? "text-green-600" : "text-red-600"}>
                                        {pendingPoints[name] > 0 ? `(+${pendingPoints[name]})` : `(${pendingPoints[name]})`}
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.pointsAwardInputRow}>
                    <button
                        className={styles.pointsAwardValidate}
                        onClick={handleValidate}
                        disabled={Object.keys(pendingPoints).length === 0}
                    >Validate</button>
                </div>
            </div>
        );
    };

    // ...existing code...

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
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

                    {/* Columns scoring layout */}
                    {renderColumnsScoring()}
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
