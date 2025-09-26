import React from 'react';
import { Player } from '../../types';

interface PlayerAvatarProps {
    player: Player;
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
    player,
    size = 'medium',
    className = ''
}) => {
    const getSizeClasses = () => {
        switch (size) {
            case 'small': return 'w-6 h-6 text-xs';
            case 'medium': return 'w-10 h-10 text-sm';
            case 'large': return 'w-12 h-12 text-base';
        }
    };

    const sizeClasses = getSizeClasses();

    if (player.profilePicture) {
        return (
            <div className={`flex items-center ${className}`}>
                <img
                    src={player.profilePicture}
                    alt={player.name}
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
                    {player.name.charAt(0).toUpperCase()}
                </div>
            </div>
        );
    }

    return (
        <div className={`${sizeClasses} rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold ${className}`}>
            {player.name.charAt(0).toUpperCase()}
        </div>
    );
};
