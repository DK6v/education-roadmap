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

def send_request(address, port, message):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((address, port))
        s.sendall(message.encode())
        data = s.recv(1024)
        print(f'{id}: {int.from_bytes(data, "little")}')

def main():

    parser = argparse.ArgumentParser("send.py")
    parser.add_argument("-d", metavar='<ip>:<port>', dest="dest", default="", type=str,
                        help="Destination address and port")
    parser.add_argument("message", help="<message>", default="", type=str)
    args = parser.parse_args()

    print(args)

#    send_request(args.adddress, args.port. args.message)

if __name__ == "__main__":
    main()
