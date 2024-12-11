// 'use client'

// import { Slider } from "@/components/ui/slider"
// import { hapticFeedback } from "@telegram-apps/sdk";
// import React, { useEffect } from "react";

// interface Props {
//     className?: string;
// }

// const SliderVib = () => {
//     const handleChange = () => {
//         const melody = [
//             { intensity: 'light' as 'light', duration: 200 },  // Легкая вибрация
//             { intensity: 'medium' as 'medium', duration: 300 }, // Средняя вибрация
//             { intensity: 'light' as 'light', duration: 200 },  // Легкая вибрация
//             { intensity: 'heavy' as 'heavy', duration: 500 },  // Сильная вибрация
//             { intensity: 'medium' as 'medium', duration: 300 }, // Средняя вибрация
//             { intensity: 'light' as 'light', duration: 200 },  // Легкая вибрация
//         ];

//         melody.forEach((vibration, index) => {
//             setTimeout(() => {
//                 hapticFeedback.impactOccurred(vibration.intensity);
//             }, index * vibration.duration);
//         }); 
//     }
    

//     return (
//         <div>
//             <Slider
//                 className="my-10"
//                 defaultValue={[50]}
//                 max={100}
//                 step={1}
//                 onValueChange={(value) => {
//                     if (value <= [20]) {
//                         hapticFeedback.impactOccurred("soft");
//                     } else if (value > [20] && value <= [40]) {
//                         hapticFeedback.impactOccurred("light");
//                     } else if (value > [40] && value <= [60]) {
//                         hapticFeedback.impactOccurred("light");
//                     } else if (value > [60] && value <= [80]) {
//                         hapticFeedback.impactOccurred("medium");
//                     } else if (value > [80]) {
//                         hapticFeedback.impactOccurred("medium");
//                     }
//                 }}
//             />
//             <button className="bg-white rounded-sm font-bold py-10 px-10" onClick={handleChange}>Click</button>
//         </div>
//     )
// }

// export default SliderVib;