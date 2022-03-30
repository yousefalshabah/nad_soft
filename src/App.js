import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Webcam from "react-webcam";

import { start, stop, save } from "./redux/video";

export default function App() {
  const { play } = useSelector((state) => state.video);
  const dispatch = useDispatch();
  const webcamRef = React.useRef(null);
  const mediaRecorderRef = React.useRef(null);
  const [capturing, setCapturing] = React.useState(false);
  const [hasCamera, setHasCamera] = React.useState(null);
  const [recordedChunks, setRecordedChunks] = React.useState([]);

  React.useEffect(() => {
    navigator.getMedia =
      navigator.getUserMedia || // use the proper vendor prefix
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;
    navigator.getMedia(
      { video: true },
      function () {
        setHasCamera(true);
      },
      function () {
        setHasCamera(false);
      }
    );
  });
  const handleStartCaptureClick = React.useCallback(() => {
    console.log(hasCamera);
    if (hasCamera) {
      dispatch(start());
      setCapturing(true);

      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: "video/webm",
      });

      mediaRecorderRef.current.addEventListener(
        "dataavailable",
        handleDataAvailable
      );
      mediaRecorderRef.current.start();
    }
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = React.useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setCapturing(false);
      dispatch(stop());
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      dispatch(save(url));
    }
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const handleDownload = React.useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      // a.style = "display: none";
      a.href = url;
      a.download = "react-webcam-stream-capture.webm";
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);
  return (
    <div className="App">
      <div style={{ ...Styles.mainContainer }}>
        <div className="col-md-12" style={{ ...Styles.recourderContainer }}>
          <div className="col-md-12">
            {hasCamera ? (
              <Webcam
                style={{ ...Styles.playerContainer }}
                ref={webcamRef}
                height={500}
                width={800}
              />
            ) : (
              <div
                style={{
                  ...Styles.playerContainer,
                  height: 500,
                  width: 800,
                  margin: "auto",
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                  justifyContent: "center",
                  color: "rgb(255 251 250)",
                }}
              >
                {" "}
                <h1>device dosn`t have a Camera</h1>
              </div>
            )}
          </div>
          <div className="col-md-12">
            {play ? (
              <i
                style={{ ...Styles.icon }}
                onClick={() => handleStopCaptureClick()}
                className="bi bi-stop-circle-fill"
              ></i>
            ) : (
              <i
                style={{ ...Styles.icon }}
                onClick={() => handleStartCaptureClick()}
                className="bi bi-record-circle-fill"
              ></i>
            )}
          </div>
          {recordedChunks.length > 0 && (
            <div className="col-md-12" style={{ ...Styles.saveContainer }}>
              <i
                onClick={() => handleDownload()}
                style={{ ...Styles.save }}
                className="bi bi-save2-fill"
              ></i>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const Styles = {
  mainContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    height: "100vh",
    width: "100wv",
    backgroundImage:
      'url("https://raw.githubusercontent.com/CanaanGM/Cube/master/old_arcade_chars.jpg")',
  },
  recourderContainer: {
    height: "650px",
    width: "950px",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "rgb(29 1 0)",
    margin: "auto",
    border: "2px solid rgb(255 251 250)",
    borderRadius: "12px",
    padding: "10px",
  },
  playerContainer: {
    padding: "0px",
    margin: "0px",
    borderRadius: "12px",
    border: "2px solid rgb(255 251 250)",
  },
  icon: {
    fontSize: "65px",
    color: "rgb(255 251 250)",
    padding: "0px",
    margin: "0px",
    cursor: "pointer",
  },
  saveContainer: {
    display: "flex",
    justifyContent: "end",
  },
  save: {
    fontSize: "15px",
    color: "rgb(255 251 250)",
    padding: "0px",
    margin: "0px",
    cursor: "pointer",
  },
};
