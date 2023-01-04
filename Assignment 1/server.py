import socket, threading, stats as st

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

try:
    server.bind(st.ADDR)
except socket.error as e:
    print(str(e))
    
print(f"[LISTENING] Server is listening on {st.HOST_IP}")
server.listen(5)

