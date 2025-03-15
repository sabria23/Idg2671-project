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
  GET /api/dash-studies   - Get all studies for the logged-in researcher
  ??(POST /api/dash-studies    - Create a new study)
  DELETE /api/dash-studies/:studyId             - Delete a study 
  GET /api/dash-studies/:studyId    - Get a specific study (for edit page)
  GET /api/dash-studies/:studyId/recruitment    - Access recruitment page for a study
  GET /api/dash-studies/:studyId/export         - Access export page for a study

  for the recruitment page: 
  POST /api/dash-studies/:studyId/generate-link - Generate shareable link
  POST /api/dash-studies/:studyId/participants  - Add participant emails manually
  GET /api/dash-studies/:studyId/participants   - View all invited participants

  export action page: 
  GET /api/dash-studies/:studyId/responses      - Get all responses for a study
  GET /api/dash-studies/:studyId/export-json    - Download study data as JSON

  button dashboard: GET /studies/studyId -> linked to the export page
  button export: GET /studies/studyId/questions/responses/export -> export to "json" file
  button edith: PUT /studies/studyId -> link to the preview page
  button recruite: GET /studies/studyId -> event based client server dispatch 

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