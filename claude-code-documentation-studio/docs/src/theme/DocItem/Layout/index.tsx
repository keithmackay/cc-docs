import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {useWindowSize} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import DocItemPaginator from '@theme/DocItem/Paginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocItemFooter from '@theme/DocItem/Footer';
import DocItemTOCMobile from '@theme/DocItem/TOC/Mobile';
import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop';
import DocItemContent from '@theme/DocItem/Content';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import ContentVisibility from '@theme/ContentVisibility';
import type {Props} from '@theme/DocItem/Layout';
import ContentGate from '../../../components/Membership/ContentGate';
import VideoLesson from '../../../components/VideoLesson/VideoLesson';

import styles from './styles.module.css';

/**
 * Decide if the toc should be rendered, on mobile or desktop viewports
 */
function useDocTOC() {
  const {frontMatter, toc} = useDoc();
  const windowSize = useWindowSize();

  const hidden = frontMatter.hide_table_of_contents;
  const canRender = !hidden && toc.length > 0;

  const mobile = canRender ? <DocItemTOCMobile /> : undefined;

  const desktop =
    canRender && (windowSize === 'desktop' || windowSize === 'ssr') ? (
      <DocItemTOCDesktop />
    ) : undefined;

  return {
    hidden,
    mobile,
    desktop,
  };
}

export default function DocItemLayout({children}: Props): ReactNode {
  const docTOC = useDocTOC();
  const {metadata, frontMatter} = useDoc();

  // Extract course and module from frontmatter or metadata
  const courseId = frontMatter.courseId || 'docs';
  const moduleId = frontMatter.moduleId;

  // Check if this is a video lesson
  const isVideoLesson = frontMatter.videoUrl;
  const videoType = frontMatter.videoType || 'youtube';
  const nextLesson = frontMatter.nextLesson;
  const duration = frontMatter.duration;

  // Video lesson layout - with sidebar visible
  if (isVideoLesson) {
    const videoContent = (
      <div className="row">
        <div className={clsx('col', styles.docItemCol)}>
          <ContentVisibility metadata={metadata} />
          <DocVersionBanner />
          <div className={styles.docItemContainer}>
            <article>
              <DocBreadcrumbs />
              <DocVersionBadge />
              <VideoLesson
                videoUrl={frontMatter.videoUrl}
                videoType={videoType}
                nextLesson={nextLesson}
                duration={duration}
              />
              <DocItemContent>{children}</DocItemContent>
              <DocItemFooter />
            </article>
            <DocItemPaginator />
          </div>
        </div>
      </div>
    );

    return (
      <ContentGate courseId={courseId} moduleId={moduleId}>
        {videoContent}
      </ContentGate>
    );
  }

  // Regular text lesson layout with TOC
  const content = (
    <div className="row">
      <div className={clsx('col', !docTOC.hidden && styles.docItemCol)}>
        <ContentVisibility metadata={metadata} />
        <DocVersionBanner />
        <div className={styles.docItemContainer}>
          <article>
            <DocBreadcrumbs />
            <DocVersionBadge />
            {docTOC.mobile}
            <DocItemContent>{children}</DocItemContent>
            <DocItemFooter />
          </article>
          <DocItemPaginator />
        </div>
      </div>
      {docTOC.desktop && <div className="col col--3">{docTOC.desktop}</div>}
    </div>
  );

  // All docs content requires at least Free plan (user must be logged in)
  // ContentGate will show sign-in prompt if not logged in
  return (
    <ContentGate courseId={courseId} moduleId={moduleId}>
      {content}
    </ContentGate>
  );
}
