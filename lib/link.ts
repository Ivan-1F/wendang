export const normalizeLink = (link?: string) => {
  if (link === undefined || link === '.') {
    return '/';
  }

  if (link.startsWith('/')) {
    return link;
  }
  return `/${link}`;
};

export const connectLinks = (a?: string, b?: string) => {
  const isRoot = (link?: string) => link === undefined || link === '.';

  if (isRoot(a) && isRoot(b)) {
    return '/';
  }
  if (isRoot(b)) {
    return normalizeLink(a);
  }
  if (isRoot(a)) {
    return normalizeLink(b);
  }
  return `${normalizeLink(a)}${normalizeLink(b)}`;
};
