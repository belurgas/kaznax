'use client'

import { ProfileMain } from "@/components/shared/sel-profile";
import { expandViewport, init, isMiniAppMounted, miniAppHeaderColor, mountMiniApp, setMiniAppHeaderColor } from "@telegram-apps/sdk";
import { useEffect } from "react";

export default function Profile() {
    useEffect(() => {
        const initializeSdk = async () => {
            // Инициализация и методы SDK только в клиентской части
            init();
            if (mountMiniApp.isAvailable()) {
              mountMiniApp();
              isMiniAppMounted(); // true
            }
            if (setMiniAppHeaderColor.isAvailable()) {
              setMiniAppHeaderColor('#ffffff');
              miniAppHeaderColor(); // 'bg_color'
            }
      
            if (expandViewport.isAvailable()) {
              expandViewport();
            }
        };
        
        initializeSdk();
    }, [])

    return (
        <div className="flex justify-center items-center h-screen w-screen bg-gray-100">
           <ProfileMain />
        </div>
    );
}