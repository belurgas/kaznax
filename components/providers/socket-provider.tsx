"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";
import { io as ClientIO } from "socket.io-client";


type SocketContextType = {
    socket: any | null;
    isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => {
    return useContext(SocketContext);
};


export const SocketProvider = ({
    children
}: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false)

    // ЭТОТ ЗАПРОС ПРИСХОДИТ У ВСЕХ БОЛЬЗОВАТЕЛЕЙ, ВСЕ ПОЛЬЗОВТЕЛИ ДОБАВЛЯЮТ В БД ДАННЫЕ

    useEffect(() => {
        const socketInstance = new (ClientIO as any)(process.env.NEXT_PUBLIC_SITE_URL!, {
            path: "/api/socket/io",
            addTrailingSlash: false,
        });

        socketInstance.on("connect", () => {
            setIsConnected(true);
        })

        socketInstance.on("disconnect", () => {
            setIsConnected(false);
        })

        socketInstance.on("recuver", (message: string) => {
            console.log("Я сейчас дрочить начну", message)
        })
        
        // Грубо говоря мы тут отпроавляем что-нибдуь
        socketInstance.on("add_card", (telegram_id: number) => {
            console.log("Всё работает отлично. Один раз пользователя записали: ", telegram_id)
        })

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        }
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    )
}