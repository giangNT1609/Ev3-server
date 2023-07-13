# ev3server

Description:

simple EV3-server for controlling the EV3-device

- Server will connect to an MQTT broker like (HiveMQ)

- Program code for ev3-robot in folder: ev3-device 

- Database using MongoDB

- For device notification, We use Firebase Cloud Messaging so **comment** this code in the App module and mqtt.service.ts if not using or adding adminsdk json file in the root folder

System architecture:
![Alt text](https://github.com/giangNT1609/Ev3-server/blob/main/images/system_architechture.drawio_4.png)



Install:

+ Create .env follow the example.env

+ Install lib dependency: npm install

+ Run the server: npm run start



