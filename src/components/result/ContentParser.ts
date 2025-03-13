
interface Section {
  title: string;
  content: string;
}

export const processContent = (content: string): Section[] => {
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      return parsed.flatMap(item => {
        const output = item.output || item.canvas || '';
        if (!output) return [];
        return splitIntoSections(output);
      }).filter(section => section && section.content.trim());
    } else if (typeof parsed === 'object' && (parsed.output || parsed.canvas)) {
      const output = parsed.output || parsed.canvas;
      return splitIntoSections(output);
    }
  } catch (e) {
    return splitIntoSections(content);
  }
  return [];
};

export const splitIntoSections = (content: string): Section[] => {
  const sectionPattern = /(?:###\s*|##\s*|\*\*)(SUMMARY|OBJECTIVE|THE OUTCOME|STRATEGIC IMPLICATIONS|WHAT IS A CANVASS|RECOMMENDED CANVASS FORMAT)(?:\s*:|\*\*\s*:|\*\*)/gi;
  
  const matches = [...content.matchAll(new RegExp(sectionPattern, 'gi'))];
  
  const sections: Section[] = [];
  
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const startPos = match.index!;
    const endPos = i < matches.length - 1 ? matches[i + 1].index! : content.length;
    
    const titleMatch = match[0];
    const titleContent = match[1];
    const cleanTitle = titleContent.trim();
    
    const sectionContent = content.substring(startPos + titleMatch.length, endPos).trim();
    
    if (sectionContent) {
      sections.push({
        title: cleanTitle,
        content: sectionContent
      });
    }
  }
  
  return sections;
};

export const formatSectionTitle = (title: string): string => {
  title = title.toUpperCase();
  
  switch (title) {
    case 'SUMMARY':
      return 'Summary';
    case 'OBJECTIVE':
      return 'Objective';
    case 'THE OUTCOME':
      return 'The Outcome';
    case 'STRATEGIC IMPLICATIONS':
      return 'Strategic Implications';
    case 'WHAT IS A CANVASS':
      return 'What is a Canvass';
    case 'RECOMMENDED CANVASS FORMAT':
      return 'Recommended Canvass Format';
    default:
      return title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
  }
};
