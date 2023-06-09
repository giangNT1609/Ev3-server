# ev3server

Description:

simple EV3-server for controlling the EV3-device
- Server will connect to a MQTT borker like (HiveMQ)

- Program code for ev3 in folder: ev3-device 

- Database using Mongodb

- For device notification, We use Firebase Cloud Messaging so comment this code in App module and mqtt.service.ts if not using or adding json file adminsdk in root folder


Install:

+ Create .env follow the example.env

+ Install lib dependancy: npm install

+ Run the server: npm run start



