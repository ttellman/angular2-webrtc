import { Component } from '@angular/core';
import * as io from 'socket.io-client';

@Component({
    selector: 'webrtccaller-component',
    templateUrl: './webrtccaller.template.html'
})

export class WebrtcCaller {

    constraints = { video: true, audio: true };
    stream: MediaStream = new MediaStream();
    pc: RTCPeerConnection = new RTCPeerConnection(null);
    socket: SocketIOClient.Socket;

    startVideostream(): void {
        navigator.getUserMedia(
            this.constraints,
            (localMediaStream: MediaStream) => {
                // make stream global in component
                this.stream = localMediaStream;
            },
            (error) => { console.log('navigator.getUserMedia error: ', error); }
        );
    }

    call(): void {
        // add the stream to the rtcpeerconnection
        this.pc.addStream(this.stream);
        this.pc.createOffer((offer: RTCSessionDescriptionInit) => {
            this.pc.setLocalDescription(new RTCSessionDescription(offer),
                // do something with the offer
                () => { this.socket.emit('push', offer); }, this.closeconnection);
        }, this.closeconnection);
    }

    closeconnection(err): void {
        this.pc.close();
        console.log('closed connection');
    }


    constructor() {
        this.socket = io('192.168.2.47:3000');
        this.socket.on('get2', (msg) => {
            this.pc.setRemoteDescription(new RTCSessionDescription(msg), () => {
                console.log(this.pc.getRemoteStreams().forEach((track) => {
                    if (track !== undefined) {
                        console.log(track);
                    }
                }
                ));
                console.log(this.pc.getLocalStreams().forEach((track) => console.log(track)));
            }, () => { });
        });
    }
}
