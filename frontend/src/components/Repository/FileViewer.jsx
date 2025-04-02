import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

const FileViewer = () => {
    const [fileName,setFileName]=useState("");
    const [fileContent,setFileContent]=useState("");
    const {id,filename}=useParams();
    useEffect(()=>{
        const fetchFileContent=async()=>{
            const userId=localStorage.getItem('userId');
            const content=await axios.get(`13.234.31.127:8080/repo/${userId}/${id}/${filename}`);
            setFileName(content.data.fileName);
            setFileContent(content.data.content);
        };
        fetchFileContent();
    },[]);
    return (
      <div className="min-h-screen bg-[#0d1117] text-white p-4">
        <div className="max-w-4xl mx-auto">
          {/* File name header */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-t-md p-3 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="text-lg font-semibold">{fileName}</span>
          </div>
  
          {/* File content */}
          <div className="bg-[#0d1117] border border-t-0 border-[#30363d] rounded-b-md p-4 overflow-x-auto">
            <pre className="text-sm font-mono whitespace-pre-wrap break-words text-gray-300">{fileContent}</pre>
          </div>
        </div>
      </div>
    )
  }
  
  export default FileViewer
  
  