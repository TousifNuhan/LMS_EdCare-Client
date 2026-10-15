import axios from "axios";

const axiosPublic = axios.create({
    baseURL:'https://edcare-seven.vercel.app'
})

const useAxiosPublic = () => {
    return axiosPublic
};

export default useAxiosPublic;