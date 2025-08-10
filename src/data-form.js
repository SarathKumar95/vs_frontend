import { useState } from 'react';
import {
    Box,
    Button,
    Typography
} from '@mui/material';
import axios from 'axios';

const endpointMapping = {
    'Notion': 'notion',
    'Airtable': 'airtable',
    'Hubspot': 'hubspot'
};

export const DataForm = ({ integrationType, credentials }) => {
    const [loadedData, setLoadedData] = useState(null);
    const endpoint = endpointMapping[integrationType];

    const handleLoad = async () => {
        try {
            const formData = new FormData();
            formData.append('credentials', JSON.stringify(credentials));
            const response = await axios.post(`http://localhost:8000/integrations/${endpoint}/load`, formData);
            const data = response.data;
            setLoadedData(data);
        } catch (e) {
            alert(e?.response?.data?.detail || 'Failed to load data');
        }
    }

    return (
        <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column' width='100%'>
            <Box display='flex' flexDirection='column' width='100%' maxWidth={600}>

                <Button
                    onClick={handleLoad}
                    sx={{ mt: 2 }}
                    variant='contained'
                >
                    Load Data
                </Button>

                <Button
                    onClick={() => setLoadedData(null)}
                    sx={{ mt: 1 }}
                    variant='outlined'
                >
                    Clear Data
                </Button>

                {/* Display loaded data here */}
                {loadedData && Array.isArray(loadedData) && (
                    <Box mt={3} sx={{ border: '1px solid #ddd', borderRadius: 1, p: 2 }}>
                        {loadedData.length === 0 && (
                            <Typography>No data available.</Typography>
                        )}
                        {loadedData.map((item, idx) => (
                            <Typography key={idx} sx={{ mb: 1 }}>
                                <strong>{item.type || item.integrationType || 'Type'}:</strong> {item.name || item.title || 'Name missing'}
                            </Typography>
                        ))}
                    </Box>
                )}

                {/* Fallback if loadedData is not array or empty */}
                {loadedData && !Array.isArray(loadedData) && (
                    <Typography mt={3}>Data loaded but in unexpected format.</Typography>
                )}

            </Box>
        </Box>
    );
}
