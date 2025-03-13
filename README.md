to run the server: make sure you are in the root direcotry and not inside backend nor frontend, in the terminal type: npm run server
- P.S. if that does not work it could be that you need to go to your Backend folder and then try running npm run server
- we are using the ES6, so express is using in the package.json "type": "module"
- if you make any changes in the .env, save the file and restart the server
- Please use POSTMAN/thunder or whatever other api client checker before moving any further after creating routes 🥹🥹🥹

instalations: we have:
## for front-end:
"react": "^19.0.0",
"react-dom": "^19.0.0",

## for the backend:
  "dependencies": {
    "bcryptjs": "^3.0.2",
    "colors": "^1.4.0",
    "dotenv": "^16.4.7",
    "ejs": "^3.1.10",
    "express": "^4.21.2",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.12.1"
  },

## endpoints for dashboard
  GET /studies - Display studies on the dashboard.  
  DELETE /studies/:studyId - Delete a study.  
  GET /studies/:studyId + PUT /studies/:studyId - Edit a study (using the create study page).  
  GET /studies/:studyId/export - Export data (accessed from the export data page).

## endpoints for createStudy


## endpoints for login.Registration


## endpoints for survey

## TUTORIALS USED FOR CREATING THIS PROJECT: 
- https://mongoosejs.com/docs/connections.html#multiple_connections (article explaining how to connnect 2 databses on one connection, in particular about parts: 
.asPromise() and event-based handling .on() )
- setting up server and the main API backend: https://www.youtube.com/watch?v=-0exw-9YJBo&list=PLillGF-RfqbbQeVSccR9PGKHzPJSWqcsm + what Aleksei has teached us in the class