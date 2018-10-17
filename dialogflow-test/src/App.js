import React, { Component } from 'react';
import './App.css';


class App extends Component {

    handleClick() {
        let text;

        // make sure speech recognition is supported in user's browser
        if (window['webkitSpeechRecognition']) {

            const SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
            const recognition = new SpeechRecognition();

            // korean
            recognition.lang = 'kor';

            // process user audio while user is speaking
            recognition.interimResults = false;

            // speech recognition will not end when user stops speaking
            recognition.continuous = false;

            // start the speech --> string transcription process
            recognition.start()

            // this is what actually captures your speech & converts it to a str
            recognition.onresult = e => {
                let last = e.results.length - 1;

                // text = what you just said, in string form
                text = e.results[last][0].transcript;

                // todo: will put a socket here later
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
            <div>
                <button onClick={this.handleClick}>test</button>
            </div>
        )
    }
}

export default App;
