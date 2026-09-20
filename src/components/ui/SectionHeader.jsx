export default function SectionHeader({
  icon = null,
  tag = null,
  title,
  subtitle = null,
  accent = '#27AE60',
  center = false,
}) {
  return (
    <div
      style={{
        marginBottom: 32,
        textAlign: center ? 'center' : 'left',
        display: 'flex',
        flexDirection: 'column',
        alignItems: center ? 'center' : 'flex-start',
      }}
    >
      {tag && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 12px',
            borderRadius: 999,
            background: `${accent}18`,
            border: `1px solid ${accent}44`,
            color: accent,
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          {icon && <span>{icon}</span>}
          <span>{tag}</span>
        </div>
      )}

      <h2
        style={{
          fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.2,
          color: '#e8f5e9',
          marginBottom: subtitle ? 8 : 0,
        }}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          style={{
            fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
            color: 'rgba(232, 245, 233, 0.6)',
            maxWidth: 640,
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
