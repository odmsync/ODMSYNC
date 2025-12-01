import React from 'react';

interface QuickLinkProps {
  href: string;
  text: string;
}

export const QuickLink = React.memo<QuickLinkProps>(({ href, text }) => (
  <li>
    <a href={href} aria-label={text} className="hover:text-blue-500 transition-colors">
      {text}
    </a>
  </li>
));

QuickLink.displayName = 'QuickLink';

