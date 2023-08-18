"use server";
import httpClient from "@/utils/http-client";

export async function uploadToCloudinary(formData: FormData) {
  if (formData instanceof FormData) {
    formData.append("upload_preset", "unsigned-uploads");
    const responseData = await httpClient({
      url: process.env.CLOUDINARY_UPLOAD_URL!,
      method: "POST",
      body: formData,
      isCustomUrl: true,
    });
    return responseData.secure_url;
  }
}
