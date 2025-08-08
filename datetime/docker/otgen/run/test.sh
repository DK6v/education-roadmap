#!/usr/bin/env sh

otgen create flow -s 127.0.0.1 -d 127.0.0.1 -p 80 --rate 1000 | \
otgen add flow -n f2 -s 127.0.0.1 -d 127.0.0.1 --sport 80 --dport 12345 --tx p2 --rx p1 | \
otgen run -k --metrics flow

#otgen transform --metrics flow --counters frames | \
#otgen display --mode table