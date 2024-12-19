# CreateAccount
This folder contains the files used for the create account page as well as an sql file to contain the account info.

CreateAccount.html:
The CreateAccount.html file creates the basic outlines of the page for creating account. In this current version, this includes input fields to enter a first and last name, age, email, username, and password. As of this current build, it does not successfully communicate with the backend to store user information for an account.

CreateAccount.js:
The CreateAccount.js file is used to add functionality to the create account page that is more than the generic input fields created using HTML. These added functionalities include age verification, password requirement checks, username requirement checks, the ability to toggle the password visibility, and the ability to abort the submission of the form if one of the fields is not filled in properly or does not meet the requirements. For example, using age verification, an arbitrary age can be used as the mininum, and not allow the user to submit the form if the input birthdate places them at an age under the minimum. In this version, that age is 13 years old. The javascript pulls the information from the input fields, in this case, specifically the input birthdate, and compares it to the current date. It checks the year, then month, and then day to determine if the entered date meets the minimum age. This process is similar to how the other verification parts are done, with the password and username verifications using regular expressions to check for characters that are allowed, not allowed, or required.

CreateAccountStyles.css:
The CreateAccountStyles.css file is used to style the page so it is not the basic formatting done by standard HTML. This includes modifying the position of input boxes and other information to make the page look more appealing than a plain HTML page.