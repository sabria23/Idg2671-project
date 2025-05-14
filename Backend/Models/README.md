This model for studyinvitaitons: 

Stores just a list of email addresses rather than detailed recipient information
Tracks basic success/failure counts rather than individual statuses
Focuses only on the essential fields needed for email invitations

i got error about:  successCount: 0, failCount: 0, _id: ObjectId("68246644ee3380f827a55758"), createdAt: new Date("Wed, 14 May 2025 09:45:40 GMT"), updatedAt: new Date("Wed, 14 May 2025 09:45:40 GMT"), __v: 0}, {})
Error sending invitations: MongoServerError: E11000 duplicate key error collection: webprosjekt-mainDB.studyinvitations index: invitationToken_1 dup key: { invitationToken: null }
    at InsertOneOperation.execute (/Users/modestatrakselyte/Desktop/NTNU/2Y-2S-2025/Idg2671-project/Backend/node_modules/mongodb/lib/operations/insert.js:51:19)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async tryOperation (/Users/modestatrakselyte/Desktop/NTNU/2Y-2S-2025/Idg2671-project/Backend/node_modules/mongodb/lib/operations/execute_operation.js:207:20)
    at async executeOperation (/Users/modestatrakselyte/Desktop/NTNU/2Y-2S-2025/Idg2671-project/Backend/node_modules/mongodb/lib/operations/execute_operation.js:75:16)
    at async Collection.insertOne (/Users/modestatrakselyte/Desktop/NTNU/2Y-2S-2025/Idg2671-project/Backend/node_modules/mongodb/lib/collection.js:157:16) {
  errorLabelSet: Set(0) {},
  errorResponse: {
    index: 0,
    code: 11000,
    errmsg: 'E11000 duplicate key error collection: webprosjekt-mainDB.studyinvitations index: invitationToken_1 dup key: { invitationToken: null }',
    keyPattern: { invitationToken: 1 },
    keyValue: { invitationToken: null }
  },
  index: 0,
  code: 11000,
  keyPattern: { invitationToken: 1 },
  keyValue: { invitationToken: null }
}


Do you need the token?
It depends on your implementation:

If you're sending the same link to everyone: You don't strictly need individual tokens
If you want to track who clicked the link: You need tokens to identify each recipient
If you want one-time use links: You need tokens to make each link unique

studymodel.js updates: An outer object demographicsConfig containing:

enabled: A boolean to toggle all demographics on/off
fields: An array of field configurations


Each field in the fields array has:

name: The field name (required)
type: The field type (must be 'text', 'number', or 'select')
options: An array of strings for select-type fields
required: Whether the field is required for participants