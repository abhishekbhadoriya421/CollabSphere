import React from "react";

interface FormData {
    code: string,
    name: string,
    description: string;
}
interface UpdateOuProps {
    handleSubmit: (e: React.FormEvent) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    formData: FormData;
    loading: boolean;
    handleUpdateOuForm: () => void
}

const UpdateOrganizationModal: React.FC<UpdateOuProps> = ({ handleSubmit, handleChange, formData, loading, handleUpdateOuForm }) => {

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Update Organization</h2>
                    <button
                        onClick={handleUpdateOuForm}
                        className="text-gray-500 hover:text-gray-800 text-2xl"
                    >
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="hidden"
                            name="name"
                            id="name"
                            value={formData.code}
                            maxLength={195}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description (Optional)
                        </label>
                        <textarea
                            name="description"
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            maxLength={255}
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleUpdateOuForm}
                            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                            {loading === true ?
                                <i className="fas fa-spinner fa-spin"></i>
                                :
                                <span> Update</span>
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateOrganizationModal;
