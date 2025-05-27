import path from 'path';
import express from 'express';

const port = process.env.PORT || 3000;
const app = express();

const __dirname = path.resolve();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/frontend/build')));

// Catch-all handler: return React's index.html for any non-API route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

app.listen(port, () => console.log(`Frontend server running on port ${port}`));
