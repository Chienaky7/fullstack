import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Instance không có Authorization (dùng cho public API)
export const publicApi = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

// Instance có Authorization (dùng cho private API)
export const privateApi = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
});

// Hàm thêm token vào privateApi khi gọi API
privateApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor để xử lý khi token hết hạn
privateApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            const token = localStorage.getItem("token");

            if (!token) {
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject(new Error(error.message));
            }

            try {
                // Gửi yêu cầu refresh token
                const res = await publicApi.post("/auth/refresh", { token: token });

                // Lưu token mới vào localStorage
                localStorage.setItem("token", res.data.token);

                // Cập nhật lại header Authorization
                error.config.headers.Authorization = `Bearer ${res.data.result.token}`;

                // Gửi lại request cũ với token mới
                return privateApi(error.config);
            } catch (err) {
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject(new Error(error.message));
            }
        }

        return Promise.reject(new Error(error.message));
    }
);

export const postData = async (
    endpoint: string,
    data: FormData | object,
    isFormData: boolean = false
) => {
    try {
        const headers = isFormData
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" };

        const payload = isFormData ? data : JSON.stringify(data);

        const response = await privateApi.post(endpoint, payload, { headers });
        return response.data.result;
    } catch (error) {
        console.error("Lỗi khi gửi dữ liệu:", error);
        throw error;
    }
};


export const putData = async (
    endpoint: string,
    data: FormData | object,
    isFormData: boolean = false
) => {
    try {
        const headers = isFormData
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" };

        const payload = isFormData ? data : JSON.stringify(data);

        const response = await privateApi.put(endpoint, payload, { headers });
        return response.data.result;
    } catch (error) {
        console.error("Lỗi khi gửi dữ liệu:", error);
        throw error;
    }
};

export const delData = async (
    endpoint: string,
    data: FormData | object,
    isFormData: boolean = false
) => {
    try {
        const headers = isFormData
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" };

        const payload = isFormData ? data : JSON.stringify(data);

        const response = await privateApi.delete(endpoint, { headers, data: payload });
        return response.data.result;
    } catch (error) {
        console.error("Lỗi khi gửi dữ liệu:", error);
        throw error;
    }
};

