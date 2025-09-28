// src/pages/OrganizationManagement.tsx

import React from 'react';

// Assuming you have the Organization interface defined
interface FormData {
    code: string,
    name: string,
    description: string;
}
interface CreateOuProps {
    handleSubmit: (e: React.FormEvent) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    formData: FormData;
    loading: boolean
}
const OrganizationManagement = ({ handleSubmit, handleChange, formData, loading }: CreateOuProps) => {

    return (
        <div className="p-8 bg-gray-50 h-full">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Organization Management</h1>
            <div className="bg-white p-6 rounded-lg shadow-xl mb-10">
                <h2 className="text-xl font-semibold text-indigo-600 mb-4">Create Organization</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                            Code (Required, Unique)
                        </label>
                        <input
                            type="text"
                            name="code"
                            id="code"
                            value={formData.code}
                            onChange={handleChange}
                            required
                            maxLength={255}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name (Required)
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            maxLength={195}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description (Optional)
                        </label>
                        <textarea
                            name="description"
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            maxLength={255}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        {loading ?
                            <i className="fas fa-spinner fa-spin"></i>
                            :
                            <span>  Save Organization </span>
                        }

                    </button>
                </form>
            </div>
        </div>
    );
};

export default OrganizationManagement;