import axios from "axios";

// 定义接口以描述 ImageTextPair 的结构
export interface ImageTextPair {
  image_paths: string[];
  description: string;
  id: number;
  tagged_type?: string;
  batch: string;
}

// 定义分页响应的接口
export interface PaginatedResponse<T> {
  tags: T[];
  currentPage: number;
  totalPages: number;
  totalTags: number;
}

export const BACK_END_URL =
  process.env.NEXT_PUBLIC_BACK_END_URL || "http://localhost:8888";
console.log("BACK_END_URL:", BACK_END_URL);

// 使用 Axios 配置基础 URL
const axiosInstance = axios.create({
  baseURL: BACK_END_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 获取分页的标签
export const getPaginatedTags = async (
  page: number,
  limit: number
): Promise<PaginatedResponse<ImageTextPair> | null> => {
  try {
    const response = await axiosInstance.get(`/tags`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching paginated tags:", error);
    return null;
  }
};

// 通过 ID 获取图像对
export const getPairById = async (
  id: number
): Promise<ImageTextPair | null> => {
  try {
    const response = await axiosInstance.get(`/tags/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pair by id:", error);
    return null;
  }
};

// 标记图像对
export const markPair = async (
  type: string,
  id: number,
  batch: string = "1_1"
): Promise<void> => {
  try {
    await axiosInstance.put(`/tags/tag/${id}`, {
      tagged_type: type,
      id,
      batch,
    });
  } catch (error) {
    console.error("Error marking pair:", error);
  }
};

// 创建新标签
export const createTag = async (
  image_paths: string[],
  description: string,
  id: number,
  batch: string
): Promise<ImageTextPair | null> => {
  try {
    const response = await axiosInstance.post(`/tags`, {
      image_paths,
      description,
      id,
      batch,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating tag:", error);
    return null;
  }
};
