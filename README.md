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
Dashboard APIs (your responsibility):
- GET /api/dash-studies - List all studies for the dashboard
- DELETE /api/dash-studies/:studyId - Delete a study
- GET /api/dash-studies/:studyId/responses - Get responses for export
- GET /api/dash-studies/:studyId/export-json - Export as JSON

Study Creation/Editing APIs (your teammate's responsibility):
- POST /api/studies - Create a new study
- GET /api/studies/:studyId - Get a specific study for editing
- PUT /api/studies/:studyId - Update an existing study

In this scenario, the "get study by ID" endpoint wouldn't be in your dashboard routes - it would be in your teammate's study routes, since it's part of the edit functionality they're responsible for.

## endpoints for createStudy
  POST /studies - Post created studies to the database and the dashboard.
  GET /studies/:studyId - Gets the study based on the id from the databse to the prieviw/ edit study page
  PUT /studies/:studyId - edits the study in the prieview/ edit study page

  POST /fileSystemLocation - Post artifacts to the artifacts collection in the database for "later use"
  PUT /studies/:studyId/questions/artifacts -> for updating artifacts from the study
  PUT /studies/studyId/questions/:questionId -> update unique question 
  DELETE /studies/studyId/artifactId -> delete artifact from create study
  DELETE /studies/studyId/questionId -> delete spesific question 

## endpoints for login.Registration
  http://localhost:8000/api/users
  POST ('/') -> post user when he/she register themselves 
  POST ('/login') -> post logged in user after checking that he/she has register themsleves
  GET ('/me) -> retrieve the user that has logged in

## endpoints for survey
  GET /studies/studyId -> "preview"
  POST 

  regarding sessions:
  app.use(/api/sessions)
  POST / -> create a new user session for those that are invited via generated random link (when a user start the study)
  GET /:sessionId -> get a specific session
  POST /:sessionId/responses -> post answesr in database when a user submit their answers

  regarding pariticpantId -> if lefti decided to invite people manually
  app.use(/api/participants)
  When creating the "random" link it will send out a unique participantId in the end of the url
  POST /:participantId/responses



## TUTORIALS USED FOR CREATING THIS PROJECT: 
- https://mongoosejs.com/docs/connections.html#multiple_connections (article explaining how to connnect 2 databses on one connection, in particular about parts: 
.asPromise() and event-based handling .on() )
- setting up server and the main API backend: https://www.youtube.com/watch?v=-0exw-9YJBo&list=PLillGF-RfqbbQeVSccR9PGKHzPJSWqcsm + what Aleksei has teached us in the class