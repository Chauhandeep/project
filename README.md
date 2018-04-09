#Instructions to Start : 
On your terminal 
- run "npm install all"
- run "node server/server.js"
- localhost url : "localhost:3000"

#Software Requirements
- Postman - It is a software which allows sending multiple api requests to server and exchange data with REST API's

#Description
  This API generates access token evertime a user logs in and that access token is used for making further API call's by the user.
  The access token is 'x-auth' which is sent as a header in requests.

#Screenshots
 - POST /register
   ![screenshot from 2018-04-07 23-58-43](https://user-images.githubusercontent.com/19603527/38458890-c2a368ba-3ac0-11e8-80ab-8c8dd616235a.png)

 - POST /login
   ![screenshot from 2018-04-07 23-59-18](https://user-images.githubusercontent.com/19603527/38458912-d573eae6-3ac0-11e8-960c-c8499f222d67.png)

 - POST /BlogPost
   ![screenshot from 2018-04-07 23-59-37](https://user-images.githubusercontent.com/19603527/38458923-f4d1719c-3ac0-11e8-96ef-888a4d3e7a05.png)
    
   ![screenshot from 2018-04-07 23-59-40](https://user-images.githubusercontent.com/19603527/38458927-0aba6c48-3ac1-11e8-829d-c40f91671bc4.png)
 
 - PUT /follow/{username}
   ![screenshot from 2018-04-07 23-59-47](https://user-images.githubusercontent.com/19603527/38458930-17c8bf84-3ac1-11e8-8b8e-8f8b944e66b8.png)

 - GET /feed/
   ![screenshot from 2018-04-08 00-00-23](https://user-images.githubusercontent.com/19603527/38458943-30510afc-3ac1-11e8-943f-404c2ce08501.png)



 
