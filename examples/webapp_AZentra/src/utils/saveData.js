const saveSurveyData = async (dataObj) => {
    // Update this URL to your actual deployed function URL
    const apiUrl = 'https://cosmosdb-web-api.azurewebsites.net/api/httpTrigger_SaveResults';

    
    const testData = {
        // data: "This is a test string 5 " + new Date().toISOString()
        data: dataObj
    };

    try {
        // console.log('Sending test data:', testData);
        console.log(testData);
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });

        // Try to parse response as JSON, but handle if it's not JSON
        let result;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            result = await response.json();
        } else {
            result = await response.text();
        }

        if (response.ok) {
            console.log('Success! Response status:', response.status);
            console.log('Response:', result);
        } else {
            console.error('Error status:', response.status);
            console.error('Error:', result);
        }
    } catch (error) {
        console.error('Exception:', error.message);
    }
}

export { saveSurveyData };