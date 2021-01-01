# OAuthKeeper

A simple yet functional REST application to manage HR contacts for MOCK PLACEMENTS (2021). It lets only authorized users to view certain contacts. Built with NodeJS, Express, Mongoose and EJS.

## Contents
- [Motivation](#motivation)
- [Project Setup](#project-setup)
- [Project Structure](#project-structure)
- [Routes](#routes)
- [Features and Screenshots](#features-and-screenshots-click-to-enlarge)
- [Tools](#tools)
- [Contributors](#contributors)
- [Contributing](#contributing)
- [LICENSE](#license)

## Motivation
The Mock Placements is the annual flagship event of the __FORum for Economic Studies for Engineers__, the placement club at SVCE. The objective of this event is to provide students with information about their strengths and weaknesses before they attend actual campus placements and job interviews. This is achieved by conducting aptitude tests, group discussion and mock interviews with _real_ HR's, giving the students some experience on how the process works. Inviting HR's to the college is one of the most important steps in the organizational process. This is done by letting specific students call and invite recruiters for the event.

However, this process can be chaotic and is inherently prone to problems. Some of the problems that were faced by the organisers are as follows:-

* A student would accidentally call contacts that had already been invited by other students. This results in overlapping of contacts. This leads to HRs and recruiters getting annoyed by getting calls from multiple students.
* Making note of the statuses of HRs for the event (Confirmed, Rejected, Call Postponed, etc) was hard for students as they would have to note it all down somewhere. This would make it hard for the organisers to keep track of the number of HRs coming for the event and their details.
* The organizers were not able to maintain a proper count of the number of HR's who had been invited and this led to confusions among different teams responsible for the event.

There was a need for a solution which would help us get solve all of these problems and hece we built this application.

## Project Setup

```
Install dependencies
npm install

Run in development mode
npm run dev

Run in production mode
npm start
```

## Project Structure

```
OAuthKeeper2.0/
  .git                   # Git Source Directory
  node_modules/          # Project Dependencies
  config/                # Database connection helper
  controllers/           # User and Contact controller methods
  middleware/            # Middleware functions
  models/                # Database Schemas and Models
  public/                # Static CSS, JS files and Favicon
  resources/             # Project Specifications and test data
  routes/                # User and Contact routes
  screenshots/           # Screenshots for documentation
  utils/                 # Log Files and other utilities
  views/                 # EJS Templates and Views
  .env                   # Environment Variables
  .gitignore             # Files and folders to be ignored
  app.js                 # Express configuration
  server.js              # Application entry point
  seeder.js              # Seed file to populate and destroy data
  package.json           # Project Description and dependeincies
  package-lock.json      # Lock File
  LICENSE                # MIT License file
  README.MD              # Brief documentation
```

## Routes
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
| Statistics       | /contacts/statistics             | GET       | Private | Display contact statistics for each user            |
| Create           | /contacts                        | POST      | Private | Create new contact, then redirect                   |
| Update           | /contacts/:id                    | PUT       | Private | Update a contact, then redirect                     |
| Destroy          | /contacts/:id                    | DELETE    | Private | Delete a contact, then redirect                     |

## Features and Screenshots (Click to enlarge)
| Register Page                        | Login Page                           | Update Password Page                          | 
| ------------------------------------ | ------------------------------------ | --------------------------------------------- | 
| <img src="screenshots/register.png"> | <img src="screenshots/login.png">    | <img src="screenshots/update_password.png">   | 

| Forgot Password Page                        |  Dashboard                            | Create Contact                             |
| ------------------------------------------- | ------------------------------------- | ------------------------------------------ |
| <img src="screenshots/forgot_password.png"> | <img src="screenshots/dashboard.png"> | <img src="screenshots/create_contact.png"> |

## Tools
* [Visual Studio Code](https://code.visualstudio.com/)
* [NodeJS](https://nodejs.org/en/)
* [NPM](https://www.npmjs.com/)
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## Contributors
* Design and Development - [Nilesh D](https://github.com/Nilesh2000)

## Contributing
Please feel free to fork, comment, critique, or submit a pull request.

## LICENSE
This project is open source and available under the [MIT License](https://github.com/ForeseTech/OAuthKeeper2.0/tree/master).
