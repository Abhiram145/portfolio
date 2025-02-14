import React from "react";
import Fotoflask from '../assets/Fotoflask.png';
import RytCrop from '../assets/RytCrop.png';
import Footer from './Footer';

const project = [
    {
        title: 'FOTOFLASK',
        description: 'FOTOFLASK is a user-friendly interface to streamline photo posting and browsing, prioritizing simplicity and accessibility for photographers of all skill levels.',
        image: Fotoflask,
        git: 'https://fotoflask.vercel.app',
        technologies: ['MongoDb', 'ReactJS', 'NodeJS', 'Express.js']
    },
    {
        title: 'RYTCROP',
        description: 'RytCrop, a Java-based application with a MySQL backend, to assist farmers in making informed crop decisions based on soil conditions, driving smarter agricultural practices.',
        image: RytCrop,
        git: "https://github.com/Abhiram145/RytCrop",
        technologies: ['Java', 'MySQL', 'JavaFX', 'OpenCSV']
    }
];

const ProjectCard = ({ image, title, description, git, technologies }) => {
    return (
        <div className="max-w-sm sm:max-w-md bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
            <a href={git} target="_blank" rel="noopener noreferrer">
                <img className="w-full rounded-t-lg h-48 object-cover" src={image} alt={title} />
            </a>
            <div className="p-6">
                <a href={git} target="_blank" rel="noopener noreferrer">
                    <h5 className="text-2xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-pink-500">{title}</h5>
                </a>
                <p className="mt-2 text-gray-300">{description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                    {technologies.map((tag, index) => (
                        <span key={index} className="text-sm text-blue-500">#{tag}</span>
                    ))}
                </div>
                <div className="mt-4 flex justify-end">
                    <a href={git} target="_blank" rel="noopener noreferrer" className="text-red-300 border border-gray-200 rounded-lg shadow px-4 py-2 hover:text-green-500 duration-300">
                        GitHub
                    </a>
                </div>
            </div>
        </div>
    );
};

const Projects = () => {
    return (
        <div className="min-h-screen bg-black flex flex-col">
            {/* Content Wrapper with flex-grow to push Footer down */}
            <div className="flex-grow flex flex-wrap gap-7 justify-center items-center p-12">
                {project.map((item, index) => (
                    <ProjectCard key={index} {...item} />
                ))}
            </div>
            {/* Footer stays at the bottom */}
            <Footer />
        </div>
    );
};

export default Projects;
