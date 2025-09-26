import { useMemo } from 'react';

// App styles
export const useAppStyles = () => {
    return useMemo(() => ({
        nav: "bg-gray-800 text-white p-4",
        navContainer: "max-w-7xl mx-auto flex justify-between items-center",
        navTitle: "text-xl font-bold",
        navButtons: "space-x-2",
        getNavButton: (isActive: boolean) =>
            `px-3 py-1 rounded ${isActive ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-500'}`,
        getNavButtonGameMaster: (isActive: boolean) =>
            `px-3 py-1 rounded ${isActive ? 'bg-red-600' : 'bg-gray-600 hover:bg-gray-500'}`
    }), []);
};

// Timer styles
export const useTimerStyles = () => {
    return useMemo(() => ({
        container: "timer-container flex flex-col items-center space-y-4",
        timerDisplay: "flex justify-center items-center",
        controls: "flex space-x-3",
        pauseResumeButton: "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors",
        resetButton: "px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
    }), []);
};

// PhotoDisplay styles
export const usePhotoDisplayStyles = () => {
    return useMemo(() => ({
        container: (className: string) => `photo-display ${className}`,
        image: "max-w-full h-auto rounded-lg shadow-md"
    }), []);
};

// Scoreboard styles
export const useScoreboardStyles = () => {
    return useMemo(() => ({
        container: "scoreboard bg-white p-4 rounded-lg shadow-md",
        title: "text-2xl font-bold mb-4 text-center",
        list: "space-y-3",
        scoreItem: "flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors",
        scoreLeft: "flex items-center space-x-2",
        rank: "text-lg font-semibold text-gray-600",
        name: "text-lg",
        score: "text-xl font-bold text-blue-600",
        emptyState: "text-center text-gray-500 py-4"
    }), []);
};

// QuestionDisplay styles
export const useQuestionDisplayStyles = () => {
    return useMemo(() => ({
        waiting: "question-display text-center p-8 bg-gray-100 rounded-lg",
        waitingTitle: "text-2xl text-gray-600",
        container: "question-display bg-white p-6 rounded-lg shadow-md",
        header: "mb-4",
        title: "text-3xl font-bold mb-2",
        tagsContainer: "flex items-center space-x-4 text-sm text-gray-600 mb-4",
        difficultyTag: "bg-blue-100 px-2 py-1 rounded",
        tag: "bg-gray-100 px-2 py-1 rounded",
        content: "mb-6",
        contentText: "text-xl leading-relaxed",
        photoContainer: "mb-6",
        photoWrapper: "max-w-md mx-auto",
        answererInfo: "mb-4 p-3 bg-blue-50 rounded",
        timerContainer: "text-center"
    }), []);
};

// PlayerView styles
export const usePlayerViewStyles = () => {
    return useMemo(() => ({
        container: "player-view min-h-screen bg-gray-50 p-4",
        wrapper: "max-w-4xl mx-auto space-y-6",
        header: "text-center",
        title: "text-4xl font-bold text-blue-600 mb-2",
        status: "text-gray-600 capitalize",
        grid: "grid grid-cols-1 lg:grid-cols-3 gap-6",
        questionSection: "lg:col-span-2",
        scoreboardSection: "lg:col-span-1"
    }), []);
};

// PlayerSetup styles
export const usePlayerSetupStyles = () => {
    return useMemo(() => ({
        container: "player-setup space-y-6",
        section: "bg-white p-4 rounded-lg shadow",
        sectionTitle: "text-xl font-semibold mb-4",
        addPlayerForm: "flex space-x-2 mb-4",
        input: "flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500",
        fullWidthInput: "w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500",
        addButton: "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600",
        playersList: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3",
        playerCard: "bg-gray-50 rounded-lg p-3 flex items-center space-x-3 hover:bg-gray-100 transition-colors",
        playerAvatar: "w-12 h-12 rounded-full object-cover bg-gray-300 flex-shrink-0",
        playerAvatarPlaceholder: "w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-sm flex-shrink-0",
        playerInfo: "flex-1 min-w-0",
        playerName: "font-medium text-gray-900 truncate",
        removeButton: "text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50",
        // Legacy styles for backward compatibility
        playerItem: "flex justify-between items-center p-2 bg-gray-50 rounded",
        teamInput: "w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2",
        playerSelection: "mb-4",
        selectionLabel: "text-sm text-gray-600 mb-2",
        checkboxList: "space-y-1",
        checkboxItem: "flex items-center",
        checkbox: "mr-2",
        createTeamButton: "px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400",
        teamsList: "space-y-2",
        teamItem: "p-3 bg-gray-50 rounded",
        teamHeader: "flex justify-between items-center mb-2",
        teamName: "font-semibold",
        teamPlayers: "text-sm text-gray-600"
    }), []);
};

