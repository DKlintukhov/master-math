export namespace Util {
    export const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const remainingSeconds = (time % 60).toFixed(0);
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`;
    };
}
