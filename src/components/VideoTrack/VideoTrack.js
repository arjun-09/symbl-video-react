import React, { useRef, useEffect } from 'react';
import { styled } from '@material-ui/core/styles';
import useMediaStreamTrack from '../../hooks/useMediaStreamTrack/useMediaStreamTrack';
import useMainSpeaker from "../../hooks/useMainSpeaker/useMainSpeaker";

const Video = styled('video')({
  width: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
});

export default function VideoTrack({ track, isLocal, priority, mainParticipant }) {
  const videoElementRef = useRef(null);
  const mediaStreamTrack = useMediaStreamTrack(track);

  useEffect(() => {
    const el = videoElementRef.current;
    el.muted = true;
    if (track.setPriority && priority) {
      track.setPriority(priority);
    }
    track.attach(el);
    return () => {
      track.detach(el);
      if (track.setPriority && priority) {
        // Passing `null` to setPriority will set the track's priority to that which it was published with.
        track.setPriority(null);
      }
    };
  }, [track, priority]);

  // The local video track is mirrored if it is not facing the environment.
  const isFrontFacing = mediaStreamTrack?.getSettings().facingMode !== 'environment';
  const style = isLocal && isFrontFacing ? { transform: 'rotateY(180deg)' } : {};

  // console.log(priority)
  // const mainParticipantStyle = isLocal && isFrontFacing && priority === 'high' ? { height: '100%', objectFit: 'cover' } : {}

  return <Video ref={videoElementRef} style={{...style, ...{ height: '100%', objectFit: 'cover' }}} />;
}
