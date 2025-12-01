import React from "react";

export const FileUploader = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        onFileSelect(file);
      } else {
        alert("Por favor, sube solo imágenes (JPG, PNG, WEBP).");
      }
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files?.[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer 
        ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
        }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById("file-upload")?.click()}
    >
      <input
        id="file-upload"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileInput}
      />
      <div className="flex flex-col items-center gap-3">
        <div className="bg-blue-100 text-blue-600 p-3 rounded-full">📤</div>
        <div>
          <h3 className="font-semibold text-gray-700">
            Sube tu reporte médico
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Arrastra o haz clic para seleccionar una imagen.
          </p>
        </div>
        <div className="text-xs text-gray-400 mt-2">Soporta JPG, PNG, WEBP</div>
      </div>
      <div className="absolute bottom-2 left-0 w-full text-center">
        <p className="text-[10px] text-gray-400">
          La IA puede cometer errores. Verifica con tu médico.
        </p>
      </div>
    </div>
  );
};
