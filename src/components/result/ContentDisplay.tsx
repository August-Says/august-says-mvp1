
import React from 'react';
import { Section } from '@/utils/contentProcessing/types';
import { SectionRenderer } from './section/SectionRenderer';

interface ContentDisplayProps {
  sections: Section[];
  formatSectionTitle: (title: string) => string;
  contentRef: React.RefObject<HTMLDivElement>;
  gameImages?: Array<{path: string, caption?: string}>;
}

const ContentDisplay = ({ sections, formatSectionTitle, contentRef, gameImages = [] }: ContentDisplayProps) => {
  return (
    <div ref={contentRef} className="space-y-8 text-white pdf-content">
      {sections.length > 0 ? (
        sections.map((section, index) => {
          const title = formatSectionTitle(section.title);
          const content = section.content.trim();
          const isQuestionsSection = title.toLowerCase() === 'questions';
          
          return (
            <SectionRenderer 
              key={index}
              title={title}
              content={content}
              index={index}
              gameImages={isQuestionsSection ? gameImages : undefined}
            />
          );
        })
      ) : (
        <div className="text-center py-10">
          <p className="text-white/80">No content could be parsed from the response. Please check the raw response for details.</p>
        </div>
      )}
    </div>
  );
};

export default ContentDisplay;
