export function getResumeDownloadUrl(fileUrl: string, fileName?: string | null): string {
  const safeName = (fileName?.trim() || 'Elango_Sugikaran_Resume')
    .replace(/[\\/:*?"<>|]+/g, '_')
    .replace(/\s+/g, '_')
    .replace(/\.pdf$/i, '');
  const downloadName = `${safeName || 'Resume'}.pdf`;

  const uploadPath = '/upload/';
  const uploadIndex = fileUrl.indexOf(uploadPath);
  if (uploadIndex === -1) return fileUrl;

  const suffixIndex = fileUrl.search(/[?#]/);
  const pathname = suffixIndex === -1 ? fileUrl : fileUrl.slice(0, suffixIndex);
  const suffix = suffixIndex === -1 ? '' : fileUrl.slice(suffixIndex);
  const afterUpload = pathname.slice(uploadIndex + uploadPath.length);
  const encodedDownloadName = encodeURIComponent(downloadName).replace(/\./g, '%2E');
  return `${pathname.slice(0, uploadIndex + uploadPath.length)}fl_attachment:${encodedDownloadName}/${afterUpload}${suffix}`;
}
