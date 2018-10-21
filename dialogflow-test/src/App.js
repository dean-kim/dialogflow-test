import React, { Component } from 'react';
import socketio from 'socket.io-client'
import './App.css';


class App extends Component {

    state = {
        says: '',
        reponseWord: ''
    }

    handleClick = () => {
        let text;

        const socket = socketio.connect();

        // make sure speech recognition is supported in user's browser
        if (window['webkitSpeechRecognition']) {

            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();

            // korean support not yet ㅜㅜ
            // recognition.lang = 'ko-KR';

            // english
            recognition.lang = 'en-US';

            // process user audio while user is speaking
            recognition.interimResults = false;

            // speech recognition will not end when user stops speaking
            recognition.continuous = false;

            // start the speech --> string transcription process
            recognition.start();

            const synth = window.speechSynthesis;
            const voices = synth.getVoices();


            // this is what actually captures your speech & converts it to a str
            recognition.onresult = e => {
                let last = e.results.length - 1;

                // text = what you just said, in string form
                text = e.results[last][0].transcript;

                this.setState({says: text});

                // socket
                socket.emit("userAudio", text);

                function synthVoice(text) {
                    // create context for speech synthesis
                    const synth = window.speechSynthesis;
                    const AIStringAsVoice = new SpeechSynthesisUtterance();
                    // define what text AI will be speaking
                    AIStringAsVoice.text = text;

                    // customize AI's voice (Female)
                    AIStringAsVoice.voice = voices[41];
                    AIStringAsVoice.volume = 1;
                    AIStringAsVoice.rate = 1;
                    AIStringAsVoice.lang = 'en-US';
                    this.setState({responseWord: AIStringAsVoice.text})
                    // speak response
                    synth.speak(AIStringAsVoice);
                }


                socket.on('AIResponse', function (AIResponse) {
                    synthVoice(AIResponse);
                })
            }

            // this will stop transcribing your speech when you stop speaking
            recognition.onspeechend = () => {
                recognition.stop();
            }

            // if error, set text = to what the error is so user knows
            recognition.onerror = e => {
                text = 'Error occurred in recognition: ' + e.error;
                return text;
            }
        }
    }

    render() {
        return (
            <div className="App">
                <div className="button-container">
                    <div className="speak-button" onClick={this.handleClick}>
                        speak
                    </div>
                </div>
                <div className="return-text">
                    Question is: {this.state.says ? this.state.says : '"speak" 버튼을 누르시고 말씀을 해주세요'}
                    Response is: {this.state.reponseWord ? this.state.reponseWord : "Response"}
                    </div>
            </div>
        )
    }
}

export default App;
