import { apiRequest } from "@/lib/api/client";
import type { DocumentType, UserDocument } from "@/types/api";

type UploadUrlResponse = {
  documentId: string;
  uploadUrl: string;
};

export function listDocuments() {
  return apiRequest<UserDocument[]>("/api/documents");
}

export function requestUploadUrl(input: {
  documentType: DocumentType;
  contentType: string;
}) {
  return apiRequest<UploadUrlResponse>("/api/documents", {
    method: "POST",
    body: input,
  });
}

export async function uploadDocument(uploadUrl: string, file: File) {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });

  if (!response.ok) {
    throw new Error("The file could not be uploaded");
  }
}

export function confirmDocument(documentId: string) {
  return apiRequest<UserDocument>(`/api/documents/${documentId}/confirm`, {
    method: "POST",
  });
}
