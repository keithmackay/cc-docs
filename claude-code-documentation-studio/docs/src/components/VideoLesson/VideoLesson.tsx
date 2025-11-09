import React from 'react';
import { useHistory } from '@docusaurus/router';
import styles from './VideoLesson.module.css';

interface VideoLessonProps {
  videoUrl: string;
  videoType?: 'youtube' | 'vimeo' | 'mp4';
  nextLesson?: string;
  duration?: string;
}

export default function VideoLesson({ videoUrl, videoType = 'youtube', nextLesson, duration }: VideoLessonProps) {
  const history = useHistory();

  const handleNextLesson = () => {
    if (nextLesson) {
      history.push(nextLesson);
    }
  };

  const renderVideo = () => {
    if (videoType === 'youtube') {
      // Extract YouTube ID from URL
      const youtubeId = videoUrl.includes('youtube.com')
        ? new URL(videoUrl).searchParams.get('v')
        : videoUrl.includes('youtu.be')
        ? videoUrl.split('/').pop()
        : videoUrl;

      return (
        <iframe
          className={styles.videoPlayer}
          src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
          title="Lesson Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    if (videoType === 'vimeo') {
      const vimeoId = videoUrl.split('/').pop();
      return (
        <iframe
          className={styles.videoPlayer}
          src={`https://player.vimeo.com/video/${vimeoId}`}
          title="Lesson Video"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      );
    }

    if (videoType === 'mp4') {
      return (
        <video className={styles.videoPlayer} controls>
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }

    return null;
  };

  return (
    <div className={styles.videoLessonContainer}>
      <div className={styles.videoWrapper}>
        {renderVideo()}
      </div>

      {nextLesson && (
        <div className={styles.nextLessonContainer}>
          <button onClick={handleNextLesson} className={styles.nextLessonButton}>
            <span className={styles.buttonText}>Next Lesson</span>
            <svg className={styles.buttonIcon} width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {duration && (
        <div className={styles.durationBadge}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0a8 8 0 110 16A8 8 0 018 0zm0 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM8 3a.5.5 0 01.5.5v4.793l2.854 2.853a.5.5 0 01-.708.708L7.5 8.707V3.5A.5.5 0 018 3z"/>
          </svg>
          <span>{duration}</span>
        </div>
      )}
    </div>
  );
}
