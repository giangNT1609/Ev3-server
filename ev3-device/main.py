#!/usr/bin/env python3

import paho.mqtt.client as mqtt

from ev3dev2.sound import Sound
from ev3dev2.sensor import INPUT_1, INPUT_2, INPUT_3
from ev3dev2.sensor.lego import UltrasonicSensor, ColorSensor, GyroSensor
from ev3dev2.motor import (
    OUTPUT_B, OUTPUT_C, OUTPUT_D,
    follow_for_ms, Motor, MoveTank)

from time import sleep
from threading import Thread

print("starting application")

# motors
tank = MoveTank(OUTPUT_B, OUTPUT_C)
grabber = Motor(OUTPUT_D)

# sensors
obstacle_sensor = UltrasonicSensor(INPUT_1)
color_sensor = ColorSensor(INPUT_2)
gyro_sensor = GyroSensor(INPUT_3)

# speaker
spkr = Sound()

# configure tank
tank.cs = color_sensor
tank.gyro = gyro_sensor
tank.stop_action = 'brake'

print("motors and sensors acquired")

# Navigation
#
def avoid_collision():
    distance = ultrasonic_sensor.distance_centimeters

    if distance > 20:
        tank.on(left_speed=14, right_speed=14)
    else:
        tank.on(left_speed=-14, right_speed=14)
        tank.wait_until_not_moving(timeout=500)
        tank.on(left_speed=14, right_speed=14)

def navigate_to_destination():
    start_position = (0, 0)  # Store the starting position as (x, y) coordinates
    current_position = start_position

    while True:
        avoid_collision()

        # Movement commands based on the control algorithm
        tank.on(left_speed=10, right_speed=10)

        # Update current position using dead reckoning
        distance_traveled = 0.05  # Assume the robot moves 5 cm per second
        heading = 0  # Assume the robot always moves straight ahead
        delta_x = distance_traveled * cos(radians(heading))
        delta_y = distance_traveled * sin(radians(heading))
        current_position = (current_position[0] + delta_x, current_position[1] + delta_y)

        # Check if destination is reached
        if color_sensor.color == ColorSensor.COLOR_RED:  # Adjust the color value for your specific destination
            tank.off()  # Stop the robot
            break

    # Once destination is reached, go back to the starting point
    while current_position != start_position:
        avoid_collision()

        # Calculate the heading towards the starting point
        delta_x = start_position[0] - current_position[0]
        delta_y = start_position[1] - current_position[1]
        heading = degrees(atan2(delta_y, delta_x))

        # Rotate the robot towards the starting point
        tank.turn_left(speed=14, degrees=heading)  # Adjust the speed as needed

        # Move straight towards the starting point
        distance = sqrt(delta_x**2 + delta_y**2)
        tank.on_for_rotations(left_speed=14, right_speed=14, rotations=distance / 5)  # Adjust the distance per rotation as needed

        # Update the current position
        current_position = start_position

    tank.off()  # Stop the robot

# Object Detection
#
def object_detection():
    while True:
        sleep(0.1)
        if obstacle_sensor.value() < 150:
            print("saw an obstacle at", obstacle_sensor.value())
            tank.stop()
            spkr.beep()
            send_message("object detected")

obj_detect_thread = Thread(target=object_detection)

# Grabbing

def grab():
    move_arm(21, -0.75)

def release():
    move_arm(21, 0.75)

def move_arm(speed, rotation):
    grabber.on_for_rotations(speed, rotation)


# MQTT client
#

broker_hostname = "broker.hivemq.com"
port = 1883
topic = "AB001"
msg_count = 0

def on_connect(client, userdata, flags, return_code):
    if return_code == 0:
        print("mqtt connected")
    else:
        print("could not connect to mqtt, return code:", return_code)
    grab()
    release()


def send_message(message):
    client.publish(topic, message)


default_commands = [
    "forward", "backward",
    "left", "right",
    "grab", "release"
]

def parse_message(message):
    '''
        Parsing messages from server
        NOTE: current parsing laughably bad
    '''
    commands = []
    if "task" in message:
        commands = message.split()[-1].split(',')
    elif "follow" in message:
        commands = [ message.split()[-1] ]
    elif message in default_commands:
        commands = [ message ]
    return commands

def on_message(client, userdata, msg):
    message = msg.payload.decode()
    commands = parse_message(message)
    for command in commands:
        if command == "forward" and obstacle_sensor.value() > 150:
            tank.run_timed(speed_sp=420, time_sp=4000)
            tank.wait_until_not_moving()
        elif command == "backward":
            tank.run_timed(speed_sp=-420, time_sp=4000)
            tank.wait_until_not_moving()
        elif command == "left":
            tank.on_for_rotations(0,  21 , 1.25)
        elif command == "right":
            tank.on_for_rotations(21, 0 , 1.25)
        elif command == "grab":
            grab()
        elif command == "release":
            release()
        elif command == "red":
            navigate_to_destination()
        else:
            send_message("unknown task : " + message)
            return
    send_message("task completed")

# MQTT connection

client = mqtt.Client()
client.on_connect=on_connect
client.connect(broker_hostname, port)



# MQTT Client hooking

# Set up the message callback
client.on_message = on_message

# Subscribe to the topic
client.subscribe(topic)

obj_detect_thread.start()

client.loop_forever()

# Main Loop

try:
    while True:
        pass
except KeyboardInterrupt:
    obj_detect_thread.join()
    client.disconnect()
