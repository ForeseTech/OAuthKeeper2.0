# OAuthKeeper Specifications

An application to manage HR contacts for MOCK PLACEMENTS 2021. The frontend will be built using a templating engine such as EJS or Handlebars. All the below mentioned functionality has to be fully implemented in the project.

## Backend Specs

### RESTful Routes
| Route Name       | URL                              | HTTP Verb | Access  | Description                                         | 
| ---------------- | -------------------------------- | --------- | ------  |---------------------------------------------------- | 
| Landing Page     | /                                | GET       | Public  | Show links for logging in and registration          |
| Register         | /users/register                  | GET       | Public  | Render form for user registration                   |
| Register         | /users/register                  | POST      | Public  | Register user, then redirect to dashboard           |
| Login            | /users/login                     | GET       | Public  | Render form for user login                          |
| Login            | /users/login                     | POST      | Public  | Log User In, Then Redirect To Dashboard             |
| Confirm E-Mail   | /users/confirmemail?token=token  | GET       | Public  | Verify token, Then Redirect To Dashboard            |
| Forgot Password  | /users/forgotpassword            | GET       | Public  | Show form to accept user email                      |
| Forgot Password  | /users/forgotpassword            | POST      | Public  | Send link to reset password to user e-mail          |
| Update Password  | /users/updatepassword            | GET       | Private | Render form to update existing password             |
| Update Password  | /users/updatepassword            | PUT       | Private | Update password, then redirect to dashboard         |
| Reset Password   | /users/resetpassword/:resettoken | GET       | Private | Render form to reset password                       |
| Reset Password   | /users/resetpassword/:resettoken | PUT       | Private | Update new password in the DB                       |
| Logout           | /users/logout                    | GET       | Public  | Log User Out / Clear Cookie, Then Redirect to Login |
| Dashboard        | /contacts                        | GET       | Private | Display user dashboard                              |
| Tabulated View   | /contacts/panel                  | GET       | Private | Display contacts in tablated fashion                |
| Statistics       | /contacts/statistics             | GET       | Private | Display contact statistics for each user
| Create           | /contacts                        | POST      | Private | Create new contact, then redirect                   |
| Update           | /contacts/:id                    | PUT       | Private | Update a contact, then redirect                     |
| Destroy          | /contacts/:id                    | DELETE    | Private | Delete a contact, then redirect                     |


### HR Contacts
- List all contacts in the database
- Create new contact
  * Authenticated Users Only
  * Must have the role of either "Member", or "Admin"
  * Field validation via Mongoose.
- Update a contact
  * Authenticated Users Only
  * Validation on update
- Delete a contact
  * Authenticated Users Only

### Users & Authentication
- Authentication will be done using JWT/Cookies.
- Send confirmation mail on registration
- JWT and cookie must expire in 30 days.
- User Registration
  * Register as a "Member" or "ED Incharge".
  * User must regsiter with name, email, password and ED Incharge.
  * Once registered, a token will be sent along with a cookie
  * Passwords must be hashed.
- User Login
  * A cookie will be sent to set token = none
- Password Reset
  * Member / ED Incharge can request to reset password.
  * A hashed token will be emailed to the users registered email address.
  * A PUT request can be made to the generated URL to reset the password.
  * The token will expire in 10 minutes.
- Update user info
  * Authenticated user only.
  * Allow to update password.
- Users can be made admin by updating the database field manually only.

### Security
- Encrypt passwords and reset tokens
- Prevent cross-site scripting
- Prevent NoSQL injections
- Protect against HTTP param pollution
- Add headers for security

### Code Related Suggestions
- NPM scripts for dev and production environment
- .env file for API Keys and other constants
- Use controller methods with documented descriptions / routes
- Error handling middleware
- Authentication middleware for protecting routes
- Validation using Mongoose and no external libraries
- Create database seeder to import and destroy sample data


## Frontend Specs

### Authentication
- Must have two buttons, that is, login and regsiter which redirect to respective routes
- Login route should have text input for email and password
- Register route should have text input for name, email, password, confirm password, user role and ED incharge
- All fields must be validated using client side JS. Make sure password and confirm password fields are equal

## Dashboard
- Show a table with stats for number of HR's called, HR's confirmed, rejected etc
- Use an accordion to show each contact
- On expansion of accordion, display other details and EDIT, DELTE buttons
- Use connect-flash to flash info and error messages

### Navbar / Sidebar
- Have a link for logout
- Display user's name on sidebar / navbar
- Have link to change password.

### Todos
- Give option to enable 2FA.
- Redirect user back to dashboard if he is logged in and attempts to log in again
- Set up ESLint
- Take periodic MongoDB backups
- Style E-Mails
- Style scrollbar
- Enable update contact button only on form change
