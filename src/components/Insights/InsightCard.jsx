import './Insights.css';

export default function InsightCard({ icon: Icon, iconBg, iconColor, label, value, description, delay = 0 }) {
  return (
    <div className="insight-card glass-card" style={{ animationDelay: `${delay}s` }}>
      <div
        className="insight-card-icon"
        style={{ background: iconBg, color: iconColor }}
      >
        <Icon size={22} />
      </div>
      <div className="insight-card-label">{label}</div>
      <div className="insight-card-value">{value}</div>
      <div className="insight-card-desc">{description}</div>
    </div>
  );
}
