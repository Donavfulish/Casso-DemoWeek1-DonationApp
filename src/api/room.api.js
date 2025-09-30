    import api from "./index";

    export const createRoom = () => api.post("/room");
    export const checkCode = (code) => api.post("/room/check", {code})
    export const getCode = () => api.get("room/by-session");