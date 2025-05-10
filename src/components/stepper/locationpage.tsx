"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@heroui/button";
import { Pencil } from "lucide-react";
import businessData from "@/datas/businessData.json";


const locationSchema = z.object({
  address: z.string().min(1, "Address is required").max(200, "Address must be 200 characters or less"),
  city: z.string().min(1, "City is required").max(100, "City must be 100 characters or less"),
  state: z.string().min(1, "State is required").max(100, "State must be 100 characters or less"),
  postalCode: z
    .string()
    .min(1, "Postal code is required")
    .regex(/^\d{5,10}$/, "Postal code must be 5-10 digits")
    .max(10, "Postal code must be 10 characters or less"),
});


type LocationFormData = z.infer<typeof locationSchema>;

export default function Location() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [initialData, setInitialData] = useState<LocationFormData>({
    address: "",
    city: "",
    state: "",
    postalCode: "",
  });

  // Initialize react-hook-form with Zod resolver
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      address: "",
      city: "",
      state: "",
      postalCode: "",
    },
  });

  useEffect(() => {
    const apiResponse = localStorage.getItem("apiResponse");
    const locationFormData = localStorage.getItem("locationFormData");

    let existingData: LocationFormData | null = null;

    if (locationFormData && locationFormData !== "null") {
      try {
        const parsedFormData = JSON.parse(locationFormData);
        const draftLocation = parsedFormData.subcategories?.[0]?.businesses?.[0]?.location || {};
        existingData = {
          address: draftLocation.address || "",
          city: draftLocation.city || "",
          state: draftLocation.state || "",
          postalCode: draftLocation.postalCode || "",
        };
      } catch (e) {
        console.error("Error parsing draft data", e);
      }
    }

    if (!existingData && apiResponse && apiResponse !== "{}" && apiResponse !== '""') {
      try {
        const parsedApiResponse = JSON.parse(apiResponse);
        if (parsedApiResponse.publish === true) {
          const locationData =
            parsedApiResponse?.location?.subcategories?.[0]?.businesses?.[0]?.location ||
            parsedApiResponse?.location ||
            {};
          if (locationData.address && locationData.city) {
            existingData = {
              address: locationData.address || "",
              city: locationData.city || "",
              state: locationData.state || "",
              postalCode: locationData.postalCode || "",
            };
          }
        }
      } catch (e) {
        console.error("Error parsing api response", e);
      }
    }

    if (existingData) {
      setValue("address", existingData.address, { shouldValidate: true });
      setValue("city", existingData.city, { shouldValidate: true });
      setValue("state", existingData.state, { shouldValidate: true });
      setValue("postalCode", existingData.postalCode, { shouldValidate: true });
      setInitialData(existingData);
      setHasExistingData(true);
      setIsEditing(false);
    } else {
      const defaultData = {
        address: businessData.subcategories[0].businesses[0].location.address,
        city: businessData.subcategories[0].businesses[0].location.city,
        state: businessData.subcategories[0].businesses[0].location.state,
        postalCode: businessData.subcategories[0].businesses[0].location.postalCode,
      };
      setValue("address", defaultData.address, { shouldValidate: true });
      setValue("city", defaultData.city, { shouldValidate: true });
      setValue("state", defaultData.state, { shouldValidate: true });
      setValue("postalCode", defaultData.postalCode, { shouldValidate: true });
      setIsEditing(true);
      setHasExistingData(false);
    }
  }, [setValue]);

  const onSubmit = (data: LocationFormData) => {
    try {
      const dataToSave = {
        subcategories: [
          {
            businesses: [
              {
                location: data,
              },
            ],
          },
        ],
      };
      localStorage.setItem("locationFormData", JSON.stringify(dataToSave));
      localStorage.setItem("hasChanges", "true");
      router.push("/contact&timings");
    } catch (e) {
      console.error("Error saving form data:", e);
      alert("Failed to save location information. Please try again.");
    }
  };

  const handleNextInReadOnly = () => {
    // In read-only mode, navigate to /contact&timings without saving
    router.push("/contact&timings");
  };

  const toggleEdit = () => {
    if (isEditing) {
      setValue("address", initialData.address, { shouldValidate: true });
      setValue("city", initialData.city, { shouldValidate: true });
      setValue("state", initialData.state, { shouldValidate: true });
      setValue("postalCode", initialData.postalCode, { shouldValidate: true });
    } else {
      localStorage.setItem("isEditModeActive", "true");
      localStorage.setItem("hasChanges", "true");
      console.log("Edit mode enabled via Location pencil");
    }
    setIsEditing(!isEditing);
  };

  const isReadOnly = hasExistingData && !isEditing;

  return (
    <main className="max-w-4xl mx-auto p-5">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Business Location</h2>
          {isReadOnly && (
            <button
              onClick={toggleEdit}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              aria-label="Edit Location"
            >
              <Pencil className="w-5 h-5" />
            </button>
          )}
        </div>

        {isReadOnly ? (
          <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-md">
            Viewing saved location information.
          </div>
        ) : (
          <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-md">
            {hasExistingData ? "Editing location information." : "Please enter your location information."}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-600">
          <div className="mb-4">
            <label htmlFor="address" className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              Address:
            </label>
            <input
              id="address"
              {...register("address")}
              readOnly={isReadOnly}
              className={`w-full p-2 rounded-md focus:ring-2 focus:ring-blue-500 ${
                isReadOnly
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                  : errors.address
                  ? "border border-red-500"
                  : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              }`}
              placeholder="Enter your business address"
            />
            {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="city" className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              City:
            </label>
            <input
              id="city"
              {...register("city")}
              readOnly={isReadOnly}
              className={`w-full p-2 rounded-md focus:ring-2 focus:ring-blue-500 ${
                isReadOnly
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                  : errors.city
                  ? "border border-red-500"
                  : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              }`}
              placeholder="Enter your city"
            />
            {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="state" className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              State:
            </label>
            <input
              id="state"
              {...register("state")}
              readOnly={isReadOnly}
              className={`w-full p-2 rounded-md focus:ring-2 focus:ring-blue-500 ${
                isReadOnly
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                  : errors.state
                  ? "border border-red-500"
                  : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              }`}
              placeholder="Enter your state"
            />
            {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="postalCode" className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              Postal Code:
            </label>
            <input
              id="postalCode"
              {...register("postalCode")}
              readOnly={isReadOnly}
              className={`w-full p-2 rounded-md focus:ring-2 focus:ring-blue-500 ${
                isReadOnly
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                  : errors.postalCode
                  ? "border border-red-500"
                  : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              }`}
              placeholder="Enter your postal code"
            />
            {errors.postalCode && <p className="mt-1 text-sm text-red-500">{errors.postalCode.message}</p>}
          </div>
        </form>

        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
          <Button
            className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
            onClick={() => router.push("/business-info")}
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