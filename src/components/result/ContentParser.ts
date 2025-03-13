
interface Section {
  title: string;
  content: string;
}

export const processContent = (content: string): Section[] => {
  let data;
  try {
    // Try to parse the content as JSON
    data = JSON.parse(content);
    
    if (Array.isArray(data)) {
      // Process each item in the array
      const sections: Section[] = [];
      
      data.forEach(item => {
        if (item.output) {
          // Handle Summary and Objective
          if (item.output.Summary) {
            sections.push({
              title: 'Summary',
              content: item.output.Summary
            });
          }
          
          if (item.output.Objective) {
            sections.push({
              title: 'Objective',
              content: item.output.Objective
            });
          }
          
          // Handle insights
          if (item.output.insights) {
            item.output.insights.forEach((insight: any) => {
              sections.push({
                title: insight.category,
                content: insight.description
              });
            });
          }
          
          // Handle Strategic Implications
          if (item.output['Strategic Implications']) {
            const implications = item.output['Strategic Implications'];
            sections.push({
              title: 'Strategic Implications',
              content: Array.isArray(implications) 
                ? implications.map((imp: string, i: number) => `${i+1}. ${imp}`).join('\n\n')
                : implications
            });
          }
          
          // Handle Canvass Definition
          if (item.output[' Canvass Definition ']) {
            sections.push({
              title: 'What is a Canvass',
              content: item.output[' Canvass Definition ']
            });
          }
          
          // Handle Recommended Canvass
          if (item.output['Recommended Canvass']) {
            sections.push({
              title: 'Recommended Canvass Format',
              content: item.output['Recommended Canvass']
            });
          }
          
          // Handle questions
          if (item.output.questions) {
            let questionsContent = '';
            item.output.questions.forEach((q: any, i: number) => {
              questionsContent += `Question ${i+1}: ${q.question}\n\nOptions:\n`;
              q.options.forEach((opt: string) => {
                questionsContent += `- ${opt}\n`;
              });
              questionsContent += '\n';
            });
            
            sections.push({
              title: 'Questions',
              content: questionsContent
            });
          }
          
          // Handle activation add-ons
          if (item.output.activation_add_ons) {
            let addonsContent = '';
            item.output.activation_add_ons.forEach((addon: any, i: number) => {
              addonsContent += `${i+1}. ${addon.Strategy}\n\n`;
              addonsContent += `Execution Plan: ${addon['Execution Plan']}\n\n`;
              addonsContent += `Copy Example: ${addon['Copy Example']}\n\n`;
            });
            
            sections.push({
              title: 'Activation Add-ons',
              content: addonsContent
            });
          }
        }
      });
      
      return sections;
    }
  } catch (e) {
    // If JSON parsing fails, try to split content into sections
    console.error("Error parsing content:", e);
    return splitIntoSections(content);
  }
  
  // Fallback to legacy method
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
