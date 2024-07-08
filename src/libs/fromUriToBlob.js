const fromUriToBlob = (dataUri) => {
  const binary = atob(dataUri.split(",")[1]);
  const mimeString = dataUri.split(",")[0].split(":")[1].split(";")[0];
  const array = [...binary].map((_, i) => binary.charCodeAt(i));

  return new Blob([new Uint8Array(array)], { type: mimeString });
};

export default fromUriToBlob;
