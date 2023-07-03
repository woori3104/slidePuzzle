export const resizeImage = (image: string | ArrayBuffer | null, maxWidth: number, maxHeight: number) => {
  return new Promise<string | null>((resolve) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }

      console.log(width, height);
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = width;
      canvas.height = height;
      context?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL());
    };
    img.src = image as string;
  });
};
