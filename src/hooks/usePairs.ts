import { useState, useEffect } from "react";
import type { ImageTextPair } from "../api/index";
import { getPairById, markPair } from "../api/index";

const BASE_IMAGE_URL = process.env.NEXT_PUBLIC_BACK_END_URL + "/static/";
const LOCAL_STORAGE_KEY = "currentPairId"; // 定义 LocalStorage 的 key

const usePairs = () => {
  // 从 LocalStorage 获取初始的 currentId
  const initialId = Number(localStorage.getItem(LOCAL_STORAGE_KEY)) || 0;

  const [currentId, setCurrentId] = useState(initialId);
  const [pairs, setPairs] = useState<ImageTextPair[]>([]);
  const [currentPair, setCurrentPair] = useState<ImageTextPair | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 持久化 currentId 到 LocalStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, currentId.toString());
  }, [currentId]);

  // 检查缓存中是否已经加载过该 ID 的 Pair
  const getPairFromCache = (id: number): ImageTextPair | null => {
    const cachedPair = pairs.find((pair) => pair.id === id);
    return cachedPair || null;
  };

  // 获取当前的图像对
  const fetchCurrentPair = async () => {
    setLoading(true);
    setError(null);
    try {
      const cachedPair = getPairFromCache(currentId);
      if (cachedPair) {
        setCurrentPair(cachedPair);
        setLoading(false);
        return;
      }

      const pair = await getPairById(currentId);
      if (pair) {
        setCurrentPair(pair);
        setCurrentId(pair.id);
        setPairs((prev) => [...prev, pair]); // 缓存新的 pair
      }
    } catch {
      setError("Failed to fetch current pair.");
    } finally {
      setLoading(false);
    }
  };

  // 根据 ID 获取图像对
  const fetchPairById = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const cachedPair = getPairFromCache(id);
      if (cachedPair) {
        setCurrentPair(cachedPair);
        setCurrentId(cachedPair.id);
        setLoading(false);
        return;
      }

      const pair = await getPairById(id);
      if (pair) {
        setCurrentPair(pair);
        setCurrentId(pair.id);
        setPairs((prev) => [...prev, pair]);
      }
    } catch {
      setError("Failed to fetch pair by ID.");
    } finally {
      setLoading(false);
    }
  };

  // 获取下一个图像对
  const fetchNextPair = async () => {
    await fetchPairById(currentId + 1);
  };

  // 获取上一个图像对
  const fetchPrevPair = async () => {
    if (currentId > 0) {
      await fetchPairById(currentId - 1);
    }
  };

  // 标记当前图像对
  const markCurrentPair = async (type: string) => {
    if (currentPair) {
      try {
        await markPair(type, currentPair.id, currentPair.batch);
      } catch {
        setError("Failed to mark current pair.");
      }
    }
  };

  return {
    currentId,
    currentPair,
    loading,
    error,
    fetchCurrentPair,
    fetchPairById,
    fetchNextPair,
    fetchPrevPair,
    markCurrentPair,
    BASE_IMAGE_URL,
  };
};

export default usePairs;
