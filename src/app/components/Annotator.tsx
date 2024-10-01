/* eslint-disable @next/next/no-img-element */
// src/components/Annotator.tsx
"use client";
import React, { useEffect, useState } from "react";
import usePairs from "@/hooks/usePairs"; // 引入你定义的 usePairs 钩子

const Annotator: React.FC = () => {
  const {
    currentPair,
    fetchCurrentPair,
    fetchNextPair,
    fetchPrevPair,
    fetchPairById,
    markCurrentPair,
    currentId,
    BASE_IMAGE_URL,
  } = usePairs();

  // 组件内部状态管理
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [inputId, setInputId] = useState<string>(""); // 用于输入 id

  // 加载当前的图像文本对
  useEffect(() => {
    fetchCurrentPair();
  }, []);

  // 监视 currentPair 的变化
  useEffect(() => {
    if (currentPair) {
      console.log("currentPair has changed:", currentPair);
      setStatusMessage(`Loaded pair with id: ${currentPair.id}`);
    }
  }, [currentPair]);

  // 处理标注操作，标记当前的图片对
  const handleMark = async (type: string) => {
    if (currentPair) {
      try {
        await markCurrentPair(type);
        setStatusMessage(`上次操作: Marked as ${type}`);
        fetchNextPair();
      } catch (error) {
        setStatusMessage("Failed to mark pair");
        console.error(error);
      }
    }
  };

  // 处理通过输入框切换 id
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputId(e.target.value);
  };

  const handleGoToPair = async () => {
    if (inputId) {
      await fetchPairById(parseInt(inputId)); // 使用输入的 id 切换到指定的图像对
      setStatusMessage(`Loaded pair with id: ${inputId}`);
    }
  };

  if (!currentPair) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="image-container flex flex-row space-x-4 mb-4">
        <div className="flex flex-col items-center">
          <img
            src={BASE_IMAGE_URL + currentPair.image_paths[0]}
            alt="Image 1"
            className="w-[500px] h-[500px] object-contain border rounded shadow"
          />
          <div className="text-black p-2 mt-2 rounded-lg bg-cyan-200">
            源图像
          </div>
        </div>
        <div className="flex flex-col items-center">
          <img
            src={BASE_IMAGE_URL + currentPair.image_paths[1]}
            alt="Image 2"
            className="w-[500px] h-[500px] object-contain border rounded shadow"
          />
          <div className="text-black p-2 mt-2 rounded-lg bg-cyan-200">
            目标图像
          </div>
        </div>
      </div>
      <p className="description text-lg text-gray-700 mb-4 max-w-xl text-center">
        {currentPair.description}
      </p>

      {/* 输入框和按钮来跳转到指定 id 的图像对 */}

      <div className="button-group flex space-x-4 mb-6">
        <button
          onClick={() => handleMark("correct")}
          className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
        >
          Correct
        </button>
        <button
          onClick={() => handleMark("incorrect")}
          className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
        >
          Incorrect
        </button>
        <button
          onClick={() => handleMark("ambiguous")}
          className="px-4 py-2 bg-yellow-500 text-white rounded shadow hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
        >
          Ambiguous
        </button>
      </div>

      <div className="navigation-buttons w-full  flex items-center justify-center space-x-4 ">
        <button
          onClick={() => {
            fetchPrevPair();
            setStatusMessage("Loading previous pair...");
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => {
            fetchNextPair();
            setStatusMessage("Loading next pair...");
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
        >
          Next
        </button>
        <div className="flex items-center space-x-4 ">
          <input
            type="number"
            value={inputId}
            onChange={handleInputChange}
            placeholder="Enter ID"
            className="px-4 py-2 border rounded shadow"
          />
          <button
            onClick={handleGoToPair}
            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none"
          >
            Go to ID
          </button>
        </div>
      </div>

      <div className="fixed top-2 left-2 ">
        <div className="p-2 rounded-lg bg-cyan-200 mb-2">
          <span className=" text-black">当前图像id: {currentId}</span>
        </div>
        {currentPair.tagged_type && (
          <div
            className={`text-black p-2 rounded-lg ${
              currentPair.tagged_type === "correct"
                ? "bg-green-500"
                : currentPair.tagged_type === "incorrect"
                ? "bg-red-500"
                : currentPair.tagged_type === "ambiguous"
                ? "bg-yellow-500"
                : "bg-gray-500"
            }`}
          >
            <span>标记类型: {currentPair.tagged_type}</span>
          </div>
        )}
      </div>
      {statusMessage && (
        <p className="status-message text-sm text-gray-600 mt-2">
          {statusMessage}
        </p>
      )}
    </div>
  );
};

export default Annotator;
