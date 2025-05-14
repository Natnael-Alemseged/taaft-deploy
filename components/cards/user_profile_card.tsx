import { useState } from "react";

const UserProfileCard = ({ user, bio, onImageUpload }: { user: any; bio?: string; onImageUpload: (file: File) => void }) => {
    const [previewImage, setPreviewImage] = useState<string | null>(user?.profile_image || null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
            onImageUpload(file);
        }
    };

    return (
        <div className="w-full md:w-1/4 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex flex-col items-center">
                    <div className="relative h-16 w-16 bg-[#f3e8ff] text-[#7c3aed] rounded-full flex items-center justify-center text-xl font-medium mb-4 overflow-hidden">
                        {previewImage ? (
                            <img
                                src={previewImage}
                                alt="User profile_image"
                                className="h-full w-full object-cover rounded-full"
                            />
                        ) : (
                            <span>{user?.full_name?.[0]?.toUpperCase() || "U"}</span>
                        )}
                        <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer transition-opacity">
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleImageUpload}
                                accept="image/*"
                            />
                            <span className="text-white text-xs">Upload</span>
                        </label>
                    </div>
                    <h2 className="text-lg font-semibold">{user?.full_name || "Full Name"}</h2>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <p className="mt-2 text-sm text-gray-500 text-center">{bio || ""}</p>
                </div>
            </div>
        </div>
    );
};

export default UserProfileCard;
