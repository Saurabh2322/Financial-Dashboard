import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'No data found', message = 'Try adjusting your filters or adding new entries.' }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Inbox size={28} />
      </div>
      <h4>{title}</h4>
      <p>{message}</p>
    </div>
  );
}
