
import { FormData } from "@/hooks/useFormSubmission";

export const generateMarketingCanvas = (data: string, currentFormData?: FormData): string => {
  // Extract client details from the data parameter if possible or create a generic response
  let clientName = "the client";
  let targetAudience = "target audience";
  let location = "the market";
  let productService = "products/services";
  let relationalSentiment = "customer needs";
  let clientIndustry = "industry";
  
  try {
    // Try to extract information from the data string
    const parsedData = JSON.parse(data) as FormData;
    clientName = parsedData.clientName || clientName;
    targetAudience = parsedData.targetAudience || targetAudience;
    location = parsedData.location || location;
    productService = parsedData.productService || productService;
    relationalSentiment = parsedData.relationalSentiment || relationalSentiment;
    clientIndustry = parsedData.clientIndustry || clientIndustry;
  } catch (e) {
    // If data is not valid JSON, use the current formData if provided
    if (currentFormData) {
      clientName = currentFormData.clientName || clientName;
      targetAudience = currentFormData.targetAudience || targetAudience;
      location = currentFormData.location || location;
      productService = currentFormData.productService || productService;
      relationalSentiment = currentFormData.relationalSentiment || relationalSentiment;
      clientIndustry = currentFormData.clientIndustry || clientIndustry;
    }
  }
  
  return `# Marketing Canvas for ${clientName}

## Executive Summary
A strategic marketing canvas designed for ${clientName} targeting ${targetAudience} in ${location}. This canvas focuses on ${productService} with emphasis on ${relationalSentiment}.

## Target Audience
The primary audience comprises ${targetAudience} with specific needs related to ${productService} in the ${clientIndustry} sector.

## Key Messages
1. Emphasize trust and reliability in all communications
2. Focus on unique selling propositions of ${productService}
3. Address customer pain points around ${relationalSentiment}

## Channel Strategy
Multi-channel approach leveraging digital and traditional media to reach ${targetAudience} in ${location}.

## Implementation Timeline
- Week 1-2: Initial research and concept development
- Week 3-4: Content creation and channel preparation
- Week 5-6: Campaign launch and initial monitoring
- Week 7-8: Performance review and optimization

## Budget Allocation
- Research & Strategy: 20%
- Creative Development: 30%
- Media Placement: 35%
- Monitoring & Optimization: 15%

## Success Metrics
- Engagement rates across all platforms
- Lead generation quantity and quality
- Conversion rates
- Customer satisfaction related to ${relationalSentiment}
- ROI measurement`;
};
