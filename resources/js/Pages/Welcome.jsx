import { Link, Head } from '@inertiajs/react';
import { useRef, useEffect, useState } from "react";
import Pusher from "pusher-js";
import Axios from 'axios'; // Import Axios for making API requests
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Welcome({ auth }) {
    const [username, setUsername] = useState("");
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    let allMessages = [];

    const messagesContainerRef = useRef(null);


    useEffect(() => {
        Pusher.logToConsole = false;

        const pusher = new Pusher('0f506785a06a7ecd81c2', {
            cluster: 'eu'
        });

        const channel = pusher.subscribe('chat');
        channel.bind('message', function (data) {
            setMessages(prevMessages => [...prevMessages, data]);
            // Scroll to the bottom after updating the messages
            // if (messagesContainerRef.current) {
            //     messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
            // }
        });

        Axios.get("/api/users/")
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
        
        Axios.get("/api/get-messages/")
            .then((response) => {
                setMessages(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
        
        // Scroll to the bottom after updating the messages
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, []);

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages])

    function selectUser(userId) {
        users.map((user) => {
            if (user.id === userId) {
                setUsername({
                    name: user.name,
                    id: user.id
                });
            }

            if (messagesContainerRef.current) {
                setTimeout(() => {
                    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
                }, 1000);
            }
        })
    }

    const submit = async e => {
        e.preventDefault();

        let user = username.id;
        let text = message.text;

        await Axios.post('/api/messages', {
            username: user,
            message: text,
            sender: auth.user.id
        });

        setMessage({ text: "", username: "" });
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }

    return (
            <AuthenticatedLayout
                user={auth.user}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Laract</h2>}
            >
            <Head title="Welcome" />
            <div className="relative sm:flex bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:text-white">
                <div className="fixed top-0 right-8 sm:right-0 p-6 text-right">
                    {auth.user ? (
                        <div>
                            <button type="button" className="hs-collapse-toggle fixed top-16 right-6 w-14 scale-100 font-semibold text-gray-600 hover:text-gray-900 py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md font-semibold bg-grey-500 hover:bg-grey-600 transition-all" id="hs-basic-collapse" data-hs-collapse="#hs-basic-collapse-heading">
                                <svg className="h-10" xmlns="http://www.w3.org/2000/svg" xmlns: xlink="http://www.w3.org/1999/xlink" fill="#000000" height="800px" width="800px" version="1.1" id="Layer_1" viewBox="0 0 459.579 459.579" xml: space="preserve">
                                    <g>
                                        <g>
                                            <g>
                                                <path d="M429.579,14.7H139.935c-16.569,0-30,13.431-30,30v80.993h30V44.7h289.644v183.393h-48.495v30h48.495     c16.568,0,30-13.431,30-30V44.7C459.579,28.132,446.148,14.7,429.579,14.7z" />
                                                <path d="M319.644,155.693H30c-16.565,0-30,13.427-30,30v183.393c0,16.569,13.431,30,30,30h92.333l29.531,35.11     c11.99,14.255,33.945,14.234,45.917,0l29.531-35.11h92.333c9.32,0,17.647-4.25,23.149-10.917c0.306-0.37,0.603-0.748,0.891-1.133     c3.743-5.005,5.96-11.219,5.96-17.95V185.693C349.644,169.126,336.214,155.693,319.644,155.693z M319.644,369.086h-106.3     l-38.522,45.799L136.3,369.086H30V185.693h289.644V369.086z" />
                                                <path d="M80.011,257.792h189.621c8.284,0,15-6.716,15-15s-6.716-15-15-15H80.011c-8.284,0-15,6.716-15,15     S71.727,257.792,80.011,257.792z" />
                                                <path d="M80.011,325.573h77.621c8.284,0,15-6.716,15-15s-6.716-15-15-15H80.011c-8.284,0-15,6.716-15,15     S71.727,325.573,80.011,325.573z" />
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </button>
                            <div id="hs-basic-collapse-heading" className="hs-collapse fixed top-40 right-10 w-50 hidden overflow-hidden transition-[height] duration-300" aria-labelledby="hs-basic-collapse">
                                <div className="">
                                    <div className="max-w-7xl">
                                        <div className="">
                                            <div className="grid grid-cols-1 gap-6 lg:gap-8">
                                                <div className="scale-100 p-6 bg-white dark:bg-gray-800/50 dark:bg-gradient-to-bl from-gray-700/50 via-transparent dark:ring-1 dark:ring-inset dark:ring-white/5 rounded-lg shadow-2xl shadow-gray-500/20 dark:shadow-none flex motion-safe:hover:scale-[1.01] transition-all duration-250 focus:outline focus:outline-2">
                                                    <div className="flex gap-6">
                                                        <div className="flex">
                                                            <div
                                                                className="">
                                                                {users.length > 0 &&
                                                                    users.map((user) => {
                                                                        const isBold = user.id === username.id;
                                                                        if (user.id !== auth.user.id) {
                                                                            return <p
                                                                                className={`cursor-pointer text-left ${isBold ? 'font-bold' : ''}`}
                                                                                onClick={() => selectUser(user.id)}
                                                                            >
                                                                                {user.name}
                                                                            </p>
                                                                        } else {
                                                                            return null;
                                                                        }
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="overflow-scroll max-h-60" ref={messagesContainerRef}>
                                                                {messages.map(text => {
                                                                    const isNotBold = (text.sender == auth.user.id) || (text.user_id == auth.user.id);
                                                                    console.log("text.user_id: ", text.user_id, "text.receiver_id: ", text.receiver_id, "text.username: ", text.username, "text.sender: ", text.sender);
                                                                    if ((text.user_id == username.id || text.receiver_id == username.id || ((text.username == username.id) && text.username && username.id) || ((text.sender == username.id) && text.sender && username.id))) {
                                                                        return (
                                                                            <div className="">
                                                                                <div className={`${isNotBold ? '' : 'font-bold'}`}>{text.message}</div>
                                                                            </div>
                                                                        )
                                                                    } else {
                                                                        return null;
                                                                    }

                                                                })}
                                                            </div>
                                                            {username && (
                                                                <form onSubmit={e => submit(e)}>
                                                                    <input className="focus:shadow-none f-s-12 border-x-0 border-t-0 outline-0" placeholder="Write a message" value={message.text}
                                                                        onChange={e => setMessage({ text: e.target.value, user: username.id, from: auth.user.id })}
                                                                    />
                                                                </form>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm"
                            >
                                Log in
                            </Link>

                            <Link
                                href={route('register')}
                                className="ml-4 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm"
                            >
                                Register
                                    </Link>
                        </>
                    )}
                    </div>
                    
            </div>
            <style>{`
                .bg-dots-darker {
                    background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(0,0,0,0.07)'/%3E%3C/svg%3E");
                }
                @media (prefers-color-scheme: dark) {
                    .dark\\:bg-dots-lighter {
                        background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(255,255,255,0.07)'/%3E%3C/svg%3E");
                    }
                }
            `}</style>
                </AuthenticatedLayout>

    );
}
