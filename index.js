import http from 'http';
import fetch from 'node-fetch';
import {
  createAckEvent,
  createDoneEvent,
  createTextEvent,
  verifyAndParseRequest,
} from '@copilot-extensions/preview-sdk';

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const signature = req.headers['github-public-key-signature'] ?? '';
        const keyID = req.headers['github-public-key-identifier'] ?? '';
        const tokenForUser = process.env.GITHUB_TOKEN;

        const { isValidRequest, payload } = await verifyAndParseRequest(
          body,
          signature,
          keyID,
          { token: tokenForUser }
        );

        if (!isValidRequest) {
          console.error('Request verification failed');
          res.writeHead(401, { 'Content-Type': 'text/plain' });
          res.end('Request could not be verified');
          return;
        }

        res.write(createAckEvent());

        const payload_message = payload.messages[payload.messages.length - 1];
        const responseFromAPI = await fetch('https://miniature-journey-4rj9w9rw9v9h5qx6-5023.app.github.dev/ask', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question: payload_message.content }),
        });

        if (!responseFromAPI.ok) {
          throw new Error('Failed to fetch response from API');
        }

        const responseData = await responseFromAPI.json();

       // res.write(createTextEvent(`Hello! I've processed your request "${payload_message.content}". The API responded with: ${JSON.stringify(responseData)}`));
       //res.write(createTextEvent(`${JSON.stringify(responseData)}`));
        const responseValue = responseData.response;
        res.write(createTextEvent(`${responseValue}`));
        res.write(createDoneEvent());
        res.end();
      } catch (error) {
        console.error('Error:', error);
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        }
      }
    });
  } else {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});