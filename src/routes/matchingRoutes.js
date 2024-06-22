import express from 'express';
import { spawn } from 'child_process';

const router = express.Router();

// Route to handle matching
router.post('/match', (req, res) => {
    const user_id = req.body.userId;
    const job_id = req.body.jobId._id;

    console.log('Received request to match user:', user_id, 'with offer:', job_id);

    // Check if user_id and job_id are provided
    if (!user_id || !job_id) {
        console.error('Error: Missing user ID or job ID');
        return res.status(400).json({ success: false, error: 'Missing user ID or job ID' });
    }

    // Spawn a child process to execute the Python script
    const pythonProcess = spawn('python', ['matching.py', user_id, job_id]);

    let dataString = '';

    // Handle Python script stdout
    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });

    pythonProcess.stdout.on('end', () => {
        try {
            const result = JSON.parse(dataString.trim());

            if (result.error) {
                throw new Error(result.error);
            }

            // Log the matching percentage
            console.log('Matching Percentage:', result.matching_percentage);

            // Send the response with the matching percentage
            if (!res.headersSent) {
                res.json({ success: true, matchingPercentage: result.matching_percentage });
            }
        } catch (error) {
            console.error('Error:', error.message);
            if (!res.headersSent) {
                res.status(500).json({ success: false, error: error.message });
            }
        }
    });

    // Handle Python script stderr
    pythonProcess.stderr.on('data', (data) => {
        console.error('Error executing Python script:', data.toString());
        if (!res.headersSent) {
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    });

    // Handle Python script error event
    pythonProcess.on('error', (err) => {
        console.error('Python script error:', err.message);
        if (!res.headersSent) {
            res.status(500).json({ success: false, error: 'Python script error' });
        }
    });

    pythonProcess.on('exit', (code) => {
        if (code !== 0 && !res.headersSent) {
            res.status(500).json({ success: false, error: 'Python script exited with an error' });
        }
    });
});

export default router;
