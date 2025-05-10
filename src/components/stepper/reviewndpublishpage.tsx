"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Pencil } from "lucide-react";
import axios from "axios";
import businessData from "@/datas/businessData.json";

const publishedBusinesses: any[] = [];

const countryCodes = [
  { code: "+1", country: "US" },
  { code: "+44", country: "UK" },
  { code: "+91", country: "INR" },
  { code: "+81", country: "Japan" },
  { code: "+86", country: "China" },
];

const FORM_DATA_KEY = "galleryFaqsCtaFormData";
const CALL_COUNTRY_CODE_KEY = "callCountryCode";
const BUSINESS_DATA_KEY = "businessData";
const PUBLISH_FORM_DATA_KEY = "publishFormData";
const EDIT_MODE_KEY = "isEditModeActive";
const HAS_CHANGES_KEY = "hasChanges";

interface FAQ {
  question: string;
  answer: string;
}

interface CTA {
  call: string;
  bookUrl: string;
  getDirections: string;
}

interface Service {
  name: string;
  price: string;
}

interface Location {
  address: string;
  city: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

interface Contact {
  phone?: string;
  email?: string;
  website?: string;
}

interface Timings {
  [key: string]: string;
}

interface Business {
  businessName: string;
  description: string;
  location: Location;
  contact: Contact;
  services: Service[];
  timings: Timings;
  gallery: string[];
  faqs: FAQ[];
  cta: CTA;
}

interface FormData {
  subcategories?: {
    businesses?: Business[];
  }[];
}

interface WelcomeData {
  category: string;
  subcategory: string;
}

interface PublishedBusinessData {
  welcome: WelcomeData;
  business: {
    businessName: string;
    description: string;
  };
  location: Location;
  contact: Contact;
  services: Service[];
  timings: Timings;
  gallery: string[];
  faqs: FAQ[];
  cta: CTA;
  publish: boolean;
}

interface ApiResponse {
  welcome?: WelcomeData;
  gallery?: string[];
  faqs?: FAQ[];
  cta?: CTA;
  publish?: boolean;
}

const areObjectsEqual = (obj1: Record<string, unknown>, obj2: Record<string, unknown>): boolean => {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== "object" || typeof obj2 !== "object" || obj1 == null || obj2 == null) {
    return obj1 === obj2;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key) || !areObjectsEqual(obj1[key] as Record<string, unknown>, obj2[key] as Record<string, unknown>)) {
      return false;
    }
  }
  return true;
};

const validateBusinessData = (data: PublishedBusinessData): string | null => {
  if (!data.business.businessName) {
    return "Business name is required.";
  }
  if (!data.welcome.category.trim() || !data.welcome.subcategory.trim()) {
    return "Category and subcategory are required and cannot be empty.";
  }
  if (!data.location.address || !data.location.city) {
    return "Address and city are required.";
  }
  if (!data.services.length) {
    return "At least one service is required.";
  }
  return null;
};

