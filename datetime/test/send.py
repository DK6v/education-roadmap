#!/usr/bin/env python3
import socket
import argparse
import threading

client = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
client.setsockopt(socket.SOL_SOCKET, socket.SO_SNDBUF, 1024 * 1024 * 32)
client.setsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF, 1024 * 1024 * 32)
client.settimeout(2.0)

g_count = 1
g_lock = threading.Lock()

def recv(args, name):
    global client, g_count, g_lock
    while(g_count < args.count + 1):
        try:
            data, server = client.recvfrom(1024)
            with g_lock:
                print(f'{g_count}: {name} {data.decode()} {server[0]}:{server[1]}')
                g_count += 1
        except socket.timeout:
            with g_lock:
                if (g_count < args.count + 1):
                    print(f'{g_count}: {name} REQUEST TIMEOUT')

def main():

    parser = argparse.ArgumentParser("send.py")
    parser.add_argument("-a", dest="address", default="127.0.0.1", help="IP address", type=str)
    parser.add_argument("-p", dest="port", help="Port number", default=12345, type=int)
    parser.add_argument("-n", dest="count", help="Number of requests", default=1, type=int)
    parser.add_argument("message", help="Message", default="test", type=str)
    args = parser.parse_args()

    for ix in range(4):
       threading.Thread(target=recv, args=(args, ix,)).start()

    for ix in range(args.count):
        client.sendto((ix + 1).to_bytes(4, 'little'), (args.address, args.port))


if __name__ == "__main__":
    main()
