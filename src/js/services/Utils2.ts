
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
}

export function formatAudioFilename(file: File | any): any {
  // local server file
  if (file.path) {
    return file;
  }

  // uploaded remote file
  if (!file || !file.size || !file.name) {
    return false;
  }

  const currentSound: any = {};
  if (file.name) {
    const filename = file.name.substring(0, file.name.lastIndexOf("."));

    currentSound.artist = filename.lastIndexOf("-")
      ? ucFirst(filename.substring(0, filename.lastIndexOf("-")).trim())
      : null;

    currentSound.title = filename.indexOf("-")
      ? ucFirst(filename.substring(filename.indexOf("-") + 1).trim())
      : filename;
  }

  return currentSound;
}

export function ucFirst(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function createGuid(): string {
  const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

export function formatTime(time: number): string {
  const seconds = Math.floor(time % 60);
  const minutes = Math.floor(time / 60);
  const formattedTime = ("0" + minutes).substr(-2) + ":" + ("0" + seconds).substr(-2);

  return formattedTime;
}
