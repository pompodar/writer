import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, Head } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />
            <div className="py-4 flex">
                <div className="py-2">
                    {auth.user.admin == 1 && (
                        <div>
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                            <div className="p-6 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <Link
                                    href={route('users')}
                                    className="text-gray-900 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                >
                                    Users
                                </Link>
                            </div>
                        </div>
                    
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                            <div className="p-6 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <Link
                                    href={route('users')}
                                    className="text-gray-900 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                >
                                    Users
                                </Link>
                            </div>
                        </div>
                    </div>
                    )
                }    
                </div>

                <div className="py-2">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">You're logged in!</div>
                        </div>
                    </div>
                </div>
            </div>    
        </AuthenticatedLayout>
    );
}
