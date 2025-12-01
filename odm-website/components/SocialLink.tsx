import React from 'react';

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

export const SocialLink = React.memo<SocialLinkProps>(({ href, icon, label }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-blue-500 transition-colors"
    aria-label={label}
  >
    {icon}
  </a>
));

SocialLink.displayName = 'SocialLink';

