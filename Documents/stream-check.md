## Introduction

Check my friends' stream and store info into json file for other api using.

## My Environment

* Raspberry Pi 3 (RPi3) Model B Quad-Core 1.2 GHz 1 GB RAM
  * [Ubuntu MATE 16.04.2 (Xenial)](https://ubuntu-mate.org/download/)
  * Nginx nginx/1.10.3 (Ubuntu)
  * Node.js 8.7.0
    * fs 0.0.1-security
    * request ^2.83.0

## Current Compatibility

* 虎牙直播
* 哔哩哔哩直播

## How does if work?

Simply run the js file with NodeJs.

    $ sudo node stream-check.js

The programm will create json files for each streamer contained by `list` obj, under the path shows on `line27`.

If the streamer is offline, the content would be:

    {
        "onAir":0,
        "url":"http://stream.url.here"
    }

If the streamer is on air, the content would be:

    {
        "onAir":1,
        "title":"Here's the title",
        "game":"Here's the game",
        "begin":0000000000, /* the begin time of streaming, in timestamp */
        "url":"http://stream.url.here"
    }

I've set `cron` run this script for ever 5 minutes.

    $ sudo crontab -e

    */5 * * * * /usr/bin/node /home/app/tools/stream-check.js
