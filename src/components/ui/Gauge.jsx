export default function Gauge({
  value,
  min = 20,
  max = 45,
  unit = '°C',
  label = '',
  color = '#27AE60',
  size = 'md',
}) {
  const dim = size === 'sm' ? 90 : size === 'lg' ? 160 : 120;
  const strokeWidth = size === 'sm' ? 8 : 10;
  const radius = (dim - strokeWidth * 2) / 2;
  const cx = dim / 2;
  const cy = dim / 2;

  // 240 degree gauge (from 150 deg to 390 deg)
  const clamped = Math.max(min, Math.min(max, value));
  const fraction = (clamped - min) / (max - min);

  const startAngle = 135;
  const endAngle = 405;
  const totalAngle = endAngle - startAngle;
  const currentAngle = startAngle + fraction * totalAngle;

  function polarToCartesian(centerX, centerY, rad, angleInDegrees) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + rad * Math.cos(angleInRadians),
      y: centerY + rad * Math.sin(angleInRadians),
    };
  }

  function describeArc(x, y, rad, startAng, endAng) {
    const start = polarToCartesian(x, y, rad, endAng);
    const end = polarToCartesian(x, y, rad, startAng);
    const largeArcFlag = endAng - startAng <= 180 ? '0' : '1';
    return ['M', start.x, start.y, 'A', rad, rad, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  }

  const bgPath = describeArc(cx, cy, radius, startAngle, endAngle);
  const activePath = fraction > 0.01 ? describeArc(cx, cy, radius, startAngle, currentAngle) : '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        {/* Background track */}
        <path
          d={bgPath}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Active arc */}
        {activePath && (
          <path
            d={activePath}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 6px ${color}88)`,
              transition: 'stroke-dashoffset 0.5s ease',
            }}
          />
        )}
        {/* Value text in center */}
        <text
          x={cx}
          y={cy + 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#e8f5e9"
          fontSize={size === 'sm' ? '1rem' : size === 'lg' ? '1.8rem' : '1.35rem'}
          fontWeight="800"
          fontFamily="inherit"
        >
          {typeof value === 'number' ? value.toFixed(1) : value}
        </text>
        <text
          x={cx}
          y={cy + (size === 'sm' ? 16 : 22)}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={color}
          fontSize={size === 'sm' ? '0.65rem' : '0.75rem'}
          fontWeight="600"
          fontFamily="inherit"
        >
          {unit}
        </text>
      </svg>
      {label && (
        <span
          style={{
            fontSize: '0.75rem',
            color: 'rgba(232, 245, 233, 0.6)',
            fontWeight: 500,
            marginTop: -6,
            textAlign: 'center',
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
