export const resetAudio = (audio) => {
    audio.pause();
    audio.currentTime = 0;
    audio.play();
}; 