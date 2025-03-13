
interface Section {
  title: string;
  content: string;
}

export const processContent = (content: string): Section[] => {
  let data;
  try {
    // Try to parse the content as JSON
    data = JSON.parse(content);
    
    // If we can parse as JSON, check for our expected schema format
    if (typeof data === 'object') {
      const sections: Section[] = [];
      
      // Process Report Title
      if (data.report_title) {
        sections.push({
          title: "Report Title",
          content: data.report_title
        });
      }
      
      // Process Introduction section
      if (data.introduction) {
        if (data.introduction.Summary) {
          sections.push({
            title: "Summary",
            content: data.introduction.Summary
          });
        }
        
        if (data.introduction.Objective) {
          sections.push({
            title: "Objective",
            content: data.introduction.Objective
          });
        }
      }
      
      // Process Canvass section
      if (data.canvass) {
        if (data.canvass.definition) {
          sections.push({
            title: "What is a Canvass",
            content: data.canvass.definition
          });
        }
        
        if (data.canvass.recommended_format) {
          sections.push({
            title: "Recommended Canvass Format",
            content: data.canvass.recommended_format
          });
        }
        
        if (data.canvass.questions && Array.isArray(data.canvass.questions)) {
          let questionsContent = '';
          data.canvass.questions.forEach((q: any, i: number) => {
            questionsContent += `Question ${i+1}: ${q.question}\n\nOptions:\n`;
            q.options.forEach((opt: string) => {
              questionsContent += `- ${opt}\n`;
            });
            questionsContent += '\n';
          });
          
          sections.push({
            title: "Questions",
            content: questionsContent
          });
        }
      }
      
      // Process Outcome section
      if (data.outcome) {
        // Process insights
        if (data.outcome.insights && Array.isArray(data.outcome.insights)) {
          data.outcome.insights.forEach((insight: any) => {
            sections.push({
              title: insight.category,
              content: insight.description
            });
          });
        }
        
        // Process strategic implications
        if (data.outcome.strategic_implications && Array.isArray(data.outcome.strategic_implications)) {
          const implications = data.outcome.strategic_implications.map(
            (imp: string, i: number) => `${i+1}. ${imp}`
          ).join('\n\n');
          
          sections.push({
            title: "Strategic Implications",
            content: implications
          });
        }
      }
      
      // Process Activation Add-ons
      if (data.activation_add_ons && Array.isArray(data.activation_add_ons)) {
        let addonsContent = '';
        data.activation_add_ons.forEach((addon: any, i: number) => {
          addonsContent += `${i+1}. ${addon.strategy}\n\n`;
          if (addon.details) {
            addonsContent += `Execution Plan: ${addon.details}\n\n`;
          }
          if (addon.copy_example) {
            addonsContent += `Copy Example: ${addon.copy_example}\n\n`;
          }
        });
        
        sections.push({
          title: "Activation Add-ons",
          content: addonsContent
        });
      }
      
      if (sections.length > 0) {
        return sections;
      }
    }
  } catch (e) {
    // If JSON parsing fails, try to split content into sections
    console.error("Error parsing content:", e);
  }
  
  // If we get here, either JSON parsing failed or the structure wasn't as expected
  // Fallback to legacy method to split into sections
  return splitIntoSections(content);
};

export const splitIntoSections = (content: string): Section[] => {
  // Try to detect markdown headings
  const headingPattern = /(?:^|\n)(#+)\s+(.+)(?:\n|$)/g;
  let match;
  const sections: Section[] = [];
  let lastIndex = 0;
  
  while ((match = headingPattern.exec(content)) !== null) {
    const headingLevel = match[1].length;
    const title = match[2].trim();
    const startIndex = match.index + match[0].length;
    
    // If this isn't the first heading, capture the content from the previous heading
    if (lastIndex > 0) {
      const sectionContent = content.substring(lastIndex, match.index).trim();
      if (sectionContent) {
        sections.push({
          title: sections[sections.length - 1].title,
          content: sectionContent
        });
      }
    }
    
    sections.push({
      title,
      content: '' // Will be filled in the next iteration or at the end
    });
    
    lastIndex = startIndex;
  }
  
  // Handle the last section's content
  if (lastIndex > 0 && lastIndex < content.length) {
    const sectionContent = content.substring(lastIndex).trim();
    if (sectionContent) {
      sections[sections.length - 1].content = sectionContent;
    }
  }
  
  // If no headings were found, check for sections marked by other patterns
  if (sections.length === 0) {
    const sectionPattern = /(?:###\s*|##\s*|\*\*)(SUMMARY|OBJECTIVE|THE OUTCOME|STRATEGIC IMPLICATIONS|WHAT IS A CANVASS|RECOMMENDED CANVASS FORMAT)(?:\s*:|\*\*\s*:|\*\*)/gi;
    
    const matches = [...content.matchAll(new RegExp(sectionPattern, 'gi'))];
    
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
  }
  
  // If still no sections, create a single section from the entire content
  if (sections.length === 0 && content.trim()) {
    sections.push({
      title: 'Summary',
      content: content.trim()
    });
  }
  
  return sections;
};

export const formatSectionTitle = (title: string): string => {
  // Ensure title is a string
  if (typeof title !== 'string') {
    return 'Section';
  }
  
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
    case 'EMOTIONAL CONNECTION':
      return 'Emotional Connection';
    case 'TRUST AND RELIABILITY':
      return 'Trust and Reliability';
    case 'PRODUCT UNDERSTANDING AND RELEVANCE':
      return 'Product Understanding and Relevance';
    case 'VALUE PERCEPTION':
      return 'Value Perception';
    case 'CUSTOMER SUPPORT AND ENGAGEMENT':
      return 'Customer Support and Engagement';
    case 'QUESTIONS':
      return 'Questions';
    case 'ACTIVATION ADD-ONS':
      return 'Activation Add-ons';
    default:
      return title.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
  }
};
