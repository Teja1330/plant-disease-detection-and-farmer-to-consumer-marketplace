// components/AddressForm.jsx - UPDATED WITH STATE-DISTRICT DROPDOWNS
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Loader2, X, CheckCircle } from "lucide-react";
import { addressAPI } from "../api";
import { useUser } from "../App";
import { statesAndDistricts, states, getDistrictsByState } from "@/lib/statesDistricts";

const AddressForm = ({ isOpen, onClose, onSuccess, user, role = "customer" }) => {
  const { toast } = useToast();
  const { setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    street_address: "",
    city: "",
    district: "",
    state: "",
    country: "India",
    pincode: ""
  });
  const [hasExistingAddress, setHasExistingAddress] = useState(false);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadExistingAddress();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, user]);

  // Update districts when state changes
  useEffect(() => {
    if (formData.state) {
      const stateDistricts = getDistrictsByState(formData.state);
      setDistricts(stateDistricts);

      // Reset district if it's not in the new state's districts
      if (formData.district && !stateDistricts.includes(formData.district)) {
        setFormData(prev => ({ ...prev, district: "" }));
      }
    } else {
      setDistricts([]);
    }
  }, [formData.state]);

  const loadExistingAddress = async () => {
    try {
      console.log("🔄 Loading existing address for user:", {
        id: user?.id,
        role: role
      });

      const response = await addressAPI.getCurrentAddress();
      const userData = response.data;

      console.log("📦 User data from API:", userData);

      const hasAddress = userData.street_address && userData.street_address.trim() !== '' &&
        userData.city && userData.city.trim() !== '' &&
        userData.district && userData.district.trim() !== '' &&
        userData.state && userData.state.trim() !== '' &&
        userData.pincode && userData.pincode.trim() !== '';

      console.log("✅ Has complete address:", hasAddress);
      setHasExistingAddress(hasAddress);

      // Pre-fill form with existing data
      setFormData({
        street_address: userData.street_address || "",
        city: userData.city || "",
        district: userData.district || "",
        state: userData.state || "",
        country: userData.country || "India",
        pincode: userData.pincode || ""
      });

      // Set districts based on state
      if (userData.state) {
        const stateDistricts = getDistrictsByState(userData.state);
        setDistricts(stateDistricts);
      }

    } catch (error) {
      console.error("❌ Failed to load existing address:", error);
      if (user) {
        setFormData({
          street_address: user.street_address || "",
          city: user.city || "",
          district: user.district || "",
          state: user.state || "",
          country: user.country || "India",
          pincode: user.pincode || ""
        });

        if (user.state) {
          const stateDistricts = getDistrictsByState(user.state);
          setDistricts(stateDistricts);
        }
      }
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.street_address || !formData.city || !formData.district || !formData.state || !formData.pincode) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required address fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      console.log("🔄 Updating address for user:", {
        id: user?.id,
        role: role,
        addressData: formData
      });

      const response = await addressAPI.updateAddress(formData);
      console.log("✅ Address update response:", response.data);

      // Refresh user data after address update
      console.log("🔄 Refreshing user data after address update...");
      try {
        const userResponse = await addressAPI.getCurrentAddress();
        const updatedUserData = userResponse.data;
        setUser(updatedUserData);
        localStorage.setItem('user_data', JSON.stringify(updatedUserData));
        console.log("✅ User data refreshed after address update - ID:", updatedUserData.id);
      } catch (refreshError) {
        console.error("❌ Failed to refresh user data:", refreshError);
      }

      if (onSuccess) {
        onSuccess(response.data.address);
      }

      onClose();
    } catch (error) {
      console.error("❌ Failed to update address:", error);
      console.error("Error details:", error.response?.data);

      let errorMessage = "Failed to update address. Please try again.";
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.status === 404) {
        errorMessage = "Address update endpoint not found. Please contact support.";
      }

      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
        className="w-full max-w-md mx-auto my-auto"
      >
        <Card className="shadow-2xl border-0 relative bg-white max-h-[85vh] flex flex-col">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 bg-white rounded-full p-1 shadow-sm"
          >
            <X className="h-5 w-5" />
          </button>

          <CardHeader className="pb-4 flex-shrink-0">
            <CardTitle className="flex items-center gap-2 text-xl">
              <MapPin className="h-6 w-6 text-blue-600" />
              {hasExistingAddress ? "Update Your Address" : "Add Your Address"}
            </CardTitle>
            {hasExistingAddress && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>You already have an address saved</span>
              </div>
            )}
          </CardHeader>

          <CardContent className="pt-0 flex-1 overflow-hidden flex flex-col">
            <form onSubmit={handleSubmit} className="space-y-4 flex-1 overflow-y-auto pr-2 flex flex-col">
              <div className="space-y-4 flex-1">
                <div className="space-y-2">
                  <Label htmlFor="street_address" className="text-sm font-medium">Street Address *</Label>
                  <Textarea
                    id="street_address"
                    value={formData.street_address}
                    onChange={(e) => handleInputChange('street_address', e.target.value)}
                    placeholder="Enter your complete street address"
                    required
                    className="min-h-[80px] resize-vertical"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="City"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pincode" className="text-sm font-medium">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      placeholder="Pincode"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state" className="text-sm font-medium">State *</Label>
                  <select
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    required
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district" className="text-sm font-medium">District *</Label>
                  <select
                    id="district"
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    required
                    disabled={!formData.state}
                  >
                    <option value="">{formData.state ? "Select District" : "Select State First"}</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  {!formData.state && (
                    <p className="text-xs text-gray-500">Please select a state first</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm font-medium">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="Country"
                    disabled
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200 mt-4 flex-shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-gray-300"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {hasExistingAddress ? "Updating..." : "Saving..."}
                    </>
                  ) : (
                    hasExistingAddress ? "Update Address" : "Save Address"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AddressForm;