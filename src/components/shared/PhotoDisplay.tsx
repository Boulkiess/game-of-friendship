import React from 'react';
import { usePhotoDisplayStyles } from '../../hooks/useStyles';

interface PhotoDisplayProps {
  photoUrl?: string;
  alt?: string;
  className?: string;
}

export const PhotoDisplay: React.FC<PhotoDisplayProps> = ({ 
  photoUrl, 
  alt = 'Question photo', 
  className = '' 
}) => {
  const styles = usePhotoDisplayStyles();

  if (!photoUrl) return null;

  return (
    <div className={styles.container(className)}>
      <img 
        src={photoUrl} 
        alt={alt}
        className={styles.image}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
};
