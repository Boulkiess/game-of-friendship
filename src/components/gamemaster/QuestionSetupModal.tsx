import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Question } from '../../types';
import { useScoreControlStyles } from '../../hooks/useStyles';
import { EntityDisplay, createEntityInfo } from '../shared/EntityDisplay';
import { createSelectableItems } from '../shared/PlayerTeamSelector';

interface QuestionSetupModalProps {
    question: Question;
    onClose: () => void;
    onPlay: () => void;
}

export const QuestionSetupModal: React.FC<QuestionSetupModalProps> = ({ question, onClose, onPlay }) => {
    const {
        players,
        teams,
        answerMode,
        setAnswerMode,
        selectedAnswerer,
        setSelectedAnswerer,
        selectedOpponent1,
        selectedOpponent2,
        setSelectedOpponents,
        clearSelectedOpponents,
        selectedChampions,
        setSelectedChampions,
        clearSelectedChampions,
        sendQuestionToPlayers
    } = useGame();
    const styles = useScoreControlStyles();

    const handleAnswerModeChange = (mode: 'individual' | 'duel' | 'teams' | 'teams-duel' | 'champions') => {
        setAnswerMode(mode);
        setSelectedAnswerer('');
        clearSelectedOpponents();
        clearSelectedChampions();
    };

    const handleSelectAnswerer = (name: string) => {
        setSelectedAnswerer(name);
    };

    const handleSelectOpponent = (opponentNumber: 1 | 2, name: string) => {
        if (opponentNumber === 1) {
            setSelectedOpponents(name, selectedOpponent2 || '');
        } else {
            setSelectedOpponents(selectedOpponent1 || '', name);
        }
    };

    const handleChampionToggle = (teamName: string, playerName: string) => {
        const currentTeamChampions = selectedChampions?.get(teamName) || [];
        let newChampions: string[];

        if (currentTeamChampions.includes(playerName)) {
            newChampions = currentTeamChampions.filter(name => name !== playerName);
        } else {
            newChampions = [...currentTeamChampions, playerName];
        }

        setSelectedChampions(teamName, newChampions);
    };

    const getAvailableAnswerers = () => {
        switch (answerMode) {
            case 'individual':
                return createSelectableItems(
                    players.filter(p => !question?.targets?.includes(p.name)),
                    [],
                    false
                );
            case 'teams':
                return createSelectableItems([], teams, true).filter(item => item.type === 'team');
            case 'duel':
                return createSelectableItems(
                    players.filter(p => !question?.targets?.includes(p.name)),
                    [],
                    false
                );
            case 'teams-duel':
                return createSelectableItems([], teams, true).filter(item => item.type === 'team');
            default:
                return [];
        }
    };

    const canPlay = () => {
        switch (answerMode) {
            case 'individual':
            case 'teams':
                return !!selectedAnswerer;
            case 'duel':
            case 'teams-duel':
                return !!(selectedOpponent1 && selectedOpponent2);
            case 'champions':
                const teamChampionCounts = teams.map(team => {
                    const teamChampions = selectedChampions?.get(team.name) || [];
                    return { teamName: team.name, count: teamChampions.length };
                });
                const teamsWithChampions = teamChampionCounts.filter(team => team.count > 0);
                return teamsWithChampions.length >= 2 &&
                    teamsWithChampions.every(team => team.count === teamsWithChampions[0].count);
            default:
                return false;
        }
    };

    const handlePlay = () => {
        sendQuestionToPlayers(question);
        onPlay();
    };

    const renderRegularAnswererSelection = () => {
        const isRegularMode = answerMode === 'individual' || answerMode === 'teams';
        if (!isRegularMode) return null;

        const availableOptions = getAvailableAnswerers();

        return (
            <div>
                <h4 className={styles.sectionTitle}>Who's Answering:</h4>
                <div className="space-y-2">
                    {availableOptions.map(item => {
                        const isSelected = selectedAnswerer === item.name;
                        const entity = createEntityInfo(item.name, players, teams);

                        return (
                            <label
                                key={item.name}
                                className={`flex items-center p-2 border rounded cursor-pointer transition-colors ${isSelected ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="answerer"
                                    checked={isSelected}
                                    onChange={() => handleSelectAnswerer(item.name)}
                                    className="mr-3"
                                />
                                <EntityDisplay entity={entity} showType={false} />
                            </label>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderDuelSelection = () => {
        const availableOptions = getAvailableAnswerers();
        const isDuel = answerMode === 'duel' || answerMode === 'teams-duel';

        if (!isDuel) return null;

        return (
            <div>
                <h4 className={styles.sectionTitle}>Select Opponents:</h4>
                <div className={styles.duelContainer}>
                    <div className={styles.duelColumn}>
                        <div className={styles.duelColumnTitle}>Opponent 1</div>
                        <div className="space-y-2">
                            {availableOptions.map(item => {
                                const isSelected = selectedOpponent1 === item.name;
                                const isDisabled = selectedOpponent2 === item.name;
                                const entity = createEntityInfo(item.name, players, teams);

                                return (
                                    <label
                                        key={item.name}
                                        className={`flex items-center p-2 border rounded cursor-pointer transition-colors ${isSelected ? 'bg-blue-100 border-blue-500' :
                                            isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="opponent1"
                                            checked={isSelected}
                                            onChange={() => !isDisabled && handleSelectOpponent(1, item.name)}
                                            disabled={isDisabled}
                                            className="mr-3"
                                        />
                                        <EntityDisplay entity={entity} showType={false} />
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <div className={styles.duelColumn}>
                        <div className={styles.duelColumnTitle}>Opponent 2</div>
                        <div className="space-y-2">
                            {availableOptions.map(item => {
                                const isSelected = selectedOpponent2 === item.name;
                                const isDisabled = selectedOpponent1 === item.name;
                                const entity = createEntityInfo(item.name, players, teams);

                                return (
                                    <label
                                        key={item.name}
                                        className={`flex items-center p-2 border rounded cursor-pointer transition-colors ${isSelected ? 'bg-blue-100 border-blue-500' :
                                            isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="opponent2"
                                            checked={isSelected}
                                            onChange={() => !isDisabled && handleSelectOpponent(2, item.name)}
                                            disabled={isDisabled}
                                            className="mr-3"
                                        />
                                        <EntityDisplay entity={entity} showType={false} />
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderChampionsSelection = () => {
        if (answerMode !== 'champions') return null;

        return (
            <div>
                <h4 className={styles.sectionTitle}>Select Champions:</h4>
                <div className="space-y-4">
                    {teams.map(team => {
                        const teamChampions = selectedChampions?.get(team.name) || [];

                        return (
                            <div key={team.id} className="border rounded-lg p-4">
                                <div className="flex items-center space-x-3 mb-3">
                                    <EntityDisplay
                                        entity={createEntityInfo(team.name, players, teams)}
                                        showType={false}
                                        avatarSize="small"
                                    />
                                    <span className="text-sm text-gray-600">
                                        ({teamChampions.length} champion{teamChampions.length !== 1 ? 's' : ''} selected)
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    {team.players.map(player => {
                                        const isSelected = teamChampions.includes(player.name);

                                        return (
                                            <label
                                                key={player.name}
                                                className={`flex items-center p-2 border rounded cursor-pointer transition-colors ${isSelected ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleChampionToggle(team.name, player.name)}
                                                    className="mr-3"
                                                />
                                                <EntityDisplay
                                                    entity={createEntityInfo(player.name, players, teams)}
                                                    showType={false}
                                                    avatarSize="small"
                                                />
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-semibold">Setup Question</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    {/* Question Info */}
                    <div className={styles.questionInfo}>
                        <h4 className={styles.questionTitle}>{question.title}</h4>
                        <p className={styles.questionContent}>{question.content}</p>
                        <div className={styles.answerBox}>
                            <strong>Answer:</strong> {question.answer}
                        </div>
                    </div>

                    {/* Answer Mode Selection */}
                    <div className="mb-6">
                        <h4 className={styles.sectionTitle}>Answer Mode:</h4>
                        <div className={styles.answerModeButtons}>
                            {(['individual', 'duel', 'teams', 'teams-duel', 'champions'] as const).map(mode => (
                                <button
                                    key={mode}
                                    onClick={() => handleAnswerModeChange(mode)}
                                    className={styles.getModeButton(answerMode === mode)}
                                >
                                    {mode.replace('-', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Selection based on mode */}
                    {renderRegularAnswererSelection()}
                    {renderDuelSelection()}
                    {renderChampionsSelection()}
                </div>

                <div className="flex justify-end space-x-3 p-6 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handlePlay}
                        disabled={!canPlay()}
                        className={`px-6 py-2 rounded text-white font-medium ${canPlay()
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-gray-400 cursor-not-allowed'
                            }`}
                    >
                        Play Question
                    </button>
                </div>
            </div>
        </div>
    );
};
