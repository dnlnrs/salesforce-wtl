# Salesforce WebToLead
Salesforce WebToLead - Website form to Salesforce platform

This little script helps you easily integrate the communication between
your website and the Salesforce platform. You can create Salesforce leads
with your existing website forms without changing their behaviour.

## Usage
Download form this repository or install through npm
```
npm install salesforce-wtl@1.0.0
```
Include it in your web page
```
<script src="/path/to/dis/salesforce-wtl.js"></script>
```
Now you are ready to send your leads to Salesforce.

Let's assume you have a form like this in your page
```
<form id="contact-form" action="/save-contact.php" method="POST">
  <label for="user-name">Name</label>
  <input id="user-name" name="username" type="text" placeholder="Your name"/>
  <label for="user-email">Your Email</label>
  <input id="user-email" name="email" type="email" placeholder="Email Address"/>
  <input type="submit" value="Submit"/>
</form>
```
You need to send this data to your Salesforce platform to collect leads and do some stuff but you don't want to change how your form behaves on your side.
```
Salesforce.init({
  action: 'https://webto.salesforce.com/servlet/servlet.WebToLead', // Salesforce Web to lead endpoint
  formId: 'contcat-form', // ID of the form to send
  mapping: { // Mapping of the local field on the salesforce platform
    'username': '<salesforce-field-name>',
    'email': '<salesforce-field-name>'
  },
  additionalFIelds: {
    '<salesforce-field-name>': '<value>'
  },
  directSubmit: true, // Send to Salesforce directly or send to Salesforce after the local form submit
  afterSubmit: function() {
    // What to do after lead sent
    alert('Sent to Salesforce')
  }
});
```
And that's all! 👍
