class SoundManager {
    constructor() {
        this.audio = new Audio('/sounds/notification.mp3');
        this.audio.load();
        this.hasInteracted = false;
        this.setupInteractionListener();
    }

    setupInteractionListener() {
        const handleInteraction = () => {
            this.hasInteracted = true;
            // Remove listeners after first interaction
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('keydown', handleInteraction);
        };

        document.addEventListener('click', handleInteraction);
        document.addEventListener('keydown', handleInteraction);
    }

    async play(isTest = false) {
        if (localStorage.getItem('notificationSound') === 'disabled' && !isTest) {
            return;
        }

        try {
            if (!this.hasInteracted && !isTest) {
                console.warn('Notification sound queued - waiting for user interaction');
                return;
            }

            this.audio.currentTime = 0;
            await this.audio.play();
        } catch (error) {
            console.warn('Sound playback error:', error);
            if (error.name === 'NotAllowedError') {
                console.warn('Browser requires user interaction before playing audio');
            }
        }
    }
}

const soundManager = new SoundManager();
export const playNotificationSound = (isTest = false) => soundManager.play(isTest);
