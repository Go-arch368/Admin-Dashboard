
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Pencil } from "lucide-react";

interface Service {
  name: string;
  price: string;
}

interface FormData {
  subcategories?: {
    businesses?: {
      services?: Service[];
    }[];
  }[];
}

export default function ServicesPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({ subcategories: [{ businesses: [{ services: [] }] }] });
  const [isPublished, setIsPublished] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);

  useEffect(() => {
    const storedFormData = localStorage.getItem("servicesFormData");
    if (storedFormData) {
      setFormData(JSON.parse(storedFormData));
    }
    const publishFormData = localStorage.getItem("publishFormData");
    if (publishFormData) {
      setIsPublished(JSON.parse(publishFormData).published);
      setIsEditMode(!JSON.parse(publishFormData).published);
    }
  }, []);

  const handleEdit = () => {
    setIsEditMode(true);
    localStorage.setItem("isEditModeActive", "true");
    localStorage.setItem("hasChanges", "true");
  };

  const handleServiceChange = (index: number, field: keyof Service, value: string) => {
    if (!isEditMode) return;
    const newData = JSON.parse(JSON.stringify(formData)) as FormData;
    const serviceList = newData.subcategories?.[0]?.businesses?.[0]?.services || [];
    serviceList[index][field] = value;
    setFormData(newData);
    localStorage.setItem("servicesFormData", JSON.stringify(newData));
    localStorage.setItem("hasChanges", "true");
  };

  const addService = () => {
    if (!isEditMode) return;
    const newData = JSON.parse(JSON.stringify(formData)) as FormData;
    const serviceList = newData.subcategories?.[0]?.businesses?.[0]?.services || [];
    serviceList.push({ name: "", price: "" });
    setFormData(newData);
    localStorage.setItem("servicesFormData", JSON.stringify(newData));
    localStorage.setItem("hasChanges", "true");
  };

  const removeService = (index: number) => {
    if (!isEditMode) return;
    const newData = JSON.parse(JSON.stringify(formData)) as FormData;
    const serviceList = newData.subcategories?.[0]?.businesses?.[0]?.services || [];
    serviceList.splice(index, 1);
    setFormData(newData);
    localStorage.setItem("servicesFormData", JSON.stringify(newData));
    localStorage.setItem("hasChanges", "true");
  };

  const handleNext = () => {
    router.push("/review&publish");
  };

  const handleBack = () => {
    router.push("/contact&timings");
  };

  const services = formData.subcategories?.[0]?.businesses?.[0]?.services || [];

  return (
    <div className="max-w-4xl mx-auto p-5">
      <div className="bg-gray-50 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Services</h2>
          {isPublished && !isEditMode && (
            <button
              onClick={handleEdit}
              className="text-blue-600 hover:text-blue-800"
              aria-label="Edit Services"
            >
              <Pencil className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Service Details</h3>
          {isPublished && !isEditMode ? (
            <div className="space-y-6">
              {services.map((service, _index) => (
                <div key={_index} className="border border-gray-200 rounded-md p-4">
                  <div className="mb-4">
                    <span className="block mb-1 font-medium text-gray-700">Service Name:</span>
                    <div className="p-2 bg-gray-100 rounded-md">
                      {service.name || "Not specified"}
                    </div>
                  </div>
                  <div>
                    <span className="block mb-1 font-medium text-gray-700">Price:</span>
                    <div className="p-2 bg-gray-100 rounded-md">
                      {service.price || "Not specified"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {services.map((service, _index) => (
                <div key={_index} className="border border-gray-200 rounded-md p-4">
                  <div className="mb-4">
                    <label htmlFor={`service-name-${_index}`} className="block mb-2 font-medium text-gray-700">
                      Service Name:
                    </label>
                    <input
                      type="text"
                      id={`service-name-${_index}`}
                      value={service.name}
                      onChange={(e) => handleServiceChange(_index, "name", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                      readOnly={!isEditMode}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor={`service-price-${_index}`} className="block mb-2 font-medium text-gray-700">
                      Price:
                    </label>
                    <input
                      type="text"
                      id={`service-price-${_index}`}
                      value={service.price}
                      onChange={(e) => handleServiceChange(_index, "price", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                      readOnly={!isEditMode}
                    />
                  </div>
                  {isEditMode && services.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeService(_index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                      aria-label={`Remove service ${_index + 1}`}
                    >
                      Remove Service
                    </button>
                  )}
                </div>
              ))}
              {isEditMode && (
                <button
                  type="button"
                  onClick={addService}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                  aria-label="Add new service"
                >
                  + Add Service
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <Button
            className="w-full sm:w-auto border border-gray-300 bg-white text-gray-700"
            onClick={handleBack}
            type="button"
          >
            Back
          </Button>
          <Button
            className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleNext}
            type="button"
            disabled={services.length === 0}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
