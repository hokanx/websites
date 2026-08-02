/**
 * The client's real STAMP BURGER mark.
 *
 * Lifted off the supplied screenshot: the cream artwork was separated onto
 * transparency at 1487x1112 and downscaled to 900px for the web, so it sits on
 * the brand ground with no JPEG box around it. Both lockups are intact — the
 * Arabic ستامب برجر above the Latin STAMP, with BURGER / برجر beneath.
 *
 * Sized by height everywhere it is used, so one asset serves the nav, the
 * film's logo landing and the footer.
 */
export default function Logo({ height = 40, className = '', title = 'STAMP BURGER' }) {
  return (
    <img
      className={className}
      src={`${import.meta.env.BASE_URL}assets/logo.png`}
      alt={title}
      /* No inline sizing when height is omitted, so the CSS (e.g. the film's
         logo landing, which sizes by width) is free to win. */
      style={height ? { height: `${height}px`, width: 'auto' } : undefined}
      decoding="async"
    />
  )
}
