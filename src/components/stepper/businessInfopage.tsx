"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@heroui/button";
import { Pencil } from "lucide-react";
import businessData from "@/datas/businessData.json";

// Define Zod schema for form validation
const businessSchema = z.object({
  businessName: z.string().min(1, "Business name is required").max(100, "Business name must be 100 characters or less"),
  description: z.string().min(1, "Description is required").max(500, "Description must be 500 characters or less"),
});

// Type for form data inferred from Zod schema
type BusinessFormData = z.infer<typeof businessSchema>;

export default function BusinessInformation() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [initialData, setInitialData] = useState<BusinessFormData>({
    businessName: "",
    description: "",
  });

  // Initialize react-hook-form with Zod resolver
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      businessName: "",
      description: "",
    },
  });

  useEffect(() => {
    const businessFormData = localStorage.getItem("businessFormData");
    const apiResponse = localStorage.getItem("apiResponse");

    let existingData: BusinessFormData | null = null;

    if (businessFormData && businessFormData !== "null") {
      try {
        const parsedData = JSON.parse(businessFormData);
        existingData = {
          businessName: parsedData.subcategories?.[0]?.businesses?.[0]?.businessName || "",
          description: parsedData.subcategories?.[0]?.businesses?.[0]?.description || "",
        };
      } catch (e) {
        console.error("Error parsing draft data", e);
      }
    }

    if (!existingData && apiResponse) {
      try {
        const parsedApiResponse = JSON.parse(apiResponse);
        if (parsedApiResponse?.business?.businessName) {
          existingData = {
            businessName: parsedApiResponse.business.businessName,
            description: parsedApiResponse.business.description || "",
          };
        }
      } catch (e) {
        console.error("Error parsing api response", e);
      }
    }

    if (existingData) {
      setValue("businessName", existingData.businessName, { shouldValidate: true });
      setValue("description", existingData.description, { shouldValidate: true });
      setInitialData(existingData);
      setHasExistingData(true);
      setIsEditing(false);
    } else {
      const defaultData = {
        businessName: businessData.subcategories[0].businesses[0].businessName,
        description: businessData.subcategories[0].businesses[0].description,
      };
      setValue("businessName", defaultData.businessName, { shouldValidate: true });
      setValue("description", defaultData.description, { shouldValidate: true });
      setIsEditing(true);
      setHasExistingData(false);
    }
  }, [setValue]);

  const onSubmit = (data: BusinessFormData) => {
    try {
      const dataToSave = {
        subcategories: [
          {
            businesses: [
              {
                businessName: data.businessName,
                description: data.description,
              },
            ],
          },
        ],
      };
      localStorage.setItem("businessFormData", JSON.stringify(dataToSave));
      localStorage.setItem("hasChanges", "true");
      router.push("/location");
    } catch (e) {
      console.error("Error saving form data:", e);
      alert("Failed to save business information. Please try again.");
    }
  };

  const handleNextInReadOnly = () => {
    // In read-only mode, navigate to /location without saving if no changes
    router.push("/location");
  };

  const toggleEdit = () => {
    if (isEditing) {
      setValue("businessName", initialData.businessName, { shouldValidate: true });
      setValue("description", initialData.description, { shouldValidate: true });
    } else {
      localStorage.setItem("isEditModeActive", "true");
      localStorage.setItem("hasChanges", "true");
      console.log("Edit mode enabled via BusinessInformation pencil");
    }
    setIsEditing(!isEditing);
  };

  const isReadOnly = hasExistingData && !isEditing;

  return (
    <main className="max-w-4xl mx-auto p-5">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Business Information</h2>
          {isReadOnly && (
            <button
              onClick={toggleEdit}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              aria-label="Edit Business Information"
            >
              <Pencil className="w-5 h-5" />
            </button>
          )}
        </div>

        {isReadOnly ? (
          <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md">
            Viewing saved business information.
          </div>
        ) : (
          <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-md">
            {hasExistingData ? "Editing business information." : "Please enter your business information."}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Basic Information</h3>

          <div className="mb-4">
            <label htmlFor="businessName" className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              Business Name:
            </label>
            <input
              id="businessName"
              {...register("businessName")}
              readOnly={isReadOnly}
              className={`w-full p-2 rounded-md focus:ring-2 focus:ring-blue-500 ${
                isReadOnly
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                  : errors.businessName
                  ? "border border-red-500"
                  : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              }`}
              placeholder="Enter your business name"
            />
            {errors.businessName && (
              <p className="mt-1 text-sm text-red-500">{errors.businessName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              Description:
            </label>
            <textarea
              id="description"
              {...register("description")}
              readOnly={isReadOnly}
              className={`w-full p-2 rounded-md h-24 focus:ring-2 focus:ring-blue-500 ${
                isReadOnly
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                  : errors.description
                  ? "border border-red-500"
                  : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              }`}
              placeholder="Describe your business"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>
        </form>

        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
          <Button
            className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
            onClick={() => router.push("/welcome")}
          >
            Back
          </Button>

          {isEditing && hasExistingData && (
            <Button
              className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
              onClick={toggleEdit}
            >
              Cancel
            </Button>
          )}

          <Button
            className="w-full sm:w-auto focus:ring-2 focus:ring-blue-500 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            color="primary"
            onClick={isReadOnly ? handleNextInReadOnly : handleSubmit(onSubmit)}
            disabled={!isReadOnly && !isValid}
          >
            {isReadOnly ? "Next" : "Save & Next"}
          </Button>
        </div>
      </div>
    </main>
  );
}