import React from 'react';

interface ContactItemProps {
  icon: React.ReactNode;
  text: string;
  href?: string;
}

export const ContactItem = React.memo<ContactItemProps>(({ icon, text, href }) => (
  <li className="flex items-center gap-2 text-sm">
    <span className="text-blue-500 flex-shrink-0">{icon}</span>
    {href ? (
      <a href={href} className="hover:text-blue-500 transition-colors">{text}</a>
    ) : (
      <span>{text}</span>
    )}
  </li>
));

ContactItem.displayName = 'ContactItem';

