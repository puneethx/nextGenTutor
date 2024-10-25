import React, { useState, useEffect } from "react";
import { X, Upload, Plus } from "lucide-react";
import SubjectCard from "../../components/SubjectCard/SubjectCard";
import CreateNew from "../../components/CreateNew/CreateNew";
import data from "../../data.json";
import WebcamDisplay from "../../react3/WebcamDisplay";

const Home = () => {

    const [chats, setChats] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setChats(data.subjects);
    }, []);

    const handleCardClick = (category) => {
        window.location.href = `/${category}`;
      };
    return (
        <div>
            <header className="header">
                <h1 className="logo">NextGenTutor</h1>
            </header>

            <main className="main">
                <h2 className="main-heading">
                    Hey! Go through your classes with our virtual tutor
                </h2>
                <h3 className="sub-heading">Previously Created Chats</h3>

                <div className="cards-grid">
                    {chats.map((chat, index) => (
                        <SubjectCard key={index} {...chat} onCardClick={handleCardClick} />
                    ))}
                </div>

                <button onClick={() => setIsModalOpen(true)} className="create-button">
                    <Plus size={20} />
                    Create New
                </button>

                <CreateNew
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={(data) => console.log(data)}
                />
            </main>
            <WebcamDisplay/>
        </div>
    )
}

export default Home