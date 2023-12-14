import { ParallaxGlare } from "@/src/components/utils/parallax-glare";

export function AboutUs() {
    const developers = [
        {
            name: "André Lima",
            linkedin: "https://www.linkedin.com/in/limwa/",
            instagram: "https://www.instagram.com/limaaaaaaaa_/",
            github: "",
            website: "https://www.limwa.pt",
            imagePath: "/lima.jpg",
        },
        {
            name: "Guilherme Almeida",
            linkedin: "https://www.linkedin.com/in/gui1612/",
            instagram: "https://www.instagram.com/gui.1612/",
            github: "https://github.com/gui1612",
            website: "https://www.gui1612.com/",
            imagePath: "/gui.jpg",
        },
        {
            name: "Miguel Montes",
            github: "https://github.com/MiguelLPMM",
            imagePath: "/montes.jpg",
        },
    ];

    return (
        <>
            <main>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded ">
                    <div>
                        <h1 className="text-3xl font-bold mb-6 text-center">
                            About Us
                        </h1>
                        <div className="text-left text-lg text-gray-400">
                            <h2 className="text-2xl mb-6 font-bold">
                                About Us:
                            </h2>
                            <h2 className="text-1xl mb-1">
                                🚀 Our team is made of three Informatics
                                Engineering students from FEUP, passionate about
                                tech and innovation.
                            </h2>

                            <p className="mb-6">
                                In case you want to contact any of use, use the
                                social media links on the right side of the
                                page.
                            </p>
                            <h2 className="text-2xl mb-6 font-bold">
                                Introducing SuperBasket:
                            </h2>
                            <p className="text-gray-400 mb-6">
                                🛒 SuperBasket is our brainchild—a revolutionary
                                shopping list app blending local convenience
                                with cloud collaboration.
                            </p>

                            <h2 className="text-2xl mb-6 font-bold">
                                ✨ Key Features:
                            </h2>

                            <ul className="mb-6 list-disc">
                                <div className="ml-10">
                                    <li className="mb-1">
                                        📝 Create and personalize shopping lists
                                        on
                                        <b> any device</b>.
                                    </li>
                                    <li className="mb-1">
                                        📡 Access lists locally, even{" "}
                                        <b>without access to the internet</b>.
                                    </li>
                                    <li className="mb-1">
                                        🤝 Share a unique ID with friends for
                                        <b> real-time collaborative shopping</b>
                                        .
                                    </li>
                                    <li className="mb-1">
                                        🚩 Flag and set target quantities for
                                        items.
                                    </li>
                                    <li className="mb-1">
                                        🌐 Smart <b>cloud architecture</b> for{" "}
                                        <b>millions of users</b>.
                                    </li>
                                </div>
                            </ul>
                            <h2 className="text-2xl mb-6 font-bold">
                                👩‍💻 Tech Stack:
                            </h2>
                            <p className="text-gray-400 mb-6">
                                We are using a wide tech-stack with languages
                                ranging from <b>Java</b> on the database to{" "}
                                <b>Typescript</b> (and React) on the frontend
                                and on the synchronization server. This project
                                explores various concepts and technologies, such
                                as:
                                <ul className="mb-6 list-disc">
                                    <div className="ml-10 mt-6">
                                        <li className="mb-1">
                                            <b>Local-first</b> architecture.
                                        </li>
                                        <li className="mb-1">
                                            {" "}
                                            <b>
                                                Conflict-free Replicated Data
                                                Types
                                            </b>{" "}
                                            (CRDTs).
                                        </li>
                                        <li className="mb-1">
                                            <b>Real-time collaboration</b>.
                                        </li>
                                        <li className="mb-1">
                                            <b>Offline-first</b> support.
                                        </li>
                                        <li className="mb-1">
                                            <b>Cloud architecture</b>.
                                        </li>
                                        <li className="mb-1">
                                            Many many others...
                                        </li>
                                    </div>
                                </ul>

                            </p>

                            <h2 className="text-2xl mb-6 font-bold">
                                🌐 Join the SuperBasket Experience:
                            </h2>
                            <p className="text-gray-400 mb-6">
                                Elevate your shopping routine with SuperBasket.
                                Your local-first, cloud-collaborative shopping
                                companion. Bringing the world together, one
                                shopping list at a time. Ready to revolutionize
                                your shopping experience? Welcome to
                                SuperBasket! 🌟
                            </p>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold mb-4 text-center">
                            Developers
                        </h1>
                        <div className="flex flex-wrap justify-center">
                            {developers.map((developer, index) => (
                                <ParallaxGlare
                                    key={index}
                                    data={developer}
                                    border={true}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