// QuestionSelector styles
export const useQuestionSelectorStyles = () => {
    return useMemo(() => ({
        container: "question-selector space-y-4",
        section: "bg-white p-4 rounded-lg shadow",
        sectionTitle: "text-xl font-semibold mb-4",
        fileInput: "mb-2",
        helpText: "text-sm text-gray-600",
        filtersContainer: "space-y-4",
        searchInput: "w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500",
        filterGroup: "space-y-2",
        filterTitle: "font-semibold mb-2",
        difficultyFilters: "flex space-x-2",
        tagFilters: "flex flex-wrap gap-2",
        checkboxLabel: "flex items-center",
        checkboxInput: "mr-1",
        tagSpan: "text-sm bg-gray-100 px-2 py-1 rounded",
        questionsHeader: "text-xl font-semibold mb-4",
        questionsList: "space-y-2 max-h-96 overflow-y-auto",
        getQuestionItem: (isSelected: boolean) =>
            `p-3 border rounded cursor-pointer transition-colors ${isSelected ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'
            }`,
        questionContent: "flex justify-between items-start",
        questionTitle: "font-semibold",
        questionPreview: "text-sm text-gray-600 mt-1",
        questionTags: "flex items-center space-x-2 mt-2 text-xs",
        difficultyBadge: "bg-blue-100 px-2 py-1 rounded",
        timerBadge: "bg-yellow-100 px-2 py-1 rounded",
        tagBadge: "bg-gray-100 px-2 py-1 rounded"
    }), []);
};

// TimerControl styles
export const useTimerControlStyles = () => {
    return useMemo(() => ({
        container: "timer-control bg-white p-4 rounded-lg shadow",
        title: "text-xl font-semibold mb-4",
        content: "space-y-4",
        timerDisplay: "text-center",
        quickStartSection: "space-y-2",
        quickStartTitle: "font-semibold",
        quickStartButtons: "flex flex-wrap gap-2",
        quickStartButton: "px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600",
        questionTimerButton: "w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600",
        customTimerContainer: "flex items-center space-x-2",
        customTimerInput: "flex-1 px-2 py-1 border rounded",
        customTimerButton: "px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
    }), []);
};

// ScoreControl styles
export const useScoreControlStyles = () => {
    return useMemo(() => ({
        container: "score-control bg-white p-4 rounded-lg shadow space-y-4",
        title: "text-xl font-semibold",
        noQuestionContainer: "score-control bg-white p-4 rounded-lg shadow",
        noQuestionTitle: "text-xl font-semibold mb-4",
        noQuestionText: "text-gray-600",
        questionInfo: "bg-gray-50 p-3 rounded",
        questionTitle: "font-semibold",
        questionContent: "text-sm text-gray-600 mt-1",
        answerBox: "mt-2 p-2 bg-green-100 rounded",
        sectionTitle: "font-semibold mb-2",
        answerModeButtons: "flex space-x-2",
        getModeButton: (isSelected: boolean) =>
            `px-3 py-1 rounded capitalize ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`,
        answererList: "space-y-1",
        answererLabel: "flex items-center",
        radioInput: "mr-2",
        pointsContainer: "flex items-center space-x-2 mb-3",
        pointsInput: "w-20 px-2 py-1 border rounded",
        actionButtons: "space-y-2",
        buttonRow: "flex space-x-2",
        correctButton: "px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400",
        wrongButton: "px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400",
        customButton: "px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400",
        manualAdjustment: "flex items-center space-x-2",
        select: "flex-1 px-2 py-1 border rounded",
        manualInput: "w-20 px-2 py-1 border rounded",
        applyButton: "px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-400",
        duelContainer: "grid grid-cols-1 md:grid-cols-2 gap-4",
        duelColumn: "space-y-2",
        duelColumnTitle: "font-semibold text-center mb-2 text-sm text-gray-600",
        duelOpponentList: "space-y-1",
        duelOpponentLabel: "flex items-center p-2 border rounded hover:bg-gray-50 cursor-pointer",
        getDuelOpponentLabel: (isSelected: boolean) =>
            `flex items-center p-2 border rounded cursor-pointer ${isSelected ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'}`,
        duelRadioInput: "mr-2",
        selectedOpponentsInfo: "bg-blue-50 p-3 rounded mb-4",
        selectedOpponentsTitle: "font-semibold mb-2",
        selectedOpponentsList: "text-sm text-gray-700"
    }), []);
};

