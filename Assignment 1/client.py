import socket, threading

client = socket(socket.AF_INET, socket.SOCK_STREAM)

try:
    client.connect(st.ADDR)
except socket.error as e:
    print(str(e))
    
