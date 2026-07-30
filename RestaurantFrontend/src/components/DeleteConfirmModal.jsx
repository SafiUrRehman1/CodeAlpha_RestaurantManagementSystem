import { Trash2, X } from "lucide-react";

export default function DeleteConfirmModal({
  isOpen,
  title = "Delete Item",
  message = "Are you sure?",
  onCancel,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

        <div className="flex justify-center mb-5">

          <div className="bg-red-100 p-4 rounded-full">
            <Trash2 className="text-red-600" size={34}/>
          </div>

        </div>

        <h2 className="text-2xl font-bold text-center">
          {title}
        </h2>

        <p className="text-gray-500 text-center mt-3">
          {message}
        </p>

        <div className="flex justify-end gap-4 mt-8">

          <button
            onClick={onCancel}
            className="flex items-center gap-2 border px-6 py-3 rounded-xl hover:bg-gray-100"
          >
            <X size={18}/>
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl"
          >
            <Trash2 size={18}/>
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}