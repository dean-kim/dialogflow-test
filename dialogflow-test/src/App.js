import React, { Component } from 'react';
import './App.css';


class App extends Component {

    state = {
        says: ''
    }

    handleClick = () => {
        let text;

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

            // this is what actually captures your speech & converts it to a str
            recognition.onresult = e => {
                let last = e.results.length - 1;
                console.log('last', last);

                // text = what you just said, in string form
                text = e.results[last][0].transcript;

                this.setState({says: text})

                // todo: will put a socket here later
            }

            // this will stop transcribing your speech when you stop speaking
            recognition.onspeechend = () => {
                recognition.stop();
            }
            console.log(recognition);

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
