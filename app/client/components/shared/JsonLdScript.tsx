
type Props = {
  jsonLd: unknown;
};

export default function JsonLdScript({ jsonLd }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  );
}
