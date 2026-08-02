/**
 * Interim wordmark.
 *
 * The client's real logo file has not been received yet. This is an inline SVG
 * (not an <img>) specifically so it renders with the page's own loaded Archivo
 * Black webfont and stays crisp at any size — including the film's logo landing.
 *
 * When the real mark arrives, swap this component's internals for the supplied
 * artwork; every call site already sizes itself from the `height` prop.
 */
export default function Logo({ height = 40, className = '', title = 'STAMP BURGER' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 260 104"
      height={height}
      role="img"
      aria-label={title}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* stamp frame with cut corners */}
      <path
        d="M6 6h228l20 20v72H26L6 78V6Z"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M14 14h216l12 12v64H26L14 78V14Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="4 5"
        opacity="0.45"
        fill="none"
      />
      <text
        x="130"
        y="52"
        textAnchor="middle"
        fontFamily="'Archivo Black', system-ui, sans-serif"
        fontSize="34"
        letterSpacing="1"
        fill="currentColor"
      >
        STAMP
      </text>
      <text
        x="130"
        y="80"
        textAnchor="middle"
        fontFamily="'IBM Plex Mono', ui-monospace, monospace"
        fontSize="14"
        letterSpacing="7"
        fill="currentColor"
        opacity="0.85"
      >
        BURGER
      </text>
    </svg>
  )
}
