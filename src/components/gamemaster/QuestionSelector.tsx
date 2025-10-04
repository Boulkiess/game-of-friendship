import { PlayArrow, Stop } from '@mui/icons-material';
import React, { useMemo, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { useQuestionSelectorStyles } from '../../hooks/useStyles';
import { Question, QuestionFilters } from '../../types';
import { getImageFilename } from '../../utils/yamlLoader';
import { QuestionSetupModal } from './QuestionSetupModal';
import { ScoreScoringModal } from './ScoreScoringModal';

export const QuestionSelector: React.FC = () => {
  const {
    questions,
    setCurrentQuestion,
    currentQuestion,
    displayedQuestion,
    sendQuestionToPlayers,
    clearPlayerView
  } = useGame();
  const styles = useQuestionSelectorStyles();

  const [filters, setFilters] = useState<QuestionFilters>({
    tags: [],
    difficulties: [],
    targets: []
  });

  const [searchTerm, setSearchTerm] = useState('');

  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showScoringModal, setShowScoringModal] = useState(false);
  const [selectedQuestionForModal, setSelectedQuestionForModal] = useState<Question | null>(null);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    questions.forEach(q => q.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet);
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    return questions.filter(question => {
      const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.content.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTags = filters.tags.length === 0 ||
        filters.tags.some(tag => question.tags.includes(tag));

      const matchesDifficulty = filters.difficulties.length === 0 ||
        filters.difficulties.includes(question.difficulty);

      return matchesSearch && matchesTags && matchesDifficulty;
    });
  }, [questions, filters, searchTerm]);

  const toggleFilter = <T extends keyof QuestionFilters>(
    type: T,
    value: QuestionFilters[T][number]
  ) => {
    setFilters(prev => ({
      ...prev,
      [type]: (prev[type] as any).includes(value)
        ? (prev[type] as any).filter((item: any) => item !== value)
        : [...(prev[type] as any), value]
    } as QuestionFilters));
  };

  const handlePlayQuestion = (question: Question) => {
    setSelectedQuestionForModal(question);
    setShowSetupModal(true);
  };

  const handleSetupComplete = () => {
    setShowSetupModal(false);
    setShowScoringModal(true);
  };

  const handleCloseModals = () => {
    setShowSetupModal(false);
    setShowScoringModal(false);
    setSelectedQuestionForModal(null);
    clearPlayerView();
  };

  return (
    <div className={styles.container}>
      {/* Combined Filters and Questions Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Filter Questions</h3>

        <div className={styles.filtersContainer}>
          <div>
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div>
            <h4 className={styles.filterTitle}>Difficulty:</h4>
            <div className={styles.difficultyFilters}>
              {[1, 2, 3].map(diff => (
                <label key={diff} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={filters.difficulties.includes(diff as 1 | 2 | 3)}
                    onChange={() => toggleFilter('difficulties', diff as 1 | 2 | 3)}
                    className={styles.checkboxInput}
                  />
                  {diff}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className={styles.filterTitle}>Tags:</h4>
            <div className={styles.tagFilters}>
              {allTags.map(tag => (
                <label key={tag} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={filters.tags.includes(tag)}
                    onChange={() => toggleFilter('tags', tag)}
                    className={styles.checkboxInput}
                  />
                  <span className={styles.tagSpan}>
                    {tag}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Horizontal Rule */}
        <hr className={styles.horizontalRule} />

        <h3 className={styles.questionsHeader}>
          Questions ({filteredQuestions.length})
        </h3>

        {/* Question Control Buttons */}
        {currentQuestion && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2">Selected Question: {currentQuestion.title}</h4>
            <div className="flex space-x-2">
              <button
                onClick={clearPlayerView}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                disabled={!displayedQuestion}
              >
                Clear Player View
              </button>
            </div>
            {displayedQuestion && (
              <p className="text-sm text-gray-600 mt-1">
                Players currently see: {displayedQuestion.title}
              </p>
            )}
          </div>
        )}

        <div className={styles.questionsList}>
          {filteredQuestions.map(question => {
            const isCurrentlyDisplayed = displayedQuestion?.title === question.title;

            return (
              <div
                key={question.title}
                className={styles.getQuestionItem(currentQuestion?.title === question.title)}
                onClick={() => setCurrentQuestion(question)}
              >
                <div className={styles.questionContent}>
                  <div className="flex-1">
                    <h4 className={styles.questionTitle}>{question.title}</h4>
                    <p className={styles.questionPreview}>
                      {question.content.substring(0, 100)}...
                    </p>
                    <div className={styles.questionTags}>
                      <span className={styles.difficultyBadge}>
                        Difficulty: {question.difficulty}
                      </span>
                      {question.timer && (
                        <span className={styles.timerBadge}>
                          Timer: {question.timer}s
                        </span>
                      )}
                      {question.image && (
                        <span className={styles.imageBadge}>
                          📷 Image: {getImageFilename(question.image)}
                        </span>
                      )}
                      {question.tags.map(tag => (
                        <span key={tag} className={styles.tagBadge}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center ml-4 self-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isCurrentlyDisplayed) {
                          clearPlayerView();
                        } else {
                          handlePlayQuestion(question);
                        }
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isCurrentlyDisplayed
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                    >
                      {isCurrentlyDisplayed ? <Stop /> : <PlayArrow />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {showSetupModal && selectedQuestionForModal && (
        <QuestionSetupModal
          question={selectedQuestionForModal}
          onClose={handleCloseModals}
          onPlay={handleSetupComplete}
        />
      )}

      {showScoringModal && selectedQuestionForModal && (
        <ScoreScoringModal
          question={selectedQuestionForModal}
          onClose={handleCloseModals}
        />
      )}
    </div>
  );
};
