import { ImageUpload } from "../components/ImageUpload";
import { ImageGrid } from "../components/ImageGrid";

export default function ImagesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Image Management</h1>
      </div>

      <div className="space-y-8">
        <ImageUpload />
        <ImageGrid />
      </div>
    </div>
  );
} 