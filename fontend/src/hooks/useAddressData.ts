import { useState, useEffect } from "react";
import axios from "axios";

// Định nghĩa kiểu dữ liệu cho tỉnh, huyện, xã
interface Province {
    code: string;
    name: string;
}

interface District {
    code: string;
    name: string;
}

interface Ward {
    code: string;
    name: string;
}

export default function useAddressData() {
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);

    useEffect(() => {
        axios.get<Province[]>("https://provinces.open-api.vn/api/p/")
            .then(response => setProvinces(response.data))
            .catch(error => console.error("Error fetching provinces:", error));
    }, []);

    const fetchDistricts = (provinceCode: string) => {
        axios.get<{ districts: District[] }>(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
            .then(response => setDistricts(response.data.districts))
            .catch(error => console.error("Error fetching districts:", error));
    };

    const fetchWards = (districtCode: string) => {
        axios.get<{ wards: Ward[] }>(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
            .then(response => setWards(response.data.wards))
            .catch(error => console.error("Error fetching wards:", error));
    };

    return { provinces, districts, wards, fetchDistricts, fetchWards };
}
