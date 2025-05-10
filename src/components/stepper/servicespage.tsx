"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Pencil, Trash2 } from "lucide-react";
import businessData from "@/datas/businessData.json";

const Services = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [services, setServices] = useState<{ name: string; price: string }[]>([
    { name: "", price: "" },
  ]);
  const [gallery, setGallery] = useState<string[]>([]);
  const [initialServices, setInitialServices] = useState<{ name: string; price: string }[]>([]);
  const [initialGallery, setInitialGallery] = useState<string[]>([]);

  useEffect(() => {
    const apiResponse = localStorage.getItem("apiResponse");
    const servicesFormData = localStorage.getItem("servicesFormData");

    let existingData: { services?: { name: string; price: string }[]; gallery?: string[] } | null = null;

    if (servicesFormData && servicesFormData !== "null") {
      try {
        const parsedFormData = JSON.parse(servicesFormData);
        const draftServices = parsedFormData.subcategories?.[0]?.businesses?.[0]?.services || [];
        const draftGallery = parsedFormData.subcategories?.[0]?.businesses?.[0]?.gallery || [];
        if (draftServices.length > 0 || draftGallery.length > 0) {
          existingData = {
            services: draftServices,
            gallery: draftGallery,
          };
        }
      } catch (e) {
        console.error("Error parsing draft data", e);
      }
    }

    if (!existingData && apiResponse) {
      try {
        const parsedApiResponse = JSON.parse(apiResponse);
        const publishedServices = parsedApiResponse?.services || [];
        const publishedGallery = parsedApiResponse?.gallery || [];
        if (publishedServices.length > 0 || publishedGallery.length > 0) {
          existingData = {
            services: publishedServices,
            gallery: publishedGallery,
          };
        }
      } catch (e) {
        console.error("Error parsing api response", e);
      }
    }

    if (existingData) {
      setServices(existingData.services || [{ name: "", price: "" }]);
      setGallery(existingData.gallery || []);
      setInitialServices(existingData.services || [{ name: "", price: "" }]);
      setInitialGallery(existingData.gallery || []);
      setHasExistingData(true);
      setIsEditing(false);
    } else {
      setServices(businessData.subcategories[0].businesses[0].services || [{ name: "", price: "" }]);
      setGallery(businessData.subcategories[0].businesses[0].gallery || []);
      setInitialServices(businessData.subcategories[0].businesses[0].services || [{ name: "", price: "" }]);
      setInitialGallery(businessData.subcategories[0].businesses[0].gallery || []);
      setIsEditing(true);
      setHasExistingData(false);
    }
  }, []);

  const handleServiceChange = (index: number, field: "name" | "price", value: string) => {
    const updatedServices = [...services];
    updatedServices[index][field] = value;
    setServices(updatedServices);
    localStorage.setItem("hasChanges", "true");
  };

  const addService = () => {
    setServices([...services, { name: "", price: "" }]);
    localStorage.setItem("hasChanges", "true");
  };

  const removeService = (index: number) => {
    if (services.length <= 1) return;
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
    localStorage.setItem("hasChanges", "true");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing) return;
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit.");
      return;
    }
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      alert("Only JPG and PNG files are supported.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setGallery([...gallery, reader.result as string]);
      localStorage.setItem("hasChanges", "true");
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index: number) => {
    if (!isEditing) return;
    const updatedGallery = gallery.filter((_, i) => i !== index);
    setGallery(updatedGallery);
    localStorage.setItem("hasChanges", "true");
  };

  const handleNext = () => {
    const dataToSave = {
      subcategories: [
        {
          businesses: [
            {
              services,
              gallery,
            },
          ],
        },
      ],
    };
    localStorage.setItem("servicesFormData", JSON.stringify(dataToSave));
    localStorage.setItem("hasChanges", "true");
    router.push("/review&publish");
  };

  const toggleEdit = () => {
    if (isEditing) {
      setServices(initialServices);
      setGallery(initialGallery);
      const dataToSave = {
        subcategories: [
          {
            businesses: [
              {
                services: initialServices,
                gallery: initialGallery,
              },
            ],
          },
        ],
      };
      localStorage.setItem("servicesFormData", JSON.stringify(dataToSave));
    } else {
      localStorage.setItem("isEditModeActive", "true");
      localStorage.setItem("hasChanges", "true");
      console.log("Edit mode enabled via Services pencil");
    }
    setIsEditing(!isEditing);
  };

  const isReadOnly = hasExistingData && !isEditing;

  return (
    <main className="max-w-4xl mx-auto p-5">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Services & Gallery</h2>
          {isReadOnly && (
            <button
              onClick={toggleEdit}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              aria-label="Edit Services and Gallery"
            >
              <Pencil className="w-5 h-5" />
            </button>
          )}
        </div>

        {isReadOnly ? (
          <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-md">
            Viewing saved services and gallery.
          </div>
        ) : (
          <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-md">
            {hasExistingData ? "Editing services and gallery." : "Please enter your services and upload images."}
          </div>
        )}

        <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Service Details</h3>
          {services.map((service, index) => (
            <div key={index} className="flex flex-wrap gap-4 mb-4 items-center">
              <div className="flex-1 min-w-[200px]">
                <label
                  htmlFor={`service-name-${index}`}
                  className="block mb-2 font-medium text-gray-700 dark:text-gray-200"
                >
                  Service Name:
                </label>
                <input
                  id={`service-name-${index}`}
                  type="text"
                  value={service.name}
                  onChange={(e) => handleServiceChange(index, "name", e.target.value)}
                  readOnly={isReadOnly}
                  className={`w-full p-2 ${
                    isReadOnly
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                      : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                  } rounded-md focus:ring-2 focus:ring-gray-500`}
                  placeholder="Enter service name"
                />
              </div>

              <div className="flex-1 min-w-[150px]">
                <label
                  htmlFor={`service-price-${index}`}
                  className="block mb-2 font-medium text-gray-700 dark:text-gray-200"
                >
                  Price:
                </label>
                <input
                  id={`service-price-${index}`}
                  type="text"
                  value={service.price}
                  onChange={(e) => handleServiceChange(index, "price", e.target.value)}
                  readOnly={isReadOnly}
                  className={`w-full p-2 ${
                    isReadOnly
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                      : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                  } rounded-md focus:ring-2 focus:ring-gray-500`}
                  placeholder="Enter price"
                />
              </div>
              {!isReadOnly && services.length > 1 && (
                <button
                  onClick={() => removeService(index)}
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 mt-6"
                  aria-label={`Remove service ${index + 1}`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          {!isReadOnly && (
            <Button
              className="mt-4 bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 focus:ring-2 focus:ring-green-500"
              onClick={addService}
            >
              Add Service
            </Button>
          )}
        </div>

        <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Gallery</h3>
          <div className="mb-4">
            {gallery.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {gallery.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md border border-gray-200 dark:border-gray-600"
                    />
                    {!isReadOnly && (
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 dark:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition focus:ring-2 focus:ring-red-500"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 mb-4">No images uploaded yet</p>
            )}
            {!isReadOnly && (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 text-center">
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer block"
                  aria-label="Upload image to gallery"
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-400 dark:text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      Drag and drop images here, or click to browse
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Supports JPG, PNG up to 5MB</p>
                  </div>
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
          <Button
            className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-gray-500"
            onClick={() => router.push("/contact&timings")}
          >
            Back
          </Button>
          {isEditing && hasExistingData && (
            <Button
              className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-gray-500"
              onClick={toggleEdit}
            >
              Cancel
            </Button>
          )}
          <Button
            className="w-full sm:w-auto focus:ring-2 focus:ring-blue-500 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            color="primary"
            onClick={handleNext}
            disabled={services.some((s) => !s.name.trim())}
          >
            {isReadOnly ? "Next" : "Save & Next"}
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Services;