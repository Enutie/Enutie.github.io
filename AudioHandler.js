class AudioHandler {
  constructor() {
    this.audioContext = new AudioContext();
    this.audioElement = document.querySelectorAll(`audio`);
    this.gainNode = this.audioContext.createGain();
    this.background_music_playing = false
  }

  async play(sound) {

    this.gainNode.gain.value = 0.5;
    if (sound == "Idyllic" && this.background_source) {
        this.background_source.stop()
        this.background_source = null;
        return;
    }
    if (sound == "levelComplete") {
      this.gainNode.connect(this.audioContext.destination);
    } else {
      this.gainNode.connect(this.audioContext.destination);
    }
    var track = await this.loadFile(`res/sounds/${sound}.mp3`)
    var source = this.playTrack(track)

    if (sound == "Idyllic") //background music
    {
      this.background_source = source
    }
    
  }

  async getFile(filePath) {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
  }

  async loadFile(filePath) {
    const track = await this.getFile(filePath);
    return track;
  }

  playTrack(audioBuffer) {
    this.allowSound();
    const trackSource = this.audioContext.createBufferSource();
    trackSource.buffer = audioBuffer;
    trackSource.connect(this.gainNode);
    trackSource.start();

    return trackSource;
  }

  allowSound() {
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
  }
}
