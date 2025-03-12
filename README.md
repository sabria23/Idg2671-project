to run the server: make sure you are in the root direcotry and not inside backend nor frontend, in therminal type: npm run server
- we are using the EJ6, so express is using in the package.json "type": "module"

- if you making any changes in the .env, save the file and restart the server

instalations: we have:
## for front-end:
"react": "^19.0.0",
"react-dom": "^19.0.0",

## for the backend:
 "dependencies": {
    "colors": "^1.4.0",
    "dotenv": "^16.4.7",
    "ejs": "^3.1.10",
    "express": "^4.21.2",
    "mongoose": "^8.12.1"
     "nodemon": "^3.1.9"
  }

## endpoints for dashboard
  GET /studies - Display studies on the dashboard.  
  DELETE /studies/:studyId - Delete a study.  
  GET /studies/:studyId + PUT /studies/:studyId - Edit a study (using the create study page).  
  GET /studies/:studyId/export - Export data (accessed from the export data page).

## endpoints for createStudy


## endpoints for login.Registration


## endpoints for survey