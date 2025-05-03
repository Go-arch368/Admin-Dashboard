"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Pencil } from "lucide-react";
import businessData from "@/datas/businessData.json";

const Location = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    postalCode: "",
  });
  const [initialData, setInitialData] = useState({
    address: "",
    city: "",
    state: "",
    postalCode: "",
  });

  useEffect(() => {
    const apiResponse = localStorage.getItem("apiResponse");
    const locationFormData = localStorage.getItem("locationFormData");

    let existingData = null;

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
        // Only use apiResponse if it has publish: true
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
      setFormData(existingData);
      setInitialData(existingData);
      setHasExistingData(true);
      setIsEditing(false);
    } else {
      setFormData({
        address: businessData.subcategories[0].businesses[0].location.address,
        city: businessData.subcategories[0].businesses[0].location.city,
        state: businessData.subcategories[0].businesses[0].location.state,
        postalCode: businessData.subcategories[0].businesses[0].location.postalCode,
      });
      setIsEditing(true);
      setHasExistingData(false);
    }
  }, []);

  const isFormValid = () => {
    const { address, city, state, postalCode } = formData;
    // Basic validation: all fields required, postal code must be 5-10 digits
    const postalCodeRegex = /^\d{5,10}$/;
    return (
      address.trim() !== "" &&
      city.trim() !== "" &&
      state.trim() !== "" &&
      postalCode.trim() !== "" &&
      postalCodeRegex.test(postalCode.trim())
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value };
      const dataToSave = {
        subcategories: [
          {
            businesses: [
              {
                location: updatedFormData,
              },
            ],
          },
        ],
      };
      localStorage.setItem("locationFormData", JSON.stringify(dataToSave));
      localStorage.setItem("hasChanges", "true");
      return updatedFormData;
    });
  };

  const handleNext = () => {
    if (!isFormValid()) {
      alert("Please fill in all required fields with valid data (postal code must be 5-10 digits).");
      return;
    }
    const dataToSave = {
      subcategories: [
        {
          businesses: [
            {
              location: formData,
            },
          ],
        },
      ],
    };
    localStorage.setItem("locationFormData", JSON.stringify(dataToSave));
    localStorage.setItem("hasChanges", "true");
    router.push("/contact&timings");
  };

  const toggleEdit = () => {
    if (isEditing) {
      setFormData(initialData);
      const dataToSave = {
        subcategories: [
          {
            businesses: [
              {
                location: initialData,
              },
            ],
          },
        ],
      };
      localStorage.setItem("locationFormData", JSON.stringify(dataToSave));
      localStorage.setItem("hasChanges", "true");
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
      <div className="bg-gray-50 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Business Location</h2>
          {isReadOnly && (
            <button
              onClick={toggleEdit}
              className="text-blue-600 hover:text-blue-800"
              aria-label="Edit Location"
            >
              <Pencil className="w-5 h-5" />
            </button>
          )}
        </div>

        {isReadOnly ? (
          <div className="mb-4 p-3 bg-gray-100 text-gray-800 rounded-md">
            Viewing saved location information.
          </div>
        ) : (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">
            {hasExistingData ? "Editing location information." : "Please enter your location information."}
          </div>
        )}

        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="mb-4">
            <label htmlFor="address" className="block mb-2 font-medium text-gray-700">
              Address:
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleInputChange}
              readOnly={isReadOnly}
              className={`w-full p-2 ${
                isReadOnly ? "bg-gray-100" : "border border-gray-300"
              } rounded-md focus:ring-2 focus:ring-gray-500`}
              placeholder="Enter your business address"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="city" className="block mb-2 font-medium text-gray-700">
              City:
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleInputChange}
              readOnly={isReadOnly}
              className={`w-full p-2 ${
                isReadOnly ? "bg-gray-100" : "border border-gray-300"
              } rounded-md focus:ring-2 focus:ring-gray-500`}
              placeholder="Enter your city"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="state" className="block mb-2 font-medium text-gray-700">
              State:
            </label>
            <input
              id="state"
              name="state"
              type="text"
              value={formData.state}
              onChange={handleInputChange}
              readOnly={isReadOnly}
              className={`w-full p-2 ${
                isReadOnly ? "bg-gray-100" : "border border-gray-300"
              } rounded-md focus:ring-2 focus:ring-gray-500`}
              placeholder="Enter your state"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="postalCode" className="block mb-2 font-medium text-gray-700">
              Postal Code:
            </label>
            <input
              id="postalCode"
              name="postalCode"
              type="text"
              value={formData.postalCode}
              onChange={handleInputChange}
              readOnly={isReadOnly}
              className={`w-full p-2 ${
                isReadOnly ? "bg-gray-100" : "border border-gray-300"
              } rounded-md focus:ring-2 focus:ring-gray-500`}
              placeholder="Enter your postal code"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
          <Button
            className="w-full sm:w-auto border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-gray-500"
            onClick={() => router.push("/business-info")}
          >
            Back
          </Button>

          {isEditing && hasExistingData && (
            <Button
              className="w-full sm:w-auto border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-gray-500"
              onClick={toggleEdit}
            >
              Cancel
            </Button>
          )}

          <Button
            className="w-full sm:w-auto focus:ring-2 focus:ring-blue-500 bg-blue-600 text-white hover:bg-blue-700"
            color="primary"
            onClick={handleNext}
            disabled={!isFormValid()}
          >
            {isReadOnly ? "Next" : "Save & Next"}
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Location;