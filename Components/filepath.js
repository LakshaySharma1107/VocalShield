let fileUri = null;
let filePath = null;
let fileUrluploaded = null;
let uniqueid = null;
// Function to set the file URI
export const setFilename = (contentUri) => {

// Extracting the number after the last '/'
  const extractedId = contentUri.split('/').pop();

  console.log(extractedId); 

  fileUri = extractedId;
};

// Function to get the file URI
export const getFilename = () => {
  return fileUri; // Return the complete URI provided by DocumentPicker
};

// Function to set the file URI
export const setFilePath = (filesource) => {

    filePath = filesource;
  };
  
  // Function to get the file URI
  export const getFilePath = () => {
    return filePath; // Return the complete URI provided by DocumentPicker
  };
export const setFileUrl = (name) => {

  fileUrluploaded = "content://com.android.providers.downloads.documents/document/"+name;
};

// Function to get the file URI
export const getFileUrluploaded = () => {
  return fileUrluploaded; // Return the complete URI provided by DocumentPicker
};

export const setFileAudioUID = (id) => {

  uniqueid = id;
};

// Function to get the file URI
export const getFileAudioUID = () => {
  return uniqueid; // Return the complete URI provided by DocumentPicker
};