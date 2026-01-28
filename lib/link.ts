export const normalizeLink = (link?: string) => {
  if (link === undefined || link === '.') {
    return '';
  }

  if (link.startsWith('/')) {
    return link;
  }
  return `/${link}`;
};

export const connectLinks = (a?: string, b?: string) => {
  return `${normalizeLink(a)}${normalizeLink(b)}`;
};
