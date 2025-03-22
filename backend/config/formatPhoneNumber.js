// Utility to format phone number to E.164 format
 const formatToE164 = (countryCode, phoneNumber) => {
    // Remove all non-numeric characters
    const cleanNumber = phoneNumber.replace(/[^\d]/g, "");
  
    // Remove leading zeros if present
    const formattedNumber = cleanNumber.replace(/^0+/, "");
  
    // Combine with country code
    return `+${countryCode}${formattedNumber}`;
  };
 export default formatToE164; 