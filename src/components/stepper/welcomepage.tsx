
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@heroui/button";
import { Pencil } from "lucide-react";
import fallbackData from "@/datas/category and subcategory.json";
import businessData from "@/datas/businessData.json";

interface CategoryData {
  category: string;
  subcategories: string[];
}

const stepper1Schema = z.object({
  category: z.string().min(1, "Please select a category"),
  subcategory: z.string().min(1, "Please select a subcategory"),
  businessName: z
    .string()
    .min(1, "Business name is required")
    .max(100, "Business name must be 100 characters or less"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be 500 characters or less"),
}).refine(
  (data) => {
    const categoryObj = fallbackData.find(
      (cat: CategoryData) => cat.category === data.category
    );
    return categoryObj ? categoryObj.subcategories.includes(data.subcategory) : false;
  },
  {
    message: "Selected subcategory doesn't belong to the chosen category",
    path: ["subcategory"],
  }
);

type Stepper1FormData = z.infer<typeof stepper1Schema>;

interface ApiResponse {
  welcome?: { category: string; subcategory: string };
  business?: { businessName: string; description: string };
  publish?: boolean;
}

function getStoredData<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.error(`Error parsing localStorage item ${key}:`, err);
    return defaultValue;
  }
}

export default function Welcome() {
  const router = useRouter();
  const [categoryData] = useState<CategoryData[]>(fallbackData as CategoryData[]);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
    trigger,
  } = useForm<Stepper1FormData>({
    resolver: zodResolver(stepper1Schema),
    mode: "onChange",
    defaultValues: {
      category: "",
      subcategory: "",
      businessName: "",
      description: "",
    },
  });

  const selectedCategory = watch("category");
  const selectedSubcategory = watch("subcategory");
  const formData = watch();

  useEffect(() => {
    const initializeForm = () => {
      const storedWelcomeFormData = getStoredData<{ category: string; subcategory: string }>(
        "welcomeFormData",
        { category: "", subcategory: "" }
      );
      const storedBusinessFormData = getStoredData<{
        subcategories: Array<{
          businesses: Array<{
            businessName: string;
            description: string;
          }>;
        }>;
      }>("businessFormData", {
        subcategories: [{
          businesses: [{
            businessName: "",
            description: ""
          }]
        }]
      });
      const storedApiResponse = getStoredData<ApiResponse>("apiResponse", {});

      let initialFormData: Stepper1FormData = {
        category: "",
        subcategory: "",
        businessName: businessData.subcategories[0]?.businesses[0]?.businessName || "",
        description: businessData.subcategories[0]?.businesses[0]?.description || "",
      };

      // Validate category and subcategory
      const isValidCategory = categoryData.some(
        (cat) => cat.category === storedWelcomeFormData.category
      );
      const isValidSubcategory = isValidCategory
        ? categoryData
            .find((cat) => cat.category === storedWelcomeFormData.category)
            ?.subcategories.includes(storedWelcomeFormData.subcategory)
        : false;

      if (storedApiResponse?.publish && storedApiResponse.welcome && storedApiResponse.business) {
        initialFormData = {
          category: storedApiResponse.welcome.category || "",
          subcategory: storedApiResponse.welcome.subcategory || "",
          businessName: storedApiResponse.business.businessName || initialFormData.businessName,
          description: storedApiResponse.business.description || initialFormData.description,
        };
        setIsReadOnly(true);
        setIsEditing(false);
        setHasExistingData(true);
      } else {
        initialFormData = {
          category: isValidCategory ? storedWelcomeFormData.category : "",
          subcategory: isValidSubcategory ? storedWelcomeFormData.subcategory : "",
          businessName: storedBusinessFormData.subcategories?.[0]?.businesses?.[0]?.businessName || initialFormData.businessName,
          description: storedBusinessFormData.subcategories?.[0]?.businesses?.[0]?.description || initialFormData.description,
        };
        setIsReadOnly(false);
        setIsEditing(true);
        setHasExistingData(
          !!(isValidCategory || storedBusinessFormData.subcategories?.[0]?.businesses?.[0]?.businessName)
        );
      }

      console.log("Initializing form with:", initialFormData);
      reset(initialFormData, { keepDefaultValues: false });
    };

    initializeForm();
  }, [reset]);

  useEffect(() => {
    console.log("Form state:", { category: selectedCategory, subcategory: selectedSubcategory });
  }, [selectedCategory, selectedSubcategory]);

  const handleEdit = () => {
    setIsReadOnly(false);
    setIsEditing(true);
    localStorage.setItem("isEditModeActive", "true");
    localStorage.setItem("hasChanges", "true");
  };

  const handleCancel = () => {
    const storedWelcomeFormData = getStoredData<{ category: string; subcategory: string }>(
      "welcomeFormData",
      { category: "", subcategory: "" }
    );
    const storedBusinessFormData = getStoredData<{
      subcategories: Array<{
        businesses: Array<{
          businessName: string;
          description: string;
        }>;
      }>;
    }>("businessFormData", {
      subcategories: [{
        businesses: [{
          businessName: "",
          description: ""
        }]
      }]
    });

    const isValidCategory = categoryData.some(
      (cat) => cat.category === storedWelcomeFormData.category
    );
    const isValidSubcategory = isValidCategory
      ? categoryData
          .find((cat) => cat.category === storedWelcomeFormData.category)
          ?.subcategories.includes(storedWelcomeFormData.subcategory)
      : false;

    reset({
      category: isValidCategory ? storedWelcomeFormData.category : "",
      subcategory: isValidSubcategory ? storedWelcomeFormData.subcategory : "",
      businessName: storedBusinessFormData.subcategories?.[0]?.businesses?.[0]?.businessName || 
                   businessData.subcategories[0]?.businesses[0]?.businessName || "",
      description: storedBusinessFormData.subcategories?.[0]?.businesses?.[0]?.description || 
                  businessData.subcategories[0]?.businesses[0]?.description || "",
    }, { keepDefaultValues: false });

    setIsEditing(false);
    setIsReadOnly(hasExistingData);
    localStorage.removeItem("isEditModeActive");
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setValue("category", newCategory, { shouldValidate: true });
    setValue("subcategory", "", { shouldValidate: true });
    localStorage.setItem("hasChanges", "true");
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSubcategory = e.target.value;
    setValue("subcategory", newSubcategory, { shouldValidate: true });
    localStorage.setItem("hasChanges", "true");
  };

  const getSubcategories = () => {
    const categoryObj = categoryData.find((cat) => cat.category === selectedCategory);
    return categoryObj ? categoryObj.subcategories : [];
  };

  const saveFormData = (data: Stepper1FormData) => {
    try {
      // Validate category and subcategory
      const isValidCategory = categoryData.some((cat) => cat.category === data.category);
      const isValidSubcategory = isValidCategory
        ? categoryData.find((cat) => cat.category === data.category)?.subcategories.includes(data.subcategory)
        : false;

      if (!isValidCategory || !isValidSubcategory) {
        throw new Error("Invalid category or subcategory selected.");
      }

      localStorage.setItem(
        "welcomeFormData",
        JSON.stringify({ category: data.category, subcategory: data.subcategory })
      );
      localStorage.setItem(
        "businessFormData",
        JSON.stringify({
          subcategories: [{
            businesses: [{
              businessName: data.businessName,
              description: data.description,
            }]
          }]
        })
      );
      localStorage.setItem("hasChanges", "true");
      console.log("Saved to localStorage:", { category: data.category, subcategory: data.subcategory });
    } catch (e) {
      console.error("Error saving form data:", e);
      alert("Failed to save information. Please try again.");
      throw e;
    }
  };

  const onSubmit = (data: Stepper1FormData) => {
    saveFormData(data);
    router.push("/location");
  };

  const handleNextInReadOnly = () => {
    saveFormData(formData);
    router.push("/location");
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Business Setup
          </h2>
          {isReadOnly && (
            <button
              onClick={handleEdit}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              aria-label="Edit Information"
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
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
            Business Details
          </h3>

          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[250px]">
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                Category:
                <select
                  id="category-select"
                  {...register("category", {
                    onChange: handleCategoryChange,
                  })}
                  disabled={isReadOnly}
                  value={selectedCategory}
                  className={`w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 mt-1 ${
                    isReadOnly
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                      : errors.category
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                  }`}
                  aria-describedby="category-instructions"
                >
                  <option value="">Select a category</option>
                  {categoryData.map((category, index) => (
                    <option key={index} value={category.category}>
                      {category.category}
                    </option>
                  ))}
                </select>
              </label>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.category.message}
                </p>
              )}
              <span id="category-instructions" className="sr-only">
                Select the primary category for your business.
              </span>
            </div>

            <div className="flex-1 min-w-[250px]">
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                Subcategory:
                <select
                  id="subcategory-select"
                  {...register("subcategory", {
                    onChange: handleSubcategoryChange,
                  })}
                  disabled={isReadOnly || !selectedCategory}
                  value={selectedSubcategory}
                  className={`w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 mt-1 ${
                    isReadOnly || !selectedCategory
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                      : errors.subcategory
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                  }`}
                  aria-describedby="subcategory-instructions"
                >
                  <option value="">Select a subcategory</option>
                  {getSubcategories().map((subcat, index) => (
                    <option key={index} value={subcat}>
                      {subcat}
                    </option>
                  ))}
                </select>
              </label>
              {errors.subcategory && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.subcategory.message}
                </p>
              )}
              <span id="subcategory-instructions" className="sr-only">
                Select a specific subcategory under the chosen category.
              </span>
            </div>
          </div>

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

        <div className="flex justify-end ">
        
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
    </div>
  );
}
