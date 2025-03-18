import useSWR, { SWRConfiguration } from 'swr';
import { publicApi, privateApi } from './configAxios';

type SWRResponse<T> = {
    data: T | undefined;
    error: any;
    isLoading: boolean;
};

export const getData = (url: string, params?: Record<string, any>) => publicApi.get(url, { params }).then(res => res.data);
export function usePublicFetch<T>(endpoint: string | null, params?: Record<string, any>, options?: SWRConfiguration): SWRResponse<T> {
    if (!endpoint) {
        return { data: undefined, error: undefined, isLoading: false };
    }
    const url = `${endpoint}`;
    const { data, error } = useSWR<T>([url, params], ([url, params]: [string, Record<string, any> | undefined]) => getData(url, params), {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        ...options, // Cho phép tùy chỉnh cấu hình SWR
    });

    return {
        data,
        error,
        isLoading: !data && !error
    };
}

export const getData1 = (url: string, params?: Record<string, any>) => privateApi.get(url, { params }).then(res => res.data);
export function usePrivateFetch<T>(endpoint: string | null, params?: Record<string, any>, options?: SWRConfiguration): SWRResponse<T> {
    if (!endpoint) {
        return { data: undefined, error: undefined, isLoading: false };
    }
    const url = `${endpoint}`;
    const { data, error } = useSWR<T>([url, params], ([url, params]: [string, Record<string, any> | undefined]) => getData1(url, params), {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        ...options, // Cho phép tùy chỉnh cấu hình SWR
    });

    return {
        data,
        error,
        isLoading: !data && !error
    };
}


// Sử dụng hook này
// const { data, error, isLoading } = usePublicFetch<{ result: { products: IProduct[] } }>('/product', { category: 'shoes', sort: 'price_desc' });
