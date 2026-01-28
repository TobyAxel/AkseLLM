import { useState } from "react";

function SideBar() {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className={`h-dvh bg-neutral-900 relative transition-all duration-300 ease-in-out ${isOpen ? "w-62" : "w-12"}`}>
            <button onClick={() => setIsOpen(!isOpen)} className={`absolute right-1 top-1 cursor-pointer w-10 h-10 pb-1 rounded-md hover:bg-neutral-800`} title={isOpen ? "Close Sidebar" : "Open Sidebar"}>
                {isOpen ? "✖" : "☰"}
            </button>

            <div className={`absolute flex items-center bottom-1 left-1 cursor-pointer ${isOpen ? "w-60" : "w-10"} h-10 rounded-md overflow-hidden hover:bg-neutral-800 transition-all duration-300 ease-in-out`}>
                <img src="./public/blank-pfp.png" className="w-8 h-8 rounded-full ml-1"></img> <span className="pl-2">username1234</span>
            </div>
        </div>
    );
}

export default SideBar;
