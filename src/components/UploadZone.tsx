import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X } from 'lucide-react';

export interface FileData {
  file: File;
  preview: string;
  base64: string;
}

interface UploadZoneProps {
  files: FileData[];
  onFilesChange: (files: FileData[]) => void;
  textInput: string;
  onTextInputChange: (text: string) => void;
}

export function UploadZone({
  files,
  onFilesChange,
  textInput,
  onTextInputChange,
}: UploadZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const filePromises = acceptedFiles.map((file) => {
        return new Promise<FileData | null>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64String = reader.result as string;
            // Extract just the base64 data to pass to Gemini
            const base64Data = base64String.split(',')[1];
            
            if (base64Data) {
              resolve({
                file,
                preview: URL.createObjectURL(file),
                base64: base64Data,
              });
            } else {
              resolve(null);
            }
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(filePromises).then((results) => {
        const validFiles = results.filter((f): f is FileData => f !== null);
        if (validFiles.length > 0) {
          onFilesChange([...files, ...validFiles]);
        }
      });
    },
    [files, onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
  } as any);

  const removeFile = (index: number) => {
    const newFiles = [...files];
    URL.revokeObjectURL(newFiles[index].preview);
    newFiles.splice(index, 1);
    onFilesChange(newFiles);
  };

  return (
    <div className="w-full space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 transition-all duration-200 hover:shadow-md">
        <label className="block text-sm font-semibold text-stone-700 mb-2">
          截图证明
        </label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-cheese-500 bg-cheese-50'
              : 'border-stone-300 hover:border-cheese-400 hover:bg-stone-50'
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="mx-auto h-12 w-12 text-stone-400 mb-3" />
          <p className="text-stone-600 font-medium">
            拖拽图片至此，或点击选择
          </p>
          <p className="text-stone-400 text-sm mt-1">
            支持 JPEG, PNG, WEBP 格式（可多选）
          </p>
        </div>

        {files.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
            {files.map((file, idx) => (
              <div key={idx} className="relative group rounded-lg overflow-hidden border border-stone-200">
                <img
                  src={file.preview}
                  alt="preview"
                  className="w-full h-24 object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(idx);
                  }}
                  className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 transition-all duration-200 hover:shadow-md">
        <label className="block text-sm font-semibold text-stone-700 mb-2">
          小作文（相关主张与背景）
        </label>
        <textarea
          value={textInput}
          onChange={(e) => onTextInputChange(e.target.value)}
          placeholder="在此粘贴相关文本、帖子内容或背景信息..."
          className="w-full min-h-[160px] p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-cheese-400 focus:border-cheese-400 outline-none resize-y transition-all"
        />
      </div>
    </div>
  );
}
