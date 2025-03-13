
/**
 * Utility function for constructing and executing webhook requests
 */
export interface WebhookRequestParams {
  params: Record<string, string>;
  contentKey?: string;
  contentValue?: string;
  webhookUrl: string;
}

export interface WebhookResponse {
  data: any;
  rawResponse: string;
}

/**
 * Constructs URL parameters and makes the webhook request
 * 
 * @param options - Request parameters and webhook URL
 * @returns The webhook response data and raw response text
 */
export const executeWebhookRequest = async ({
  params,
  contentKey,
  contentValue,
  webhookUrl
}: WebhookRequestParams): Promise<WebhookResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params.additionalNotes) {
    queryParams.append('additionalNotes', params.additionalNotes);
    delete params.additionalNotes;
  }
  
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      queryParams.append(key, value);
    }
  });
  
  if (contentKey && contentValue) {
    queryParams.append(contentKey, contentValue);
    console.log(`Sending ${contentKey} to webhook:`, contentValue.substring(0, 100) + '...');
  }
  
  const fullUrl = `${webhookUrl}?${queryParams.toString()}`;
  console.log('Making request to:', fullUrl);
  
  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });
  
  console.log('Response status:', response.status);
  
  if (!response.ok) {
    throw new Error(`Webhook responded with status: ${response.status}`);
  }
  
  const responseText = await response.text();
  console.log('Raw response:', responseText);
  
  let data;
  try {
    data = responseText ? JSON.parse(responseText) : null;
    console.log('Webhook response:', data);
  } catch (parseError) {
    console.error('Failed to parse JSON response:', parseError);
    data = responseText;
  }
  
  return {
    data,
    rawResponse: responseText
  };
};
