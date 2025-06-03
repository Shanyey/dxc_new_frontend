//to be linked when ready
import React, { useCallback, useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import TrashIcon from "../../assets/icons/trash-icon.png";
import Moment from "moment";
import { ThreeDots } from "react-loader-spinner";
import Viewer from "viewerjs";
import { InformationCircleIcon } from "../../assets/icons/information-icon.png";
import * as pdfjs from "pdfjs-dist/build/pdf";
import "pdfjs-dist/build/pdf.worker.entry";
import createObjectURL from "create-object-url";
import addQuery from "../../../services/dbServices";

// Styling for dropzone (for files) border
const getColor = (props) => {
  if (props.isDragAccept) {
    return "#00e676";
  }
  if (props.isDragReject) {
    return "#ff1744";
  }
  if (props.isFocused) {
    return "#2196f3";
  }
  return "#eeeeee";
};
// styling for dropzone
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props) => getColor(props)};
  border-style: dashed;
  background-color: #ededed;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
  margin-left: 1.25rem;
  margin-right: 1.25rem;
`;

// This function would be passed Props -- String: feature (sum/tra/key), String: naming (file name) and DeploymentId: deploymentId (model chosen)
// Used in SummarisationPage.jsx, TranslationPage.jsx and KeywordPage.jsx for file batch processing feature.
function MyDropzone({ feature, naming, deploymentId, userInfo, model }) {
  const [myFiles, setMyFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState();
  const [loaderCount, setLoaderCount] = useState(0);
  const isMounted = useRef(false);
  const [numUploadedFiles, setNumUploadedFiles] = useState(0);

  // For OpenAI model (GPT3.5, GPT4-8k and GPT4-32k) specifications when click on the information icon
  useEffect(() => {
    let popup = new Viewer(document.getElementById("popup"));
    setPopup(popup);
  }, []);

  // UseEffect to prevent apiCall() from running on first render but render every time fileText is changed
  useEffect(() => {
    if (isMounted.current) {
      // Logic for loading 3 dots feature to indicate when the files finished processing
      if (loaderCount == numUploadedFiles) {
        setLoading(false);
        setLoaderCount(0);
      }
    } else {
      isMounted.current = true;
    }
  }, [loaderCount]);

  // Function to write to new text file
  function exportFile(fileContents, fileName) {
    const fileData = JSON.stringify(fileContents);
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download =
      naming + "_" + fileName + "_" + Moment().format("MMDDhhmm") + ".txt";
    link.href = url;
    link.click();
  }

  // When user upload file to update the frontend
  const onDrop = useCallback(
    (acceptedFiles) => {
      setMyFiles([...myFiles, ...acceptedFiles]);
    },
    [myFiles]
  );

  // Props for Dropzone initialisation
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject, fileRejections, } =
    useDropzone({
        onDrop,
        accept: { "text/plain": [".txt"], "application/pdf": [".pdf"] },
        validator: fileSizeValidator,
      });

  // Set file size limits specific to both text file and pdf file upload
  function fileSizeValidator(file) {
    if (file.type == "text/plain" && file.size > 25000) {
      return {
        code: "exceed-token-limits",
        message: "File exceeded OpenAi's token limits",
      };
    }

    if (file.type == "application/pdf") {
      const text = extractText(file);
      const tokenCount = text.length / 4;
      const tokenLimit = 128000;
      if (tokenCount > tokenLimit) {
        console.log("File exceeded OpenAi's token limit of 128000, submitted tokens:", tokenCount);
        return {
          code: "exceed-token-limits",
          message: "File exceeded OpenAi's token limits",
        };
      }
    }
    return null;
  }

  // Function to extract only EMBEDDED TEXT from pdf, returns a promise
  async function extractText(file) {
    // Use URL.createObjectURL to generate a URL for the PDF file
    const pdfUrl = URL.createObjectURL(file);

    // Pass the URL in an object with a 'url' key
    const pdf = await pdfjs.getDocument({ url: pdfUrl }).promise;

    let fullText = "";

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      fullText += pageText + " ";
    }

    // Revoke the object URL to release memory
    URL.revokeObjectURL(pdfUrl);

    return fullText;
  }


  // Function call to OpenAI, res: String, fileName : String, numFiles: int
  function apiCall(res, fileName) {
    const fileContents = res;

    // ------------------ Initialisation ---------------------
    // const endpoint = "https://chatbotapi1.openai.azure.com/";
    const endpoint = "https://chatgpt4vision-ga.openai.azure.com/";
    // const azureApiKey = String(import.meta.env.VITE_LUKE_KEY); // set as default key;
    // const azureApiKey = "cfd349e9242e4495bad6aa347a16b0c9";
    const azureApiKey = "ec53ee2213f4430d8b44e8de8fdee8db";
    // Prompt specific to each feature prop (Summarisation, Keyword and Translation)
    const prompt = feature + " " + fileContents;

    // Initial message to pass in to OpenAI
    const messages = [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ];

    // -------------------- Main Call OpenAI API --------------------
    async function main() {
      const client = new OpenAIClient(
        endpoint,
        new AzureKeyCredential(azureApiKey)
      );
      const result = await client.getChatCompletions(deploymentId, messages);

      // Write into new file to be downloaded into the user computer downloads folder
      for (const choice of result.choices) {
        addQuery(prompt, choice.message.content, userInfo, model, null);
        setLoaderCount((loaderCount) => loaderCount + 1);

        const cleanedContent = choice.message.content.replace(/\n/g, " ").trim();

        exportFile(
          cleanedContent,
          fileName.split(".").slice(0, -1).join(".")
        );
      }
    }

    // Catch Error
    main().catch((err) => {
      console.error("The file encountered an error:", err);
      window.alert("An error occurred, please try again later.");
    });
  }

  // Submit all files button
  const submitAll = async () => {
    setLoading(true);
    setNumUploadedFiles(myFiles.length);

    for (const file of myFiles) {
      // if file is pdf file
      if (file.type === "application/pdf") {
        const textContent = await extractText(file); // Await the extractText function directly
        await apiCall(textContent, file.name); // Await apiCall to ensure it's completed before moving on
      }
      // if file is text file
      if (file.type === "text/plain") {
        const reader = new FileReader();
        reader.onabort = () => console.log("File reading was aborted");
        reader.onerror = () => console.log("File reading has failed");
        reader.onload = () => {
          apiCall(reader.result, file.name); // No need to await here as FileReader works asynchronously
        };
        reader.readAsText(file);
      }
    }

    setMyFiles([]);
    setLoading(false);
  };


  // To remove a file using the bin icon
  const removeFile = (file) => () => {
    const newFiles = [...myFiles];
    newFiles.splice(newFiles.indexOf(file), 1);
    setMyFiles(newFiles);
  };

  // Remove all the accepted files
  const removeAll = () => {
    setMyFiles([]);
  };

  // Display accepted file items
  const acceptedFileItems = myFiles.map((file) => (
    <li className="py-0.3 hover:bg-slate-100" key={file.path}>
      {file.path} - {file.size} bytes{" "}
      <TrashIcon
        className="h-4 w-4 text-gray-400 float-right"
        onClick={removeFile(file)}
      >
        Remove File
      </TrashIcon>
    </li>
  ));

  // Display rejected file items
  const fileRejectionItems = fileRejections.map(({ file, errors }) => {
    return (
      <li key={file.path}>{file.path} - (Exceeded OpenAI's token limit.)</li>
    );
  });

  return (
    <>
      <br></br>
      {/* Model comparision pdf */}
      <div className="hide">
        <div id="popup">
          <img src={ModelComparison} alt="ModelComparison" />
        </div>
      </div>
      <div className="self-center">
        <p className="text-l font-medium self-center inline-block">
          Each file should not exceed OpenAI's token limit
        </p>
        <InformationCircleIcon
          className="w-10 h-10 pl-3 inline-block"
          type="button"
          onClick={() => {
            popup.show();
          }}
        ></InformationCircleIcon>
      </div>

      <br></br>

      {/* File upload dropzone */}
      <Container {...getRootProps({ isFocused, isDragAccept, isDragReject })}>
        <input
          {...getInputProps()}
          directory=""
          webkitdirectory=""
          type="file"
        />
        <h3>Drag 'n' drop files here, or click to select files</h3>
        <h3>(Only .txt and .pdf files are supported)</h3>
      </Container>

      <br></br>
      <br></br>

      {/* Upon file upload  */}
      <aside>
        <div className="h-80 overflow-y-scroll mx-4 pr-10">
          <div>
            <h4 className="font-bold text-base">Accepted files</h4>
            <ul>{acceptedFileItems}</ul>
            <br></br>
            <div className="flex">
              {acceptedFileItems.length > 0 && (
                <button
                  className="w-auto bg-gray-200 self-center mx-2"
                  onClick={removeAll}
                >
                  Remove All
                </button>
              )}

              {acceptedFileItems.length > 0 && (
                <button
                  className="w-auto bg-gray-200 self-center mx-2"
                  onClick={submitAll}
                >
                  Submit
                </button>
              )}
            </div>
            <br></br>
            <h4 className="font-bold text-base">Rejected files</h4>
            <ul>{fileRejectionItems}</ul>
          </div>
        </div>
      </aside>

      <br></br>

      <br></br>
      <br></br>
      <br></br>
      <br></br>

      <div
        className="flex absolute bottom-0 leading-loose justify-between w-full p-3 px-6"
        style={{ backgroundColor: "rgb(242, 242, 242)" }}
      >
        <div className="font-medium">
          It may take a while for the files to be processed and downloaded (.txt
          file) to your downloads folder.
        </div>
      </div>

      {/* To indicate loading when file is processing */}
      {loading && (
        <div className="absolute bottom-10 p-1 rounded-md text-gray-500 self-center ">
          <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="#4fa94d"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClassName=""
            visible={true}
          />
        </div>
      )}
    </>
  );
}
export default MyDropzone;