const GalleryFAQsAndCTA = () => {
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [callCountryCode, setCallCountryCode] = useState<string>(countryCodes[0].code);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [welcomeData, setWelcomeData] = useState<WelcomeData>({
    category: "",
    subcategory: "",
  });
  const [isPublished, setIsPublished] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const initialBusiness = businessData.subcategories[0].businesses[0];

  useEffect(() => {
    if (typeof window === "undefined" || isPublished) return;

    const welcomeFormDataRaw = localStorage.getItem("welcomeFormData") || "{}";
    const apiResponseRaw = localStorage.getItem("apiResponse") || "{}";
    let welcomeFormData: WelcomeData = { category: "", subcategory: "" };
    let apiResponse: ApiResponse = {};

    try {
      welcomeFormData = JSON.parse(welcomeFormDataRaw) || {};
      apiResponse = JSON.parse(apiResponseRaw) || {};
    } catch (err) {
      console.error("Error parsing welcomeFormData or apiResponse:", err);
    }

    if (
      (apiResponse.publish && apiResponse.welcome?.category?.trim() && apiResponse.welcome?.subcategory?.trim()) ||
      (welcomeFormData.category?.trim() && welcomeFormData.subcategory?.trim())
    ) {
      setWelcomeData({
        category: apiResponse.publish ? apiResponse.welcome?.category || "" : welcomeFormData.category || "",
        subcategory: apiResponse.publish ? apiResponse.welcome?.subcategory || "" : welcomeFormData.subcategory || "",
      });
    } else {
      console.warn("Missing category or subcategory, redirecting to /welcome");
      router.push("/welcome");
    }
  }, [router, isPublished]);

  useEffect(() => {
    if (initialized || typeof window === "undefined") return;

    const publishFormData = localStorage.getItem(PUBLISH_FORM_DATA_KEY);
    const parsedIsPublished = publishFormData ? JSON.parse(publishFormData).published : false;
    const editMode = localStorage.getItem(EDIT_MODE_KEY) === "true";
    const globalChanges = localStorage.getItem(HAS_CHANGES_KEY) === "true";
    setIsEditMode(editMode || !parsedIsPublished);
    setIsPublished(parsedIsPublished);
    setHasChanges(globalChanges);

    console.log("Initialization:", { parsedIsPublished, isEditMode: editMode || !parsedIsPublished, hasChanges: globalChanges });

    let parsedApiResponse: ApiResponse = {};

    const apiResponse = localStorage.getItem("apiResponse");
    if (apiResponse && apiResponse !== "{}" && apiResponse !== '""') {
      try {
        parsedApiResponse = JSON.parse(apiResponse) || {};
      } catch (err) {
        console.error("Invalid apiResponse JSON:", err);
      }
    }

    const savedFormData = localStorage.getItem(FORM_DATA_KEY);
    const savedCallCode = localStorage.getItem(CALL_COUNTRY_CODE_KEY);
    if (savedCallCode) setCallCountryCode(savedCallCode);

    if (savedFormData && savedFormData !== "null") {
      try {
        setFormData(JSON.parse(savedFormData));
      } catch (err) {
        console.error("Error parsing savedFormData:", err);
      }
    } else {
      const parsedBusinessFormData = JSON.parse(localStorage.getItem("businessInfoFormData") || "{}");
      const parsedLocationFormData: { subcategories?: { businesses?: { location: Location }[] }[] } = JSON.parse(
        localStorage.getItem("locationFormData") || '{"subcategories":[{"businesses":[{"location":{}}]}]}'
      );
      const parsedContactAndTimingsFormData: {
        subcategories?: { businesses?: { contact?: Contact; timings?: Timings }[] }[];
      } = JSON.parse(localStorage.getItem("contactAndTimingsFormData") || '{"subcategories":[{"businesses":[{}]}]}');
      const parsedServicesFormData = JSON.parse(localStorage.getItem("servicesFormData") || "{}");

      setFormData({
        subcategories: [
          {
            businesses: [
              {
                businessName:
                  parsedBusinessFormData.subcategories?.[0]?.businesses?.[0]?.businessName ||
                  initialBusiness.businessName,
                description:
                  parsedBusinessFormData.subcategories?.[0]?.businesses?.[0]?.description ||
                  initialBusiness.description,
                location:
                  parsedLocationFormData.subcategories?.[0]?.businesses?.[0]?.location || initialBusiness.location,
                contact:
                  parsedContactAndTimingsFormData.subcategories?.[0]?.businesses?.[0]?.contact ||
                  initialBusiness.contact,
                services:
                  parsedServicesFormData.subcategories?.[0]?.businesses?.[0]?.services || initialBusiness.services,
                timings:
                  parsedContactAndTimingsFormData.subcategories?.[0]?.businesses?.[0]?.timings ||
                  initialBusiness.timings,
                gallery: parsedApiResponse.gallery || initialBusiness.gallery || [],
                faqs: parsedApiResponse.faqs || initialBusiness.faqs || [],
                cta: {
                  call: parsedApiResponse.cta?.call || initialBusiness.cta.call,
                  bookUrl: parsedApiResponse.cta?.bookUrl || initialBusiness.cta.bookUrl,
                  getDirections: parsedApiResponse.cta?.getDirections || initialBusiness.cta.getDirections,
                },
              },
            ],
          },
        ],
      });
    }

    setInitialized(true);
  }, [initialized, initialBusiness]);

  useEffect(() => {
    if (typeof window === "undefined" || !initialized || !formData) return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === EDIT_MODE_KEY) {
        const newEditMode = event.newValue === "true";
        setIsEditMode(newEditMode);
        console.log("EDIT_MODE_KEY changed:", { isEditMode: newEditMode });
      } else if (event.key === PUBLISH_FORM_DATA_KEY) {
        try {
          const publishFormData = event.newValue ? JSON.parse(event.newValue) : { published: false };
          if (publishFormData.published) {
            setIsEditMode(false);
            setHasChanges(false);
            localStorage.setItem(EDIT_MODE_KEY, "false");
            localStorage.setItem(HAS_CHANGES_KEY, "false");
            console.log("PUBLISH_FORM_DATA_KEY changed: Reset to read-only");
          }
        } catch (err) {
          console.error("Error parsing updated publishFormData:", err);
        }
      } else if (event.key === HAS_CHANGES_KEY) {
        const newHasChanges = event.newValue === "true";
        setHasChanges(newHasChanges);
        console.log("HAS_CHANGES_KEY changed:", { hasChanges: newHasChanges });
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [initialized, formData]);

  useEffect(() => {
    if (!initialized || !formData || !isEditMode) return;

    localStorage.setItem(FORM_DATA_KEY, JSON.stringify(formData));
    localStorage.setItem(CALL_COUNTRY_CODE_KEY, callCountryCode);

    const storedApiResponse = localStorage.getItem("apiResponse");
    let parsedApiResponse: ApiResponse = {};
    try {
      parsedApiResponse = storedApiResponse ? JSON.parse(storedApiResponse) : {};
    } catch (err) {
      console.error("Error parsing stored apiResponse:", err);
    }

    const parsedCurrentBusiness: Business = formData.subcategories?.[0]?.businesses?.[0] || {
      businessName: "",
      description: "",
      location: { address: "", city: "" },
      contact: {},
      services: [],
      timings: {},
      gallery: [],
      faqs: [],
      cta: { call: "", bookUrl: "", getDirections: "" },
    };
    const completeData: PublishedBusinessData = {
      welcome: welcomeData,
      business: {
        businessName: parsedCurrentBusiness.businessName || "",
        description: parsedCurrentBusiness.description || "",
      },
      location: parsedCurrentBusiness.location || { address: "", city: "" },
      contact: parsedCurrentBusiness.contact || {},
      services: parsedCurrentBusiness.services || [],
      timings: parsedCurrentBusiness.timings || {},
      gallery: parsedCurrentBusiness.gallery || [],
      faqs: parsedCurrentBusiness.faqs || [],
      cta: parsedCurrentBusiness.cta || { call: "", bookUrl: "", getDirections: "" },
      publish: parsedApiResponse.publish || false,
    };

    const hasLocalChanges = !areObjectsEqual(completeData as unknown as Record<string, unknown>, parsedApiResponse as unknown as Record<string, unknown>);
    const hasGlobalChanges = localStorage.getItem(HAS_CHANGES_KEY) === "true";
    setHasChanges(hasLocalChanges || hasGlobalChanges);

    if (hasLocalChanges) {
      localStorage.setItem(HAS_CHANGES_KEY, "true");
    }

    console.log("Form data updated:", {
      isEditMode,
      hasChanges: hasLocalChanges || hasGlobalChanges,
      hasLocalChanges,
    });
  }, [formData, callCountryCode, initialized, isEditMode, welcomeData]);

  const updateFormData = (path: string, value: string) => {
    if (!formData || !isEditMode) return;
    const keys = path.split(".");
    const newData = JSON.parse(JSON.stringify(formData));
    let current = newData;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;

    setFormData(newData);
    localStorage.setItem(HAS_CHANGES_KEY, "true");
  };

  const handleArrayChange = (arrayPath: string, index: number, field: string, value: string) => {
    if (!formData || !isEditMode) return;
    const newData = JSON.parse(JSON.stringify(formData));
    const keys = arrayPath.split(".");
    let current = newData;

    for (let i = 0; i < keys.length; i++) {
      current = current[keys[i]];
    }

    current[index][field] = value;
    setFormData(newData);
    localStorage.setItem(HAS_CHANGES_KEY, "true");
  };

  const addArrayItem = (arrayPath: string, newItem: FAQ | string) => {
    if (!formData || !isEditMode) return;
    const newData = JSON.parse(JSON.stringify(formData));
    const keys = arrayPath.split(".");
    let current = newData;

    for (let i = 0; i < keys.length; i++) {
      current = current[keys[i]];
    }

    current.push(newItem);
    setFormData(newData);
    localStorage.setItem(HAS_CHANGES_KEY, "true");
  };

  const removeArrayItem = (arrayPath: string, index: number) => {
    if (!formData || !isEditMode) return;
    const newData = JSON.parse(JSON.stringify(formData));
    const keys = arrayPath.split(".");
    let current = newData;

    for (let i = 0; i < keys.length; i++) {
      current = current[keys[i]];
    }

    current.splice(index, 1);
    setFormData(newData);
    localStorage.setItem(HAS_CHANGES_KEY, "true");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditMode) return;
    const file = e.target.files?.[0];
    if (!file || !formData) return;

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
      addArrayItem("subcategories.0.businesses.0.gallery", reader.result as string);
      localStorage.setItem(HAS_CHANGES_KEY, "true");
    };
    reader.readAsDataURL(file);
  };

  const handleEdit = () => {
    setIsEditMode(true);
    localStorage.setItem(EDIT_MODE_KEY, "true");
    localStorage.setItem(HAS_CHANGES_KEY, "true");
    localStorage.setItem(PUBLISH_FORM_DATA_KEY, JSON.stringify({ published: false }));
    console.log("Edit mode enabled via GalleryFAQsAndCTA pencil");
  };

  const handlePublishOrUpdate = async () => {
    if (!formData) return;
    setIsPublishing(true);

    try {
      // Retrieve welcome data
      const welcomeFormDataRaw = localStorage.getItem("welcomeFormData") || "{}";
      let welcomeFormData: WelcomeData = { category: "", subcategory: "" };

      try {
        welcomeFormData = JSON.parse(welcomeFormDataRaw) || {};
      } catch (err) {
        console.error("Error parsing welcomeFormData:", err);
        throw new Error("Invalid welcome data in localStorage.");
      }

      // Get current business data
      const parsedCurrentBusiness = formData.subcategories?.[0]?.businesses?.[0] || {
        businessName: "",
        description: "",
        location: { address: "", city: "" },
        contact: {},
        services: [],
        timings: {},
        gallery: [],
        faqs: [],
        cta: { call: "", bookUrl: "", getDirections: "" },
      };

      // Generate a unique websiteId
      const generateUniqueId = () => Math.floor(Date.now() + Math.random() * 1000000);
      const websiteId = generateUniqueId();

      // Construct the API payload
      const apiPayload = {
        websiteId: websiteId,
        websiteName: parsedCurrentBusiness.businessName || "demo",
        websiteUrl: parsedCurrentBusiness.contact.website || parsedCurrentBusiness.cta.bookUrl || "https://district-business.com",
        logoUrl: parsedCurrentBusiness.gallery[0] || "https://district-business.com",
        isFeatured: false,
        status: "active",
        categoryId: 1,
        categoryName: welcomeFormData.category || "software",
        categorySlug: welcomeFormData.category.toLowerCase().replace(/\s+/g, "-") || "software",
        subcategoryId: 3,
        subcategoryName: welcomeFormData.subcategory || "computer",
        subcategorySlug: welcomeFormData.subcategory.toLowerCase().replace(/\s+/g, "-") || "computer",
        pincode: parsedCurrentBusiness.location.postalCode ? parseInt(parsedCurrentBusiness.location.postalCode) : 560072,
        city: parsedCurrentBusiness.location.city || "bengaluru",
        state: parsedCurrentBusiness.location.state || "karnataka",
      };

      // Log the payload for debugging
      console.log("API Payload:", JSON.stringify(apiPayload, null, 2));

      // Create a new axios instance for the direct API call
      const directApi = axios.create({
        baseURL: "https://dbapiservice.onrender.com",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });

      // Post the data to the API
      const response = await directApi.post("/dbapis/v1/websites", apiPayload);

      console.log("API Response:", response.data);

      // Update localStorage and state
      localStorage.setItem(PUBLISH_FORM_DATA_KEY, JSON.stringify({ published: true }));
      localStorage.setItem(EDIT_MODE_KEY, "false");
      localStorage.setItem(HAS_CHANGES_KEY, "false");
      localStorage.setItem("lastPublishedBusinessId", websiteId.toString());
      localStorage.setItem(FORM_DATA_KEY, JSON.stringify(formData));
      localStorage.setItem(CALL_COUNTRY_CODE_KEY, callCountryCode);

      setIsPublished(true);
      setIsEditMode(false);
      setHasChanges(false);

      alert("Business published successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error publishing business:", error);
      let errorMessage = "Failed to publish business. Please try again.";
      if (axios.isAxiosError(error)) {
        console.error("Axios Error Details:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        errorMessage = error.response?.data?.message || error.message;
        if (error.response?.status === 0) {
          errorMessage = "Network Error: Unable to reach the server. Please check your connection.";
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      alert(errorMessage);
    } finally {
      setIsPublishing(false);
    }
  };

  if (!formData) return <div className="text-gray-800 dark:text-gray-100">Loading...</div>;

  const currentBusiness = formData.subcategories?.[0]?.businesses?.[0] || {
    businessName: "",
    description: "",
    location: { address: "", city: "" },
    contact: {},
    services: [],
    timings: {},
    gallery: [],
    faqs: [],
    cta: { call: "", bookUrl: "", getDirections: "" },
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <form
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 relative"
        data-testid="gallery-faqs-cta-form"
        aria-describedby="form-instructions"
      >
        <p id="form-instructions" className="sr-only">
          Upload images to the gallery, add FAQs, and provide call-to-action details. Use the buttons to navigate or publish the business.
        </p>
        {!isEditMode && isPublished && (
          <button
            type="button"
            onClick={handleEdit}
            className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 focus:ring-2 focus:ring-gray-500 p-2 rounded-full"
            aria-label="Edit published business data"
          >
            <Pencil className="h-5 w-5" />
          </button>
        )}
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Gallery, FAQs, and Call to Action</h2>

        {isEditMode ? (
          <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md">
            Edit mode: You can modify all fields.
          </div>
        ) : isPublished ? (
          <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-md">
            Viewing published data. Click the pencil icon in the top-right to edit.
          </div>
        ) : (
          <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md">
            Create mode: Enter details and publish.
          </div>
        )}

        <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Gallery</h3>
          <div className="mb-4">
            {currentBusiness.gallery.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {currentBusiness.gallery.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md border border-gray-200 dark:border-gray-600"
                    />
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem("subcategories.0.businesses.0.gallery", index)}
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
            {isEditMode && (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 text-center">
                <label htmlFor="image-upload" className="cursor-pointer block" aria-label="Upload image to gallery">
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
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Supports JPG, PNG up to 5MB
                    </p>
                  </div>
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Call to Action</h3>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[250px]">
              <label htmlFor="call-number-input" className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                Call Number:
              </label>
              <div className="flex" role="group" aria-labelledby="call-label">
                <label htmlFor="call-code" className="sr-only">
                  Select country code for call
                </label>
                <select
                  id="call-code"
                  value={callCountryCode}
                  onChange={(e) => isEditMode && setCallCountryCode(e.target.value)}
                  className={`w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-l-md text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 ${
                    isEditMode ? "focus:ring-2 focus:ring-gray-500" : "bg-gray-100 dark:bg-gray-700"
                  }`}
                  aria-label="Country code"
                  disabled={!isEditMode}
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.code} ({country.country})
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  id="call-number"
                  placeholder="Phone number"
                  value={currentBusiness.cta.call.replace(`${callCountryCode}-`, "") || ""}
                  onChange={(e) =>
                    isEditMode &&
                    updateFormData(
                      "subcategories.0.businesses.0.cta.call",
                      `${callCountryCode}-${e.target.value.replace(/[^0-9]/g, "")}`
                    )
                  }
                  className={`flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-r-md text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 ${
                    isEditMode ? "focus:ring-2 focus:ring-gray-500" : "bg-gray-100 dark:bg-gray-700"
                  }`}
                  aria-label="Call number"
                  readOnly={!isEditMode}
                />
              </div>
            </div>
            <div className="flex-1 min-w-[250px]">
              <label htmlFor="book-url" className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                Booking URL:
              </label>
              <input
                type="url"
                id="book-url"
                placeholder="https://example.com/book"
                value={currentBusiness.cta.bookUrl || ""}
                onChange={(e) =>
                  isEditMode && updateFormData("subcategories.0.businesses.0.cta.bookUrl", e.target.value)
                }
                className={`w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 ${
                  isEditMode ? "focus:ring-2 focus:ring-gray-500" : "bg-gray-100 dark:bg-gray-700"
                }`}
                readOnly={!isEditMode}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <label htmlFor="directions-url" className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                Get Directions URL:
              </label>
              <input
                type="url"
                id="directions-url"
                placeholder="https://maps.google.com/..."
                value={currentBusiness.cta.getDirections || ""}
                onChange={(e) =>
                  isEditMode && updateFormData("subcategories.0.businesses.0.cta.getDirections", e.target.value)
                }
                className={`w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 ${
                  isEditMode ? "focus:ring-2 focus:ring-gray-500" : "bg-gray-100 dark:bg-gray-700"
                }`}
                readOnly={!isEditMode}
              />
            </div>
          </div>
        </div>

        <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">FAQs</h3>
          <div className="mb-4">
            {currentBusiness.faqs.map((faq, index) => (
              <div key={index} className="mb-4 p-3 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700">
                <div className="mb-3">
                  <label htmlFor={`faq-question-${index}`} className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                    Question:
                  </label>
                  <input
                    type="text"
                    id={`faq-question-${index}`}
                    placeholder="Enter question"
                    value={faq.question || ""}
                    onChange={(e) =>
                      isEditMode &&
                      handleArrayChange("subcategories.0.businesses.0.faqs", index, "question", e.target.value)
                    }
                    className={`w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 ${
                      isEditMode ? "focus:ring-2 focus:ring-gray-500" : "bg-gray-100 dark:bg-gray-700"
                    }`}
                    readOnly={!isEditMode}
                  />
                </div>
                <div>
                  <label htmlFor={`faq-answer-${index}`} className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                    Answer:
                  </label>
                  <textarea
                    id={`faq-answer-${index}`}
                    placeholder="Enter answer"
                    value={faq.answer || ""}
                    onChange={(e) =>
                      isEditMode &&
                      handleArrayChange("subcategories.0.businesses.0.faqs", index, "answer", e.target.value)
                    }
                    className={`w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm h-24 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 ${
                      isEditMode ? "focus:ring-2 focus:ring-gray-500" : "bg-gray-100 dark:bg-gray-700"
                    }`}
                    readOnly={!isEditMode}
                  />
                </div>
                {isEditMode && currentBusiness.faqs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem("subcategories.0.businesses.0.faqs", index)}
                    className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 focus:ring-2 focus:ring-red-500"
                    aria-label={`Remove FAQ ${index + 1}`}
                  >
                    Remove FAQ
                  </button>
                )}
              </div>
            ))}
          </div>
          {isEditMode && (
            <button
              type="button"
              onClick={() => addArrayItem("subcategories.0.businesses.0.faqs", { question: "", answer: "" })}
              className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 focus:ring-2 focus:ring-green-600"
              aria-label="Add new FAQ"
            >
              + Add FAQ
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
          <Button
            className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-gray-500"
            onClick={() => router.push("/services")}
            type="button"
          >
            Back
          </Button>
          {isEditMode && (
            <Button
              className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
              onClick={handlePublishOrUpdate}
              type="button"
              disabled={isPublishing || !hasChanges}
              aria-label={isPublishing ? "Publishing in progress" : "Publish business"}
            >
              {isPublishing ? "Processing..." : "Publish"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default GalleryFAQsAndCTA;