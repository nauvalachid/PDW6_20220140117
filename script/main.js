document.addEventListener("DOMContentLoaded", function() {
    const audioTracks = document.querySelectorAll('.soundtrack');
    let currentTrackIndex = 0;
    let isPlaying = false;

    const playButton = document.getElementById('play');
    const nextButton = document.getElementById('next');
    const progressBar = document.getElementById('progress');
    const currentTimeDisplay = document.getElementById('current-time');
    const durationDisplay = document.getElementById('duration');

    function togglePlay() {
        if (isPlaying) {
            audioTracks[currentTrackIndex].pause();
        } else {
            audioTracks[currentTrackIndex].play();
        }
        isPlaying = !isPlaying;
        updatePlayButton();
    }

    function playNextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % audioTracks.length;
        audioTracks[currentTrackIndex].play();
        isPlaying = true;
        updatePlayButton();
        updateAudioInfo();
    }

    function updatePlayButton() {
        const icon = isPlaying ? 'fa-pause' : 'fa-play';
        playButton.classList.remove('fa-play', 'fa-pause');
        playButton.classList.add(icon);
    }

    function updateProgress() {
        const { currentTime, duration } = audioTracks[currentTrackIndex];
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        currentTimeDisplay.textContent = formatTime(currentTime);
        durationDisplay.textContent = formatTime(duration);
    }

    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function updateAudioInfo() {
        const currentTrack = audioTracks[currentTrackIndex];
        const trackTitle = currentTrack.getAttribute('data-title');
        const trackArtist = currentTrack.getAttribute('data-artist');
        document.getElementById('current-track-title').textContent = trackTitle;
        document.getElementById('current-track-artist').textContent = trackArtist;
    }

    playButton.addEventListener('click', togglePlay);
    nextButton.addEventListener('click', playNextTrack);

    audioTracks.forEach(track => {
        track.addEventListener('timeupdate', updateProgress);
        track.addEventListener('ended', () => {
            isPlaying = false;
            updatePlayButton();
        });
    });

    progressBar.addEventListener('click', (e) => {
        const { offsetX } = e;
        const progressWidth = progressBar.clientWidth;
        const seekTime = (offsetX / progressWidth) * audioTracks[currentTrackIndex].duration;
        audioTracks[currentTrackIndex].currentTime = seekTime;
    });
});
