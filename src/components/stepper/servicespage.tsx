
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Pencil } from "lucide-react";

interface Service {
  name: string;
  price: string;
}

interface Business {
  services: Service[];
}

interface FormData {
  subcategories?: { businesses?: Business[] }[];
}

const FORM_DATA_KEY = "servicesFormData";
const PUBLISH_FORM_DATA_KEY = "publishFormData";
const EDIT_MODE_KEY = "isEditModeActive";
const HAS_CHANGES_KEY = "hasChanges";

const Services = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized || typeof window === "undefined") return;

    const publishFormData = localStorage.getItem(PUBLISH_FORM_DATA_KEY);
    const isPublishedLocal = publishFormData ? JSON.parse(publishFormData).published : false;
    const editMode = localStorage.getItem(EDIT_MODE_KEY) === "true";
    setIsEditMode(editMode || !isPublishedLocal);
    setIsPublished(isPublishedLocal);

    const savedFormData = localStorage.getItem(FORM_DATA_KEY);
    if (savedFormData && savedFormData !== "null") {
      try {
        setFormData(JSON.parse(savedFormData));
      } catch (err) {
        console.error("Error parsing savedFormData:", err);
      }
    } else {
      setFormData({
        subcategories: [
          {
            businesses: [
              {
                services: [],
              },
            ],
          },
        ],
      });
    }
    setInitialized(true);
  }, [initialized]);

  const addService = () => {
    if (!formData || !isEditMode) return;
    const newData = JSON.parse(JSON.stringify(formData));
    newData.subcategories[0].businesses[0].services.push({ name: "", price: "" });
    setFormData(newData);
    localStorage.setItem(FORM_DATA_KEY, JSON.stringify(newData));
    localStorage.setItem(HAS_CHANGES_KEY, "true");
  };

  const removeService = (index: number) => {
    if (!formData || !isEditMode) return;
    const newData = JSON.parse(JSON.stringify(formData));
    newData.subcategories[0].businesses[0].services.splice(index, 1);
    setFormData(newData);
    localStorage.setItem(FORM_DATA_KEY, JSON.stringify(newData));
    localStorage.setItem(HAS_CHANGES_KEY, "true");
  };

  const updateService = (index: number, field: keyof Service, value: string) => {
    if (!formData || !isEditMode) return;
    const newData = JSON.parse(JSON.stringify(formData));
    newData.subcategories[0].businesses[0].services[index][field] = value;
    setFormData(newData);
    localStorage.setItem(FORM_DATA_KEY, JSON.stringify(newData));
    localStorage.setItem(HAS_CHANGES_KEY, "true");
  };

  const handleEdit = () => {
    setIsEditMode(true);
    localStorage.setItem(EDIT_MODE_KEY, "true");
    localStorage.setItem(HAS_CHANGES_KEY, "true");
    localStorage.setItem(PUBLISH_FORM_DATA_KEY, JSON.stringify({ published: false }));
  };

  if (!formData) return <div>Loading...</div>;

  const currentBusiness = formData.subcategories?.[0]?.businesses?.[0] || { services: [] };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <form className="bg-gray-50 rounded-lg shadow-sm p-6 relative">
        {!isEditMode && isPublished && (
          <button
            type="button"
            onClick={handleEdit}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:ring-2 focus:ring-gray-500 p-2 rounded-full"
            aria-label="Edit services"
          >
            <Pencil className="h-5 w-5" />
          </button>
        )}
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Services</h2>

        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Business Services</h3>
          <div className="mb-4">
            {currentBusiness.services.map((service: Service, index: number) => (
              <div key={index} className="mb-4 p-3 border border-gray-200 rounded-md bg-white">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label htmlFor={`service-name-${index}`} className="block mb-2 font-medium text-gray-700">
                      Service Name:
                    </label>
                    <input
                      type="text"
                      id={`service-name-${index}`}
                      placeholder="Enter service name"
                      value={service.name}
                      onChange={(e) => updateService(index, "name", e.target.value)}
                      className={`w-full p-2 border border-gray-300 rounded-md text-sm ${
                        isEditMode ? "focus:ring-2 focus:ring-gray-500" : "bg-gray-100"
                      }`}
                      readOnly={!isEditMode}
                    />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <label htmlFor={`service-price-${index}`} className="block mb-2 font-medium text-gray-700">
                      Price:
                    </label>
                    <input
                      type="text"
                      id={`service-price-${index}`}
                      placeholder="Enter price"
                      value={service.price}
                      onChange={(e) => updateService(index, "price", e.target.value)}
                      className={`w-full p-2 border border-gray-300 rounded-md text-sm ${
                        isEditMode ? "focus:ring-2 focus:ring-gray-500" : "bg-gray-100"
                      }`}
                      readOnly={!isEditMode}
                    />
                  </div>
                </div>
                {isEditMode && currentBusiness.services.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeService(index)}
                    className="mt-2 text-sm text-red-600 hover:text-red-800 focus:ring-2 focus:ring-red-500"
                    aria-label={`Remove service ${index + 1}`}
                  >
                    Remove Service
                  </button>
                )}
              </div>
            ))}
          </div>
          {isEditMode && (
            <button
              type="button"
              onClick={addService}
              className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 focus:ring-2 focus:ring-green-600"
              aria-label="Add new service"
            >
              + Add Service
            </button>
          )}
        </div>

        <div className="flex justify-between gap-3">
          <Button
            className="w-full sm:w-auto border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-gray-500"
            onClick={() => router.push("/contact&timings")}
            type="button"
          >
            Back
          </Button>
          <Button
            className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            onClick={() => router.push("/review&publish")}
            type="button"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Services;
