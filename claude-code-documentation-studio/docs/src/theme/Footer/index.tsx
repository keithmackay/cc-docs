import React from 'react';
import styles from './styles.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.statusBar}>
        <span className={styles.statusIndicator}>
          <span className={styles.statusDot}></span>
          system ready
        </span>
        <span className={styles.version}>v1.0.0</span>
      </div>

      <div className={styles.container}>
        <div className={styles.copyright}>
          <span className={styles.prompt}>$</span> © {currentYear} Claude Code Templates - Academy
        </div>

        <nav className={styles.links}>
          <a
            href="https://github.com/davila7/claude-code-templates"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            <span className={styles.linkIcon}>{'>'}</span> GitHub
          </a>
          <span className={styles.separator}>│</span>
          <a href="/docs/intro" className={styles.ctaButton}>
            <span className={styles.ctaPrompt}>$</span>
            <span className={styles.ctaText}>start-learning</span>
            <span className={styles.ctaCursor}>_</span>
            <span className={styles.ctaArrow}>→</span>
          </a>
        </nav>

        <div className={styles.license}>
          Open Source • <a
            href="https://github.com/davila7/claude-code-templates/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.licenseLink}
          >
            MIT License
          </a>
        </div>
      </div>
    </footer>
  );
}
