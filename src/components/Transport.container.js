import React, { useEffect, useRef } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { connect } from 'react-redux';
import { createSound } from '../lib/sound';
import Transport from './Transport';

const modeKeyMap = {
  ',': 'seq',
  '.': 'pat',
};

const TransportContainer = ({
  activePattern,
  bpm,
  dispatch,
  help,
  metronome,
  mode,
  playing,
  recordAudioWhileHeld,
  recordingAudio,
  recordingPrf,
  swing,
}) => {
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  function togglePlay() {
    dispatch({ type: 'play-toggle' });
  }

  useEffect(() => {
    if (mediaRecorderRef.current) {
      const method = recordingAudio ? 'start' : 'stop';
      mediaRecorderRef.current[method]();
    }
  }, [recordingAudio]);

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

        mediaRecorderRef.current.onstop = async () => {
          const name = Date.now();
          const blob = new Blob(chunksRef.current, {
            type: 'audio/webm; codecs=opus',
          });

          const sound = createSound();
          await sound.player.load(URL.createObjectURL(blob));

          dispatch({
            type: 'add-sound',
            sound,
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
        onKeyEvent={() => {
          dispatch({ type: 'metronome-toggle' });
        }}
      />
      <KeyboardEventHandler
        handleKeys={['l']}
        onKeyEvent={() => {
          dispatch({ type: 'record-perf-toggle' });
        }}
      />
      <KeyboardEventHandler
        handleKeys={['\\']}
        onKeyEvent={() => {
          dispatch({ type: 'bpm-tap' });
        }}
      />
      <Transport
        pattern={activePattern}
        onChangeMode={mode => {
          dispatch({ type: 'mode', mode });
        }}
        mode={mode}
        bpm={bpm}
        playing={playing}
        recordingPrf={recordingPrf}
        recordingAudio={recordingAudio}
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
        recordAudioWhileHeld={recordAudioWhileHeld}
        swing={swing}
        metronome={metronome}
        onToggleMetronome={() => {
          dispatch({ type: 'metronome-toggle' });
        }}
        onToggleHelp={() => {
          dispatch({ type: 'help-toggle' });
        }}
        help={help}
        onTap={() => {
          dispatch({ type: 'bpm-tap' });
        }}
      />
    </>
  );
};

export default connect(
  ({
    activePattern,
    bpm,
    dispatch,
    help,
    metronome,
    mode,
    playing,
    recordAudioWhileHeld,
    recordingAudio,
    recordingPrf,
    swing,
  }) => ({
    activePattern,
    bpm,
    dispatch,
    help,
    metronome,
    mode,
    playing,
    recordAudioWhileHeld,
    recordingAudio,
    recordingPrf,
    swing,
  }),
)(TransportContainer);
