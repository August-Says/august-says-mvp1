
import { Section } from '../types';
import { OutputStructure } from './types';

/**
 * Process the fourth output object (activation add-ons)
 */
export const processFourthOutput = (output: string | OutputStructure): Section[] => {
  const sections: Section[] = [];
  console.log("Processing fourth output object:", typeof output);
  
  // Handle string output (markdown)
  if (typeof output === 'string') {
    try {
      const parsedOutput = JSON.parse(output);
      console.log("Successfully parsed string output as JSON");
      
      // Process structured object
      if (parsedOutput.activation_add_ons) {
        return processActivationAddons(parsedOutput.activation_add_ons);
      }
    } catch (e) {
      sections.push({
        title: "Activation Add-ons",
        content: output
      });
      console.log("Added activation add-ons from string output");
    }
  } else if (output && typeof output === 'object') {
    // Process structured activation_add_ons
    if (output.activation_add_ons) {
      return processActivationAddons(output.activation_add_ons);
    } else {
      console.log("No activation_add_ons found in fourth output");
    }
  }
  
  return sections;
};

/**
 * Process activation add-ons array
 */
const processActivationAddons = (addons: any[]): Section[] => {
  const sections: Section[] = [];
  
  if (Array.isArray(addons)) {
    console.log(`Processing ${addons.length} activation add-ons`);
    let addonsContent = '';
    addons.forEach((addon: any, i: number) => {
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
    console.log("Added activation add-ons section");
  } else {
    console.log("activation_add_ons is not an array");
  }
  
  return sections;
};
