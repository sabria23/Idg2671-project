to run the server: make sure you are in the root direcotry and not inside backend nor frontend, in the terminal type: npm run server
- P.S. if that does not work it could be that you need to go to your Backend folder and then try running npm run server
- we are using the ES6, so express is using in the package.json "type": "module"
- if you make any changes in the .env, save the file and restart the server
- Please use POSTMAN/thunder or whatever other api client checker before moving any further after creating routes 🥹🥹🥹

- the current setup:
"scripts": {
  "start": "node server.js",
  "server": "nodemon server.js",
  "setup": "npm install"
}
- Then team members can just run npm run setup when they pull new changes.


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

# GENERAL INTERACTION FLOW FOR DASHBOARD: 
* List all studies
* Delete studies
* Handle study status (publish/unpublish)
* Get responses for export
* Generate participation links
* Add participant invitations
* Implement pagination, sort, search studies

## endpoints for dashboard
- get    /api/studies -> display all studies on dash
- delete /api/studies/:studyId -> delete a study
- get    /api/studies/studyId/sessions/responses -> responses from taken study to export
- patch  /api/studies/:studyId/public -> update study status from draft to publish
- post   /api/studies/:studyId/public-url  -> generate a URL link for publsihed study
- post   /api/studies/:studyId/invitations -> add participant emails to speific study

# GENERAL INTERACTION FLOW FOR CREATY-STUDY PAGE: 
* Create new studies
* Get single study for editing
* Update study details (title, descipriton, quesitons, artifacts)
* Add artifact and questions
* Delete questions 
* Remove artifacts from the question but not colleciton (if the same artifact is being reused in multiple studies)
* Implement pagination, sort, search (like after name maybe) for artifacts
* seperate page for a preview (how the survey will look like when publishing)

# endpoint related to study 
- post  /api/studies -> create a new study 
- get   /api/studies/studid -> for editing and (preview purpose)
- patch /api/studies/studyid -> (update title, or desc, or asnwer options etc)
- get /api/studies/studyId/preview -> special formating for previw page of that study 

# endpoint related to artifact management 
- post   /api/studies/studid/questions/questionid/artifcats -> uplaod artifcats
- get    /api/artifacts -> for pagination, sorting (desc, asc)
- delete /api/studies/studid/quesitons/questionId/artifcats/artifactsId (rmeove from question)
- delete /api/artifacts/:artifactId -> delete from the collection

# endpoints related to questions
- post   /api/studies/studyid/questions -> create a question
- patch  /api/studies/studyid/questions/questionId -> update question
- delete /api/studies/:studyId/questions/:questionId


# GENERAL INTERACTION FLOW FOR AUTHENTICAITON/LOGIN PAGE: 
- Implement authentication functionality
   - create a new user
   - hash the passwrod 
   - return user data (wihotu password) and a token (amybe)
- Generate JWT token once user has logged in
- Set HTTP-only cookie for better securitt
- ALL endpoints must be protected for study creaiton and management (emilie and modesta)

## endpoints for login.Registration
- post /api/auth/register -> create a new user
- psot /api/auth/login -> authenticates user credentials, sets HTTP-only cookie 
- post /api/auth/logout -> clear the autentication token 
- get /api/auth/user -> return current user data based on token 
- post /api/auth/forgot-password -> password reset (optional)
- post /api/auth/reset-passwrod -> (optional)


# GENERAL INTERACTION FLOW FOR PARTICIPATE -PAGE: 
- iniatal access to the page (generate unique session ID)
- display study intro page
- if required provide with demographics
- track study progressions (user answers if someone wants to abandon)
- track completion (if question is skipepd or un-answered sett null value)
- implement pagination for questions (display one question at a time)
- what happens if someone resumes to the session -> make sure if a partially completed session exits with the same identifier, return that instead of giving them new study
- should we prevent multiple submissions??

## endpoints for survey
- get /api/studies/studyId/preview -> the same layout that people taken the study will see (really not sure about htis)
- post /api/studies/studyid/sessions -> creates a new session once the participants starts the study
- post /api/studies/studyid/sessions/sessionId/questionId -> stores reeponses for each question 
- patch /api/studies/studyid/sessions/sessionId/questionId -> if user decided to go back and change their answer



## TUTORIALS USED FOR CREATING THIS PROJECT: 
- https://mongoosejs.com/docs/connections.html#multiple_connections (article explaining how to connnect 2 databses on one connection, in particular about parts: 
.asPromise() and event-based handling .on() )
- setting up server and the main API backend: https://www.youtube.com/watch?v=-0exw-9YJBo&list=PLillGF-RfqbbQeVSccR9PGKHzPJSWqcsm + what Aleksei has teached us in the class

connecting backend to frontend: teh basics
when your react frontend needs data from your backend.
1. make api calls: react compoennts use fetch or axios to make http request to your backend endpoints
process repsonee: teh data returned from your API is processed and stored in compoennt state
render data: react renders this data in your components 