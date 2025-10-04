import React from 'react';
import { Player } from '../../types';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

interface PlayerAvatarProps {
    player: Player;
    size?: 'small' | 'medium' | 'large';
    className?: string;
    teamColor?: string;
}
const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 8,
    },
    avatar: {
        width: 64,
        height: 64,
        marginBottom: 8,
    },
    name: {
        fontWeight: 500,
    },
});

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ player, className = '', teamColor }) => {
    const classes = useStyles();
    return (
        <div className={`${classes.root} ${className}`}>
            <Avatar
                src={player.profilePicture}
                alt={player.name}
                className={classes.avatar}
                sx={{
                    border: teamColor ? `4px solid ${teamColor}` : undefined,
                    width: 64,
                    height: 64,
                    boxSizing: 'border-box',
                    objectFit: 'cover',
                }}
            >
                {!player.profilePicture && player.name.charAt(0).toUpperCase()}
            </Avatar>
        </div>
    );
};
export default PlayerAvatar;
