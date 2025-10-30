// src/utils/address.js - UPDATED FOR PREFIX IDS
export const hasCompleteAddress = (user) => {
  if (!user) {
    console.log("🔍 No user provided for address check");
    return false;
  }
  
  // Check if fields exist AND are not empty strings
  const hasAddress = user.street_address && user.street_address.trim() !== '' &&
                    user.city && user.city.trim() !== '' &&
                    user.district && user.district.trim() !== '' &&
                    user.state && user.state.trim() !== '' &&
                    user.pincode && user.pincode.trim() !== '';
  
  console.log("🔍 Address check for user:", {
    id: user.id, // Prefix ID
    hasAddress,
    userExists: !!user,
    street: user.street_address,
    city: user.city,
    district: user.district,
    state: user.state,
    pincode: user.pincode,
    allFields: {
      street: !!(user.street_address && user.street_address.trim()),
      city: !!(user.city && user.city.trim()),
      district: !!(user.district && user.district.trim()),
      state: !!(user.state && user.state.trim()),
      pincode: !!(user.pincode && user.pincode.trim())
    }
  });
  
  return hasAddress;
};

// Add this to src/utils/address.js
export const hasNoAddress = (user) => {
  if (!user) return true;
  
  const noAddress = (!user.street_address || user.street_address.trim() === '') &&
                    (!user.city || user.city.trim() === '') &&
                    (!user.district || user.district.trim() === '') &&
                    (!user.state || user.state.trim() === '') &&
                    (!user.pincode || user.pincode.trim() === '');
  
  console.log("🔍 No address check for user:", { 
    id: user.id, // Prefix ID
    noAddress 
  });
  return noAddress;
};