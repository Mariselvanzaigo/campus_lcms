# Nano JS

### ⚡️Breakdown

- Built with HTML + JS

### 💿 Installation

- Open the app in Visual Studio Code - Live Server
- The app should open automatically in your browser usually at http://127.0.0.1:5500


| Data Attribute | Description | Note | Example | Example Usage |
| ------------ | ------------ | ------------ | ------------ | ------------  |
|data-n-linkto | Use this attributes to render pages based on the schema added on menuSchema.js without reloading browser. | This attribute can be used on any HTML attribute, the default events of the HTML attribute will be prevented & the page will be rendered without window reload. | data-n-linkto = 'testPage' | This will render the test page based on the schema added on menuSchema.js. |
| data-n | | | data-n = 'form' | | 
| data-n-element | | | data-n-element = 'dynamic-field-container' | | 
| data-n-dynamic-element | Use this Attribute when we dynamically appending HTML to a HTML element. | This attribute is just a custom attribute, the funcionalities need to be developed based on the requirement by targeting the attribute. | data-n-dynamic-element = 'main' | | 
| data-n-count | | | data-n-count = '1' | | 
| data-n-id | | | data-n-id = '1' | | 
| data-n-trigger | | | data-n-trigger = 'add-dynamic-field' | | 
