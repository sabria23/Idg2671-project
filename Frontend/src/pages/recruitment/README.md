https://www.sogolytics.com/help/how-to-generate-survey-public-link/

Props You Would Pass to Each Component
Each component would receive specific props:

What Are Props?
Props (short for "properties") are a fundamental concept in React that allow components to communicate with each other. They are the primary mechanism for passing data from a parent component to a child component.
Think of props like arguments you pass to a function. When you create a component in React, you can give it certain properties (props) that it can use to render properly.

## PublishToggle:
study: The study object with title, published status, etc.
onToggle: Function to handle publishing/unpublishing


## ShareableLink:
studyId: The ID of the study
studyUrl: (optional) The full URL to display, or calculate it inside


## EmailInvitation:
studyId: The ID of the study
onSendInvitations: Callback for when invitations are sent


## DemographicsSettings:
studyId: The ID of the study
isPublished: Whether the study is published (for disabling the save button)
onSave: Callback for when settings are 

How to Pass Props
1. Passing Props from Parent to Child
In the parent component, you pass props to a child component like HTML attributes:
jsx// ParentComponent.jsx
import ChildComponent from './ChildComponent';

function ParentComponent() {
  const studyTitle = "Cognitive Study";
  const isPublished = true;
  
  return (
    <div>
      <ChildComponent 
        title={studyTitle} 
        published={isPublished} 
        onSave={() => console.log("Saved!")} 
      />
    </div>
  );
}

In this example, we're passing three props to ChildComponent:

title: A string value
published: A boolean value
onSave: A function

2. Receiving and Using Props in the Child Component
The child component receives these props as a parameter in the component function:
jsx// ChildComponent.jsx
function ChildComponent(props) {
  return (
    <div>
      <h1>{props.title}</h1>
      <p>Status: {props.published ? 'Published' : 'Draft'}</p>
      <button onClick={props.onSave}>Save</button>
    </div>
  );
}

export default ChildComponent;

In this example, we're passing three props to ChildComponent:

title: A string value
published: A boolean value
onSave: A function

2. Receiving and Using Props in the Child Component
The child component receives these props as a parameter in the component function:
jsx// ChildComponent.jsx
function ChildComponent(props) {
  return (
    <div>
      <h1>{props.title}</h1>
      <p>Status: {props.published ? 'Published' : 'Draft'}</p>
      <button onClick={props.onSave}>Save</button>
    </div>
  );
}

export default ChildComponent;

### to implement where a study link becomens inaccessible to pariticipants when a reseacher unpiblishes it:

in backend i need to add this line: 
// 👇 This is the key check that prevents access to unpublished studies
    if (!study.published) {
      return res.status(403).json({ 
        success: false, 
        message: "This study is currently unavailable" 
      });
    }
 and also make the route public 

 and in frontend i iwll need to create a public study access compoent that navigates either to marius page if it is publish or to anot found page it is not accessible. 

 also tetsing: 
 3. Testing the Implementation
To ensure this feature works properly, you should test these scenarios:

Access a published study link → Should show the study
Unpublish the study → The link should become inaccessible
Publish the study again → The link should become accessible again
Access a non-existent study → Should show a "not found" error
Access a study with a malformed ID → Should handle the error gracefully