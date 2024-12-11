"use client";

import { useSocket } from "../providers/socket-provider";
import { Badge } from "../ui/badge";

export const SocketIndicator = () => {
    const { isConnected } = useSocket();

    if (!isConnected) {
        return (
            <Badge variant="outline" className="bg-yellow-600 text-white">
                Fallback: Подойдите к Алексею
            </Badge>
        )
    }

    return (
        <Badge variant="outline" className="bg-green-600 text-white">
            Live
        </Badge>
    )
}