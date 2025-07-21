document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const audioPlayer = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const volumeBtn = document.getElementById('volumeBtn');
    const volumeControl = document.getElementById('volumeControl');
    const progressBar = document.getElementById('progressBar');
    const currentTimeDisplay = document.getElementById('currentTime');
    const durationDisplay = document.getElementById('duration');
    const songTitle = document.getElementById('songTitle');
    const artistName = document.getElementById('artistName');
    const albumArt = document.getElementById('currentAlbumArt');
    const songList = document.getElementById('songList');
    
    // Your music library - Add your songs here
    const musicLibrary = [
        {
            title: "Sunset Dreams",
            artist: "Your Name",
            src: "songs/sunset-dreams.mp3",
            cover: "images/sunset-cover.jpg"
        },
        {
            title: "Midnight Thoughts",
            artist: "Your Name",
            src: "songs/midnight-thoughts.mp3",
            cover: "images/midnight-cover.jpg"
        },
        {
            title: "Morning Breeze",
            artist: "Your Name",
            src: "songs/morning-breeze.mp3",
            cover: "images/morning-cover.jpg"
        }
        // Add more songs as needed
    ];
    
    // Current song index
    let currentSongIndex = 0;
    let isPlaying = false;
    let isMuted = false;
    
    // Initialize the player
    function initPlayer() {
        // Create playlist
        musicLibrary.forEach((song, index) => {
            const li = document.createElement('li');
            li.textContent = `${song.title} - ${song.artist}`;
            li.addEventListener('click', () => playSong(index));
            songList.appendChild(li);
        });
        
        // Load the first song
        loadSong(currentSongIndex);
        
        // Set volume
        audioPlayer.volume = volumeControl.value;
    }
    
    // Load a song
    function loadSong(index) {
        const song = musicLibrary[index];
        songTitle.textContent = song.title;
        artistName.textContent = song.artist;
        audioPlayer.src = song.src;
        albumArt.src = song.cover || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80';
        
        // Update active song in playlist
        updateActiveSong();
    }
    
    // Update active song in playlist
    function updateActiveSong() {
        const songs = songList.querySelectorAll('li');
        songs.forEach((song, index) => {
            if (index === currentSongIndex) {
                song.classList.add('playing');
            } else {
                song.classList.remove('playing');
            }
        });
    }
    
    // Play song
    function playSong(index) {
        if (index !== currentSongIndex) {
            currentSongIndex = index;
            loadSong(currentSongIndex);
        }
        audioPlayer.play();
        isPlaying = true;
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    
    // Pause song
    function pauseSong() {
        audioPlayer.pause();
        isPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
    
    // Next song
    function nextSong() {
        currentSongIndex = (currentSongIndex + 1) % musicLibrary.length;
        loadSong(currentSongIndex);
        if (isPlaying) {
            audioPlayer.play();
        }
    }
    
    // Previous song
    function prevSong() {
        currentSongIndex = (currentSongIndex - 1 + musicLibrary.length) % musicLibrary.length;
        loadSong(currentSongIndex);
        if (isPlaying) {
            audioPlayer.play();
        }
    }
    
    // Update progress bar
    function updateProgress() {
        const { duration, currentTime } = audioPlayer;
        const progressPercent = (currentTime / duration) * 100;
        progressBar.value = progressPercent;
        
        // Update time displays
        currentTimeDisplay.textContent = formatTime(currentTime);
        if (duration) {
            durationDisplay.textContent = formatTime(duration);
        }
    }
    
    // Format time (seconds to MM:SS)
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    // Set progress
    function setProgress() {
        const duration = audioPlayer.duration;
        audioPlayer.currentTime = (progressBar.value * duration) / 100;
    }
    
    // Toggle mute
    function toggleMute() {
        if (isMuted) {
            audioPlayer.volume = volumeControl.value;
            volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            audioPlayer.volume = 0;
            volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
        isMuted = !isMuted;
    }
    
    // Event Listeners
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong(currentSongIndex);
        }
    });
    
    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);
    
    volumeBtn.addEventListener('click', toggleMute);
    volumeControl.addEventListener('input', () => {
        audioPlayer.volume = volumeControl.value;
        if (audioPlayer.volume === 0) {
            volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            isMuted = true;
        } else {
            volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            isMuted = false;
        }
    });
    
    progressBar.addEventListener('input', setProgress);
    
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', nextSong);
    audioPlayer.addEventListener('loadedmetadata', () => {
        durationDisplay.textContent = formatTime(audioPlayer.duration);
    });
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        switch (e.code) {
            case 'Space':
                e.preventDefault();
                if (isPlaying) {
                    pauseSong();
                } else {
                    playSong(currentSongIndex);
                }
                break;
            case 'ArrowRight':
                nextSong();
                break;
            case 'ArrowLeft':
                prevSong();
                break;
            case 'ArrowUp':
                if (audioPlayer.volume < 1) {
                    audioPlayer.volume = Math.min(audioPlayer.volume + 0.1, 1);
                    volumeControl.value = audioPlayer.volume;
                }
                break;
            case 'ArrowDown':
                if (audioPlayer.volume > 0) {
                    audioPlayer.volume = Math.max(audioPlayer.volume - 0.1, 0);
                    volumeControl.value = audioPlayer.volume;
                }
                break;
        }
    });
    
    // Initialize the player
    initPlayer();
});