// GameMasterView styles
export const useGameMasterViewStyles = () => {
    return useMemo(() => ({
        container: "game-master-view min-h-screen bg-gray-50 p-4",
        wrapper: "max-w-7xl mx-auto space-y-6",
        header: "text-center",
        title: "text-4xl font-bold text-red-600 mb-2",
        stateButtons: "flex justify-center space-x-2",
        getStateButton: (isActive: boolean) =>
            `px-4 py-2 rounded capitalize ${isActive ? 'bg-red-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`,
        setupGrid: "grid grid-cols-1 lg:grid-cols-2 gap-6",
        ongoingGrid: "grid grid-cols-1 lg:grid-cols-3 gap-6",
        ongoingLeft: "lg:col-span-2 space-y-6",
        ongoingRight: "space-y-6",
        completedContainer: "text-center",
        completedTitle: "text-3xl font-bold mb-6",
        completedScoreboard: "max-w-md mx-auto",
        newGameButton: "mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
    }), []);
};

// PlayerView styles (message-based)
export const useMessageBasedPlayerViewStyles = () => {
    return useMemo(() => ({
        container: "min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col",
        header: "bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg p-6 flex-shrink-0",
        headerTitle: "text-4xl font-bold text-white text-center drop-shadow-sm",
        answererInfo: "text-xl text-blue-100 mt-3 text-center font-medium",
        answererName: "font-bold text-white bg-blue-500 bg-opacity-30 px-3 py-1 rounded-full",
        contentWrapper: "flex-1 p-6 overflow-y-auto flex flex-col",
        ongoingContent: "flex-1 flex flex-col relative",
        loadingContainer: "min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center",
        loadingContent: "text-center p-8 bg-white bg-opacity-80 rounded-2xl shadow-xl backdrop-blur-sm",
        loadingTitle: "text-7xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-6",
        loadingText: "text-4xl text-gray-700 font-medium",
        setupContainer: "flex-1 flex items-center justify-center text-center h-full",
        setupText: "text-4xl text-blue-600 font-semibold",
        completedContainer: "flex-1 flex flex-col items-center justify-center text-center",
        completedTitle: "text-7xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6",
        // Floating players styles - enhanced for social interaction
        floatingPlayersContainer: "fixed bottom-6 left-6 right-6 pointer-events-none z-30",
        floatingPlayersWrapper: "flex justify-between items-end",
        floatingPlayerGroup: "flex flex-col space-y-4",
        floatingPlayerIcon: "bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-xl p-4 border-3 border-white pointer-events-auto transform hover:scale-110 transition-all duration-200 hover:shadow-2xl",
        floatingPlayerLabel: "text-sm font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg px-3 py-2 shadow-lg border-2 border-blue-300 max-w-32 truncate mt-2",
        // Scoreboard styles - more vibrant
        scoreboardContainer: "bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl p-8 mb-8 border-2 border-blue-200",
        scoreboardTitle: "text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-6",
        scoreboardList: "space-y-3",
        scoreboardItem: "flex justify-between items-center py-3 px-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 border border-blue-200",
        scoreboardRank: "font-bold text-lg text-blue-700",
        scoreboardScore: "text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent",
        // Question styles - enhanced readability with color
        questionContainer: "bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-3xl shadow-2xl p-10 mb-8 flex-1 flex flex-col justify-center border-2 border-blue-200",
        questionTitle: "text-6xl font-bold bg-gradient-to-r from-gray-800 to-blue-800 bg-clip-text text-transparent mb-8 text-center leading-tight",
        questionSubtitle: "text-xl text-blue-700 mb-6 text-center font-medium",
        questionContent: "text-4xl text-gray-700 text-center leading-relaxed font-medium",
        // Timer styles - more prominent
        timerContainer: "fixed top-8 right-8 bg-gradient-to-br from-white to-orange-50 rounded-full shadow-2xl p-4 z-40 border-3 border-orange-200",
        timerDisplay: "flex justify-center items-center",
        timerTitle: "text-2xl font-bold text-orange-700 mb-2",
        getTimerDisplay: (timeRemaining: number) =>
            `text-6xl font-bold ${timeRemaining <= 10 ? 'text-red-600' : timeRemaining <= 30 ? 'text-orange-600' : 'text-green-600'}`,
        // Waiting styles - more engaging
        waitingContainer: "bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-3xl shadow-2xl p-10 mb-8 text-center flex-1 flex flex-col justify-center border-2 border-blue-200",
        waitingTitle: "text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-4",
        waitingText: "text-2xl text-blue-600 font-medium"
    }), []);
};
