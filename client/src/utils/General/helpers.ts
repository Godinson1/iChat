const readURI = (
  e: React.ChangeEvent<HTMLInputElement>,
  setImages: Function
) => {
  if (e.target.files) {
    const files = Array.from(e.target.files);
    Promise.all(
      files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.addEventListener("load", (ev) => {
            if (ev.target) resolve(ev.target.result);
          });
          reader.addEventListener("error", reject);
          reader.readAsDataURL(file);
        });
      })
    ).then(
      (images) => {
        setImages(images);
      },
      (error) => {
        console.error(error);
      }
    );
  }
};

export { readURI };
