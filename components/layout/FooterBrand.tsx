/**
 * Giant brand wordmark with an interior photo revealed inside the letters
 * (background-clip: text). On hover the photo slowly zooms + pans within the
 * letterforms — the animation lives in the `.footer-brand` / `:hover` CSS.
 */
export default function FooterBrand({ text }: { text: string }) {
  return (
    <div className="overflow-hidden px-4">
      <h2 className="footer-brand select-none cursor-default text-center leading-none">
        {text}
      </h2>
    </div>
  )
}
