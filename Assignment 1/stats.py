import socket
import time
import random

# SOCKET VARIABLES
PORT = 8080
HOST_IP = socket.gethostbyname(socket.gethostname())
ADDR = (HOST_IP, PORT)

# DISCONNECT MESSAGE
DISCONNECT = '1111'

# SIZE OF FRAME PARTS
N_SIZE = 2
LENGTH_SIZE = 3
DATA_SIZE = 11
CRC_SIZE = 4

idle_signal = "11110000"
busy_signal = "00001111"