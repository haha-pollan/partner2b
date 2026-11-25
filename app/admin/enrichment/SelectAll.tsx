"use client";

export default function SelectAll() {
  return (
    <input
      type="checkbox"
      aria-label="Select all on this page"
      onChange={(e) => {
        const on = e.currentTarget.checked;
        e.currentTarget.form?.querySelectorAll<HTMLInputElement>('input[name="id"]').forEach((c) => { c.checked = on; });
      }}
    />
  );
}
