#!/usr/bin/env python3
import socket
import argparse
import threading

client = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
client.setsockopt(socket.SOL_SOCKET, socket.SO_SNDBUF, 1024 * 1024 * 32)
client.setsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF, 1024 * 1024 * 32)
client.settimeout(2.0)

g_count = 0
g_lock = threading.Lock()

def send_request(args, amount):
    global g_count, g_lock
    while(True):
        id = 0
        with g_lock:
            if ( g_count >= amount):
                break
            g_count += 1
            id = g_count
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.connect((args.address, args.port))
                s.sendall(args.message.encode())
                data = s.recv(1024)
                print(f'{id}: {int.from_bytes(data, "little")}')

def main():

    parser = argparse.ArgumentParser("send.py")
    parser.add_argument("-a", dest="address", default="127.0.0.1", help="IP address", type=str)
    parser.add_argument("-p", dest="port", help="Port number", default=12345, type=int)
    parser.add_argument("-n", dest="count", help="Number of requests", default=1, type=int)
    parser.add_argument("message", help="Message", default="test", type=str)
    args = parser.parse_args()

    threads = 10
    for ix in range(threads):
        threading.Thread(target=send_request, args=(args, args.count,)).start()

if __name__ == "__main__":
    main()
