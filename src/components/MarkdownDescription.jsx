import React from 'react';
import styles from '@styles/MarkdownDescription.module.scss';

/**
 * Lightweight Markdown renderer for AI-generated product descriptions.
 * Handles the structured format produced by aiCopyService:
 *   ## Title, ### Section, - bullets, **bold**, FAQ blocks (**Q?**\nAnswer)
 *
 * No external dependencies — avoids adding react-markdown to the bundle.
 */

function parseInline(text) {
  // Split on **...** to render bold spans
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <strong key={i}>{part}</strong>
      : part
  );
}

const MarkdownDescription = ({ text }) => {
  if (!text || typeof text !== 'string') return null;

  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) { i++; continue; }

    // ## H2 — commercial title
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={i} className={styles.h2}>{trimmed.slice(3)}</h2>
      );
      i++;
      continue;
    }

    // ### H3 — section header
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={i} className={styles.h3}>{trimmed.slice(4)}</h3>
      );
      i++;
      continue;
    }

    // - bullet item
    if (trimmed.startsWith('- ')) {
      const bullets = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        bullets.push(
          <li key={i} className={styles.li}>{parseInline(lines[i].trim().slice(2))}</li>
        );
        i++;
      }
      elements.push(<ul key={`ul-${i}`} className={styles.ul}>{bullets}</ul>);
      continue;
    }

    // **Bold question?** followed by answer on next non-empty line → FAQ item
    const faqMatch = trimmed.match(/^\*\*(.+\?)\*\*$/);
    if (faqMatch) {
      const question = faqMatch[1];
      i++;
      // Collect answer lines until next blank or heading
      const answerLines = [];
      while (i < lines.length && lines[i].trim() && !lines[i].trim().startsWith('#') && !lines[i].trim().startsWith('**')) {
        answerLines.push(lines[i].trim());
        i++;
      }
      elements.push(
        <div key={`faq-${i}`} className={styles.faqItem}>
          <p className={styles.faqQ}>{question}</p>
          {answerLines.length > 0 && (
            <p className={styles.faqA}>{parseInline(answerLines.join(' '))}</p>
          )}
        </div>
      );
      continue;
    }

    // Plain paragraph
    elements.push(
      <p key={i} className={styles.p}>{parseInline(trimmed)}</p>
    );
    i++;
  }

  return <div className={styles.root}>{elements}</div>;
};

export default MarkdownDescription;
