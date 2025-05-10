"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Pencil } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import fallbackData from "@/datas/category and subcategory.json";

// Define CategoryData interface (already present in your code)
interface CategoryData {
  category: string;
  subcategories: string[];
}

// Zod schema 
const welcomeSchema = z.object({
  category: z.string().min(1, "Please select a category"),
  subcategory: z.string().min(1, "Please select a subcategory")
}).refine(data => {
  // Custom validation to ensure subcategory belongs to selected category
  const categoryObj = fallbackData.find((cat: CategoryData) => cat.category === data.category);
  return categoryObj ? categoryObj.subcategories.includes(data.subcategory) : false;   
}, {
  message: "Selected subcategory doesn't belong to the chosen category", 
  path: ["subcategory"]  
});

type WelcomeFormData = z.infer<typeof welcomeSchema>;

interface ApiResponse {
  welcome?: WelcomeFormData;
  publish?: boolean;
}

function getStoredData<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item && item !== '""' ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.error(`Invalid localStorage JSON for ${key}:`, err);
    return defaultValue;
  }
}

export default function Welcome() {
  const router = useRouter();
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
    trigger
  } = useForm<WelcomeFormData>({
    resolver: zodResolver(welcomeSchema),
    mode: "onChange"
  });

  const selectedCategory = watch("category");
  const selectedSubcategory = watch("subcategory");

  useEffect(() => {
    setCategoryData(fallbackData as CategoryData[]);

    const storedFormData = getStoredData<WelcomeFormData>("welcomeFormData", {
      category: "",
      subcategory: "",
    });

    const storedApiResponse = getStoredData<ApiResponse>("apiResponse", {});

    if (storedApiResponse.publish && storedApiResponse.welcome) {
      setValue("category", storedApiResponse.welcome.category || "");
      setValue("subcategory", storedApiResponse.welcome.subcategory || "");
      setIsReadOnly(true);
      setIsEditing(false);
    } else if (storedFormData.category && storedFormData.subcategory) {
      setValue("category", storedFormData.category);
      setValue("subcategory", storedFormData.subcategory);
      setIsReadOnly(false);
      setIsEditing(true);
    } else {
      setValue("category", "");
      setValue("subcategory", "");
      setIsReadOnly(false);
      setIsEditing(true);
    }
  }, [setValue]);

  const handleEdit = () => {
    setIsReadOnly(false);
    setIsEditing(true);
    localStorage.setItem("isEditModeActive", "true");
    localStorage.setItem("hasChanges", "true");
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setValue("category", newCategory);
    setValue("subcategory", "");
    trigger("subcategory");
    localStorage.setItem("hasChanges", "true");
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSubcategory = e.target.value;
    setValue("subcategory", newSubcategory);
    localStorage.setItem("hasChanges", "true");
  };

  const getSubcategories = () => {
    const categoryObj = categoryData.find((cat) => cat.category === selectedCategory);
    return categoryObj ? categoryObj.subcategories : [];
  };

  const onSubmit = (data: WelcomeFormData) => {
    localStorage.setItem("welcomeFormData", JSON.stringify(data));
    localStorage.setItem("hasChanges", "true");
    router.push("/business-info");
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Welcome</h2>
          {isReadOnly && (
            <button
              onClick={handleEdit}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              aria-label="Edit Category"
            >
              <Pencil className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Business Category</h3>
          
          {isReadOnly ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="category" className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                  Category:
                </label>
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-100">
                  {selectedCategory || "Not selected"}
                </div>
              </div>
              <div>
                <label htmlFor="subcategory" className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                  Subcategory:
                </label>
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-100">
                  {selectedSubcategory || "Not selected"}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex-1 min-w-[250px]">
                  <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                    Category:
                    <select
                      id="category-select"
                      {...register("category", {
                        onChange: handleCategoryChange
                      })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-blue-500 mt-1 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
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
                        onChange: handleSubcategoryChange
                      })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-blue-500 mt-1 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                      disabled={!selectedCategory}
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

              <div className="flex justify-end">
                <Button
                  className="w-full sm:w-auto focus:ring-2 focus:ring-blue-500 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  color="primary"
                  type="submit"
                  disabled={!isValid}
                >
                  Next
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}