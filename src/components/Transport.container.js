import React, { useEffect, useRef } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import Transport from './Transport';

const modeKeyMap = {
  ',': 'seq',
  '.': 'pat',
};

const TransportContainer = ({ state, dispatch, togglePlay }) => {
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    if (mediaRecorderRef.current) {
      const method = state.recordingAudio ? 'start' : 'stop';
      mediaRecorderRef.current[method]();
    }
  }, [state.recordingAudio]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then(stream => {
        mediaRecorderRef.current = new MediaRecorder(stream, {
          mimeType: 'audio/webm',
        });

        mediaRecorderRef.current.ondataavailable = event => {
          chunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const name = Date.now();
          const blob = new Blob(chunksRef.current, {
            type: 'audio/webm; codecs=opus',
          });

          dispatch({
            type: 'add-sample',
            buffer: URL.createObjectURL(blob),
            name,
          });

          chunksRef.current = [];
        };
      })
      .catch(err => {
        console.log('The following getUserMedia error occured: ' + err);
      });
  }, [dispatch]);

  return (
    <>
      <KeyboardEventHandler
        handleKeys={[',', '.']}
        onKeyEvent={key => {
          dispatch({ type: 'mode', mode: modeKeyMap[key] });
        }}
      />
      <KeyboardEventHandler
        handleKeys={['space']}
        onKeyEvent={(key, event) => {
          event.preventDefault();
          togglePlay();
        }}
      />
      <KeyboardEventHandler
        handleKeys={['m']}
        onKeyEvent={(key, event) => {
          event.preventDefault();
          dispatch({ type: 'metronome-toggle' });
        }}
      />
      <KeyboardEventHandler
        handleKeys={['l']}
        onKeyEvent={(key, event) => {
          event.preventDefault();
          dispatch({ type: 'record-perf-toggle' });
        }}
      />
      <Transport
        pattern={state.activePattern}
        onChangeMode={mode => {
          dispatch({ type: 'mode', mode });
        }}
        mode={state.mode}
        bpm={state.bpm}
        playing={state.playing}
        recordingPrf={state.recordingPrf}
        recordingAudio={state.recordingAudio}
        onTogglePlay={() => {
          togglePlay();
        }}
        onTogglePerformanceRecord={() => {
          dispatch({ type: 'record-perf-toggle' });
        }}
        onToggleAudioRecord={() => {
          dispatch({ type: 'record-audio-toggle' });
        }}
        onChangeSwing={event => {
          dispatch({ type: 'swing', swing: event.target.value });
        }}
        onChangeBpm={event => {
          dispatch({ type: 'bpm', bpm: event.target.value });
        }}
        onToggleAudioRecordMode={() => {
          dispatch({ type: 'audio-record-mode' });
        }}
        recordAudioWhileHeld={state.recordAudioWhileHeld}
        swing={state.swing}
        metronome={state.metronome}
        onToggleMetronome={() => {
          dispatch({ type: 'metronome-toggle' });
        }}
        onToggleHelp={() => {
          dispatch({ type: 'help-toggle' });
        }}
        help={state.help}
        onTap={() => {
          dispatch({ type: 'bpm-tap' });
        }}
      />
    </>
  );
};

export default TransportContainer;
