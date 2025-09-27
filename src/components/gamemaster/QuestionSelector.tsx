import React, { useState, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { Question, QuestionFilters } from '../../types';
import { loadQuestionsFromFile, getImageFilename } from '../../utils/yamlLoader';
import { useQuestionSelectorStyles } from '../../hooks/useStyles';

export const QuestionSelector: React.FC = () => {
  const {
    questions,
    loadQuestions,
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

  return (
    <div className={styles.container}>
      {/* File Upload Section */}
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

      {/* Filters */}
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
      </div>

      {/* Question List */}
      <div className={styles.section}>
        <h3 className={styles.questionsHeader}>
          Questions ({filteredQuestions.length})
        </h3>

        {/* Question Control Buttons */}
        {currentQuestion && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2">Selected Question: {currentQuestion.title}</h4>
            <div className="flex space-x-2">
              <button
                onClick={() => sendQuestionToPlayers(currentQuestion)}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                disabled={displayedQuestion?.title === currentQuestion.title}
              >
                {displayedQuestion?.title === currentQuestion.title ? 'Already Sent' : 'Send to Players'}
              </button>
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
          {filteredQuestions.map(question => (
            <div
              key={question.title}
              className={styles.getQuestionItem(currentQuestion?.title === question.title)}
              onClick={() => setCurrentQuestion(question)}
            >
              <div className={styles.questionContent}>
                <div>
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
