import toast from "react-hot-toast";

const fileTypeIcons = {
    "image/jpeg": "bi:file-earmark-image",
    "image/png": "bi:file-earmark-image",
    "application/pdf": "bi:file-earmark-pdf",
    "application/msword": "bi:file-earmark-word",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "bi:file-earmark-word",
    "application/vnd.ms-excel": "bi:file-earmark-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "bi:file-earmark-excel",
};


export const handleAttachmentChange = (
    e,
    setData,
    setAttachmentPreview,
    allowedTypes,
    maxSize = 2 * 1024 * 1024
) => {
    const file = e.target.files[0];

    if (file) {
        if (!allowedTypes.includes(file.type)) {
            setAttachmentPreview(null);
            setData((prev) => ({ ...prev, attachment: null }));
            toast.error(`Invalid file type. Allowed: ${allowedTypes.join(", ")}`);
            return;
        }

        if (file.size > maxSize) {
            setAttachmentPreview(null);
            setData((prev) => ({ ...prev, attachment: null }));
            toast.error(`File size must be less than ${maxSize / (1024 * 1024)}MB.`);
            return;
        }

        setData((prev) => ({ ...prev, attachment: file }));

        if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAttachmentPreview({ type: "image", url: reader.result });
            };
            reader.readAsDataURL(file);
        } else {
            setAttachmentPreview({
                type: "file",
                name: file.name,
                icon: fileTypeIcons[file.type] || "bi:file-earmark",
            });
        }
    } else {
        setAttachmentPreview(null);
        setData((prev) => ({ ...prev, attachment: null }));
    }
};