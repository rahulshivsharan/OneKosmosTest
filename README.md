## One KOSMOS Assignment

Created REST services for 
1. Login
2. fetch users
3. Logout

Start the application by going following commands

```
npm install
npm start
```

Now open up http://localhost:8087 on browser
If the above url gives API message on browser, the app is alive.

The application uses in-memory-database to pre-load users. The list of usernames/passwords are present in /service/intialDBSetup.js
Using one of the username and password present in the above file create following request's in POSTMAN or any RESTful client.

1. Login -

API is 

HTTP Method : POST
http://localhost:8087/api/login
Request Body
{
    "username" : "nick",
    "password" : "Nick343"
}

Response will be success login or invalid login.
If success login, in response body will contain token which should be used for below API invocation.

2. fetch Users

API is

HTTP METHOD : GET
http://localhost:8087/api/users
Request Header should contain "x-access-token" : token (from response of login)

Response will be list of users

3. Logout 

HTTP Method : POST
http://localhost:8087/api/logout
Request Header should contain "x-access-token" : token (from response of login)

Reponse will be
It will logout user if valid token in found.


NOTE : Token is valid for 12 hours 