import React from 'react';
import { Player, Team } from '../../types';
import { PlayerAvatar } from './PlayerAvatar';
import { TeamAvatar } from './TeamAvatar';

export interface EntityInfo {
    type: 'player' | 'team' | 'unknown';
    name: string;
    data?: Player | Team;
}

interface EntityDisplayProps {
    entity: EntityInfo;
    showType?: boolean;
    avatarSize?: 'small' | 'medium' | 'large';
    className?: string;
}

export const EntityDisplay: React.FC<EntityDisplayProps> = ({
    entity,
    showType = true,
    avatarSize = 'medium',
    className = ''
}) => {
    const renderAvatar = () => {
        if (entity.type === 'player' && entity.data) {
            return <PlayerAvatar player={entity.data as Player} size={avatarSize} />;
        }

        if (entity.type === 'team' && entity.data) {
            return <TeamAvatar team={entity.data as Team} size={avatarSize} />;
        }

        // Fallback for unknown type
        const sizeClasses = avatarSize === 'small' ? 'w-6 h-6 text-xs' :
            avatarSize === 'medium' ? 'w-10 h-10 text-sm' :
                'w-12 h-12 text-base';

        return (
            <div className={`${sizeClasses} rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold`}>
                ?
            </div>
        );
    };

    return (
        <div className={`flex items-center space-x-3 flex-1 min-w-0 ${className}`}>
            {renderAvatar()}

            <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                    <span className="font-medium truncate">{entity.name}</span>
                    {showType && (
                        <span className={`text-xs px-2 py-1 rounded-full ${entity.type === 'team' ? 'bg-blue-100 text-blue-800' :
                                entity.type === 'player' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                            }`}>
                            {entity.type}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper function to create EntityInfo from players and teams
export const createEntityInfo = (
    name: string,
    players: Player[],
    teams: Team[]
): EntityInfo => {
    // Check if it's a team
    const team = teams.find(t => t.name === name);
    if (team) {
        return {
            type: 'team',
            name: team.name,
            data: team
        };
    }

    // Check if it's a player
    const player = players.find(p => p.name === name);
    if (player) {
        return {
            type: 'player',
            name: player.name,
            data: player
        };
    }

    // Fallback for unknown entries
    return {
        type: 'unknown',
        name: name
    };
};
