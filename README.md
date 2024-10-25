# copilot-compiler-app
## Node App
### Architecture Diagram
 <img width="468" alt="image" src="https://github.com/user-attachments/assets/8b0f7319-b124-41af-b3b3-47853868c8d7">

The system design depicted in the image and supported by the provided code involves a Node.js HTTP server that interacts with GitHub and a Flask app. Below is a detailed explanation of each component and their interactions:

#### Components

1. **Client**
   - Sends POST requests to the Node.js HTTP server.

2. **Environment Variables**
   - Provides a GitHub token used for request verification.

3. **Node.js HTTP Server**
   - Acts as the central hub, handling incoming requests, verifying them, and fetching data from external services.

4. **GitHub**
   - The server verifies incoming requests using headers provided by GitHub.

5. **Flask App**
   - Receives data fetched by the Node.js server for further processing.

#### Workflow

1. **Receiving Requests**
   - The client sends POST requests to the Node.js server.
   - The server listens on port 3000 for incoming requests.

2. **Request Verification**
   - The server uses `verifyAndParseRequest` to validate requests from GitHub.
   - It checks the signature and key ID against the environment-provided GitHub token.
   - If verification fails, it responds with a 401 error.

3. **Data Processing**
   - Upon successful verification, the server acknowledges receipt with `createAckEvent`.
   - It extracts the latest message from the payload.

4. **Fetching Data**
   - The server sends a POST request to an external API (Flask app) with the extracted message content.
   - The response from this API is expected in JSON format.

5. **Response Handling**
   - If the API call succeeds, it processes the response data.
   - It sends back a text event containing the API's response using `createTextEvent`.
   - Finally, it signals completion with `createDoneEvent`.

6. **Error Handling**
   - Any errors during processing result in a 500 Internal Server Error response if headers have not been sent yet.
   - Unsupported HTTP methods receive a 405 Method Not Allowed response.


### Sequence Diagram
<img width="332" alt="image" src="https://github.com/user-attachments/assets/4d840163-1877-4997-bdf5-60cdc4573413">

 
