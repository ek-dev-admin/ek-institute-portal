"use client";

import { useEffect, useRef, useState } from "react";
import { Check, FileText, LoaderCircle, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/api/errors";
import type { DocumentType, UserDocument } from "@/types/api";

import {
  confirmDocument,
  listDocuments,
  requestUploadUrl,
  uploadDocument,
} from "../services/documents.api";

const documentTypes: Array<{ value: DocumentType; label: string }> = [
  { value: "id_passport", label: "ID or passport" },
  { value: "proof_of_address", label: "Proof of address" },
  { value: "business_registration", label: "Business registration" },
  { value: "other", label: "Other" },
];

const labels = new Map(documentTypes.map((item) => [item.value, item.label]));

function formatSize(size?: number) {
  if (!size) return "Size unavailable";
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    new Date(value),
  );
}

export function DocumentsPanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [documentType, setDocumentType] = useState<DocumentType>("id_passport");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listDocuments()
      .then(setDocuments)
      .catch((reason) => setError(getErrorMessage(reason, "Unable to load documents")))
      .finally(() => setLoading(false));
  }, []);

  async function handleUpload(file: File) {
    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      const { documentId, uploadUrl } = await requestUploadUrl({
        documentType,
        contentType: file.type || "application/octet-stream",
      });
      await uploadDocument(uploadUrl, file);
      const document = await confirmDocument(documentId);
      setDocuments((current) => [document, ...current]);
      setMessage("Document uploaded and confirmed.");
    } catch (reason) {
      setError(getErrorMessage(reason, "Unable to upload document"));
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleConfirm(documentId: string) {
    setConfirming(documentId);
    setError(null);
    try {
      const document = await confirmDocument(documentId);
      setDocuments((current) => current.map((item) => (item.id === document.id ? document : item)));
    } catch (reason) {
      setError(getErrorMessage(reason, "Unable to confirm document"));
    } finally {
      setConfirming(null);
    }
  }

  return (
    <section className="mt-8 max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-black/30">
      <div className="border-b border-white/10 px-6 py-6 sm:px-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">Verification</p>
        <h2 className="mt-2 font-display text-2xl">Your documents</h2>
        <p className="mt-2 text-sm text-white/50">Upload the documents needed to complete your membership verification.</p>
      </div>

      <div className="space-y-5 px-6 py-6 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
            Document type
            <select value={documentType} onChange={(event) => setDocumentType(event.target.value as DocumentType)} className="mt-2 min-h-12 w-full rounded-lg border border-white/15 bg-white/5 px-4 text-sm font-normal normal-case tracking-normal text-white outline-none focus:border-gold">
              {documentTypes.map((item) => <option key={item.value} value={item.value} className="bg-panel">{item.label}</option>)}
            </select>
          </label>
          <input ref={inputRef} type="file" accept="application/pdf,image/jpeg,image/png" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void handleUpload(file); }} disabled={busy} />
          <Button type="button" variant="outline" disabled={busy} onClick={() => inputRef.current?.click()}>
            {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {busy ? "Uploading" : "Choose file"}
          </Button>
        </div>

        {message && <p className="text-sm text-emerald-300">{message}</p>}
        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}

        {loading ? <p className="text-sm text-white/45">Loading documents...</p> : documents.length === 0 ? <div className="border-t border-white/10 pt-5 text-sm text-white/45">No documents uploaded yet.</div> : <div className="divide-y divide-white/10 border-t border-white/10">{documents.map((document) => <div key={document.id} className="flex items-center gap-4 py-4"><FileText className="h-5 w-5 shrink-0 text-gold" /><div className="min-w-0 flex-1"><p className="truncate text-sm text-white/90">{labels.get(document.documentType) ?? document.documentType}</p><p className="mt-1 text-xs text-white/40">{formatDate(document.createdAt)} · {formatSize(document.sizeBytes)}</p></div>{document.confirmed ? <span className="flex items-center gap-1 text-xs text-emerald-300"><Check className="h-4 w-4" /> Confirmed</span> : <Button type="button" variant="ghost" disabled={confirming === document.id} onClick={() => void handleConfirm(document.id)}>{confirming === document.id ? "Checking" : "Confirm"}</Button>}</div>)}</div>}
      </div>
    </section>
  );
}
