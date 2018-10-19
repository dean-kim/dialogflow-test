import React, { Component } from 'react';
// import socket from 'socket.io'
import openSocket from 'socket.io-client'
import './App.css';


class App extends Component {

    state = {
        says: ''
    }

    // synthVoice = (AIResponse) => {
    //
    //     // create context for speech synthesis
    //     const synth = window.speechSynthesis;
    //     const AIStringAsVoice = new SpeechSynthesisUtterance();
    //
    //     // define what text AI will be speaking
    //     AIStringAsVoice.text = text;
    //
    //     // customize AI's voice
    //     // this is just a sampling of ways to customize voice
    //     AIStringAsVoice.voiceURI = 'Native';
    //     AIStringAsVoice.volume = 1;
    //     AIStringAsVoice.rate = 1;
    //     AIStringAsVoice.lang = 'ko-KR';
    //
    //     // this is what reads the string out loud
    //     synth.speak(msg);
    // }

    handleClick = () => {
        let text;

        const socket = openSocket();

        // make sure speech recognition is supported in user's browser
        if (window['webkitSpeechRecognition']) {

            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();

            // korean
            recognition.lang = 'ko-KR';

            // process user audio while user is speaking
            recognition.interimResults = false;

            // speech recognition will not end when user stops speaking
            recognition.continuous = false;

            // start the speech --> string transcription process
            recognition.start();

            console.log('inside if');

            // this is what actually captures your speech & converts it to a str
            recognition.onresult = e => {
                let last = e.results.length - 1;

                // text = what you just said, in string form
                text = e.results[last][0].transcript;

                this.setState({says: text});

                // socket
                socket.emit("userAudio", text);

                function synthVoice(AIResponse) {
                    // CREATE CONTEXT FOR SPEECH SYNTHESIS
                    const synth = window.speechSynthesis;
                    const AIStringAsVoice = new SpeechSynthesisUtterance();
                    // DEFINE WHAT TEXT AI WILL BE SPEAKING
                    AIStringAsVoice.text = text;

                    console.log('inside synthVoice')

                    // CUSTOMIZE AI'S VOICE
                    // THIS IS JUST A SAMPLING OF WAYS TO CUSTOMIZE VOICE
                    AIStringAsVoice.voiceURI = 'Native';
                    AIStringAsVoice.volume = 1;
                    AIStringAsVoice.rate = 1;
                    AIStringAsVoice.lang = 'ko-KR';
                    // THIS IS WHAT READS THE STRING OUT LOUD
                    synth.speak(text);
                }

                let AIResponse;

                // socket.on("AIResponse", this.synthVoice(AIResponse))
                socket.on('AIResponse', AIResponse);
                this.synthVoice(AIResponse)
            }

            // this will stop transcribing your speech when you stop speaking
            recognition.onspeechend = () => {
                recognition.stop();
            }

            // if error, set text = to what the error is so user knows
            recognition.onerror = e => {
                text = 'Error occurred in recognition: ' + e.error;
                return;
            }
        }
    }

    render() {
        return (
            <div className="App">
                <div className="button-container">
                    <div className="speak-button" onClick={this.handleClick}>speak</div>
                </div>
                <div className="return-text">text: {this.state.says ? this.state.says : '"speak" 버튼을 누르시고 말씀을 해주세요'}</div>
            </div>
        )
    }
}

export default App;
