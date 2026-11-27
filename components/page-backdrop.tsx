export function PageBackdrop() {
  return (
    <div className="page-backdrop" aria-hidden="true">
      <svg
        className="page-backdrop-svg"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <path
          className="backdrop-line"
          d="M -120 220 C 260 110, 620 280, 980 180 C 1280 95, 1480 160, 1720 110"
        />
        <path
          className="backdrop-line backdrop-line-soft"
          d="M -140 258 C 250 148, 610 318, 975 218 C 1285 132, 1490 198, 1740 148"
        />
        <path
          className="backdrop-line backdrop-line-accent"
          d="M 1020 -40 C 1180 180, 1340 310, 1660 360"
        />
        <path
          className="backdrop-line"
          d="M -100 780 C 220 690, 480 860, 860 760 C 1190 672, 1440 760, 1720 670"
        />
        <path
          className="backdrop-line backdrop-line-soft"
          d="M -100 824 C 230 734, 495 904, 875 804 C 1205 716, 1455 804, 1735 714"
        />
        <circle className="backdrop-line backdrop-line-soft" cx="1440" cy="180" r="240" />
        <circle className="backdrop-line backdrop-line-soft" cx="140" cy="680" r="210" />
      </svg>
    </div>
  )
}
