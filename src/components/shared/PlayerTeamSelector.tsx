import React from 'react';
import { Player, Team } from '../../types';

export interface SelectableItem {
    type: 'player' | 'team';
    name: string;
    profilePicture?: string;
    players?: Player[]; // For teams, to show member avatars
}

interface PlayerTeamSelectorProps {
    items: SelectableItem[];
    selectedItems: string[];
    onToggleSelection: (itemName: string) => void;
    selectionMode: 'single' | 'multiple' | 'champions';
    disabled?: string[]; // Items that should be disabled
    className?: string;
    showType?: boolean; // Whether to show (Player) or (Team) labels
    championsPerTeam?: number; // For champions mode
    teamName?: string; // For champions mode
}

export const PlayerTeamSelector: React.FC<PlayerTeamSelectorProps> = ({
    items,
    selectedItems,
    onToggleSelection,
    selectionMode,
    disabled = [],
    className = '',
    showType = true,
    championsPerTeam = 1,
    teamName = ''
}) => {
    const renderAvatar = (item: SelectableItem, size: 'small' | 'medium' = 'medium') => {
        const sizeClasses = size === 'small'
            ? 'w-6 h-6 text-xs'
            : 'w-8 h-8 text-sm';

        if (item.type === 'team') {
            // For teams, show the first member's avatar or a team placeholder
            const firstMember = item.players?.[0];
            if (firstMember?.profilePicture) {
                return (
                    <div className="flex items-center">
                        <img
                            src={firstMember.profilePicture}
                            alt={item.name}
                            className={`${sizeClasses} rounded-full object-cover`}
                            onError={(e) => {
                                const img = e.currentTarget;
                                const placeholder = img.nextElementSibling as HTMLElement;
                                img.style.display = 'none';
                                if (placeholder) {
                                    placeholder.style.display = 'flex';
                                }
                            }}
                        />
                        <div
                            className={`${sizeClasses} rounded-full bg-blue-300 flex items-center justify-center text-blue-800 font-semibold`}
                            style={{ display: 'none' }}
                        >
                            T
                        </div>
                    </div>
                );
            }
            return (
                <div className={`${sizeClasses} rounded-full bg-blue-300 flex items-center justify-center text-blue-800 font-semibold`}>
                    T
                </div>
            );
        }

        // For players
        if (item.profilePicture) {
            return (
                <div className="flex items-center">
                    <img
                        src={item.profilePicture}
                        alt={item.name}
                        className={`${sizeClasses} rounded-full object-cover`}
                        onError={(e) => {
                            const img = e.currentTarget;
                            const placeholder = img.nextElementSibling as HTMLElement;
                            img.style.display = 'none';
                            if (placeholder) {
                                placeholder.style.display = 'flex';
                            }
                        }}
                    />
                    <div
                        className={`${sizeClasses} rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold`}
                        style={{ display: 'none' }}
                    >
                        {item.name.charAt(0).toUpperCase()}
                    </div>
                </div>
            );
        }

        return (
            <div className={`${sizeClasses} rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold`}>
                {item.name.charAt(0).toUpperCase()}
            </div>
        );
    };

    const renderTeamMembers = (item: SelectableItem) => {
        if (item.type !== 'team' || !item.players?.length) return null;

        return (
            <div className="flex items-center space-x-1 ml-2">
                <span className="text-xs text-gray-500">Members:</span>
                <div className="flex -space-x-1">
                    {item.players.slice(0, 3).map((player, index) => (
                        <div key={player.name} className="relative" style={{ zIndex: 10 - index }}>
                            {renderAvatar({ type: 'player', name: player.name, profilePicture: player.profilePicture }, 'small')}
                        </div>
                    ))}
                    {item.players.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 border-2 border-white">
                            +{item.players.length - 3}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const isChampionsMode = selectionMode === 'champions';
    const canSelectMore = !isChampionsMode || selectedItems.length < championsPerTeam;

    return (
        <div className={`space-y-2 ${className}`}>
            {isChampionsMode && (
                <div className="text-sm text-gray-600 mb-2">
                    Select {championsPerTeam} champion{championsPerTeam !== 1 ? 's' : ''}
                    {teamName && ` for ${teamName}`}
                    ({selectedItems.length}/{championsPerTeam} selected)
                </div>
            )}

            {items.map(item => {
                const isSelected = selectedItems.includes(item.name);
                const isDisabled = disabled.includes(item.name) ||
                    (isChampionsMode && !isSelected && !canSelectMore);

                return (
                    <label
                        key={item.name}
                        className={`
              flex items-center p-2 border rounded cursor-pointer transition-colors
              ${isSelected ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'}
              ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
                    >
                        <input
                            type={selectionMode === 'single' ? 'radio' : 'checkbox'}
                            name={selectionMode === 'single' ? 'selector' : undefined}
                            checked={isSelected}
                            onChange={() => !isDisabled && onToggleSelection(item.name)}
                            disabled={isDisabled}
                            className="mr-3"
                        />

                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                            {renderAvatar(item)}

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                    <span className="font-medium truncate">{item.name}</span>
                                    {showType && (
                                        <span className={`
                      text-xs px-2 py-1 rounded-full
                      ${item.type === 'team' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}
                    `}>
                                            {item.type}
                                        </span>
                                    )}
                                </div>
                                {renderTeamMembers(item)}
                            </div>
                        </div>
                    </label>
                );
            })}
        </div>
    );
};

// Helper function to convert players and teams to SelectableItem format
export const createSelectableItems = (
    players: Player[] = [],
    teams: Team[] = [],
    includeTeams: boolean = true
): SelectableItem[] => {
    const playerItems: SelectableItem[] = players.map(player => ({
        type: 'player',
        name: player.name,
        profilePicture: player.profilePicture
    }));

    if (!includeTeams) return playerItems;

    const teamItems: SelectableItem[] = teams.map(team => ({
        type: 'team',
        name: team.name,
        players: team.players
    }));

    return [...playerItems, ...teamItems];
};
