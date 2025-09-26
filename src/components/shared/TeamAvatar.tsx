import React from 'react';
import { Team } from '../../types';
import { PlayerAvatar } from './PlayerAvatar';

interface TeamAvatarProps {
    team: Team;
    size?: 'small' | 'medium' | 'large';
    maxVisible?: number;
    className?: string;
}

export const TeamAvatar: React.FC<TeamAvatarProps> = ({
    team,
    size = 'medium',
    maxVisible = 4,
    className = ''
}) => {
    const getSizeConfig = () => {
        switch (size) {
            case 'small':
                return {
                    containerWidth: '40px',
                    containerHeight: '24px',
                    offset: 8,
                    avatarSize: 'small' as const
                };
            case 'medium':
                return {
                    containerWidth: '60px',
                    containerHeight: '40px',
                    offset: 12,
                    avatarSize: 'medium' as const
                };
            case 'large':
                return {
                    containerWidth: '80px',
                    containerHeight: '48px',
                    offset: 16,
                    avatarSize: 'large' as const
                };
        }
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'small': return 'w-6 h-6 text-xs';
            case 'medium': return 'w-10 h-10 text-sm';
            case 'large': return 'w-12 h-12 text-base';
        }
    };

    const { containerWidth, containerHeight, offset, avatarSize } = getSizeConfig();
    const sizeClasses = getSizeClasses();

    if (!team.players || team.players.length === 0) {
        return (
            <div className={`${sizeClasses} rounded-full bg-blue-300 flex items-center justify-center text-blue-800 font-semibold ${className}`}>
                T
            </div>
        );
    }

    const visiblePlayers = team.players.slice(0, maxVisible);

    return (
        <div
            className={`relative ${className}`}
            style={{ width: containerWidth, height: containerHeight }}
        >
            {visiblePlayers.map((player, index) => {
                const zIndex = visiblePlayers.length - index;
                const leftOffset = index * offset;

                if (player.profilePicture) {
                    return (
                        <div
                            key={player.name}
                            className="absolute"
                            style={{ left: `${leftOffset}px`, zIndex }}
                        >
                            <img
                                src={player.profilePicture}
                                alt={player.name}
                                className={`${sizeClasses} rounded-full object-cover border-2 border-white shadow-sm`}
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
                                className={`absolute top-0 left-0 ${sizeClasses} rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold border-2 border-white shadow-sm`}
                                style={{ display: 'none' }}
                            >
                                {player.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    );
                }

                return (
                    <div
                        key={player.name}
                        className={`absolute ${sizeClasses} rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold border-2 border-white shadow-sm`}
                        style={{ left: `${leftOffset}px`, zIndex }}
                    >
                        {player.name.charAt(0).toUpperCase()}
                    </div>
                );
            })}
            {team.players.length > maxVisible && (
                <div
                    className={`absolute ${sizeClasses} rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-semibold border-2 border-white shadow-sm`}
                    style={{ left: `${maxVisible * offset}px`, zIndex: 0 }}
                >
                    +{team.players.length - maxVisible}
                </div>
            )}
        </div>
    );
};
