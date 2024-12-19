# ForgotInfo
This folder contains the files used to create the pages for a forgotten username and a forgotten password.

ForgotPass.html:
The ForgotPass.html file is used to create a page that handles when a user has forgotten their password. The current version includes input fields for the user's email address and username. These requests are to verify that there is an account connected with the email, and if there are multiple, which account. It is planned to add further functionality, such as input fields that appear after this information is given for handling a code/pin/password sent to the email as well as input fields for the new password. The code/pin/password would be used to verify that the user has access to the email so that the password can be changed. Also included is a link for contacting support, but it is currently a dead link that does nothing.

ForgotPass.js:
The ForgotPass.js file is used to handle the specifics of the page, such as hiding the display of the fields/forms that are not necessary at the time. In the current version, this file does not implement anything.

ForgotUser.html:
The ForgotUser.html file is used to create a page that handles when a user has forgotten their username. The current version includes input fields for the user's email address and password. This is to access the user's account if they have one, allowing them to access their account without the username. Similarly to the ForgotPass.html file, this one also creates a link for contacting support, but it is dead as well.

ForgotUser.js:
The ForgotUser.js file handles functionality for the ForgotUser.html that is outside the scope of what HTML can do or more difficult to do in HTML. As of the current version, this file only incorporates the ability to toggle the visibilty of the password in the password field.

ForgotInfo.css:
The ForgotInfo.css file is used by both the ForgotPass.html file and the ForgotUser.html file. This allows the visual appearance between the two pages to be very similar, even though they handle different information. This is done to make the pages easier to use by having similar layouts and designs to each other.