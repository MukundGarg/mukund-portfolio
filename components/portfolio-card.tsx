import React from "react";

interface Metric {
  label: string;
  value: React.ReactNode;
  id?: string;
}

interface PortfolioCardProps {
  id: string;
  num: string;
  kicker: string;
  title: string;
  description: string;
  metrics?: Metric[];
  className?: string;
  children?: React.ReactNode;
}

export function PortfolioCard({
  id,
  num,
  kicker,
  title,
  description,
  metrics,
  className = "",
  children,
}: PortfolioCardProps) {
  return (
    <div
      id={id}
      className={`stage-card ${className}`}
    >
      <div className="num mono">{num}</div>
      <div className="kicker">
        <span className="bar"></span>
        {kicker}
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
      
      {metrics && metrics.length > 0 && (
        <div className="metrics">
          {metrics.map((m, i) => (
            <div key={i} className="m">
              <span className="k">{m.label}</span>
              <span className="v mono" id={m.id}>
                {m.value}
              </span>
            </div>
          ))}
        </div>
      )}
      
      {children}
    </div>
  );
}
